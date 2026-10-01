---
title: "Smart Pointers em C++ — Como Escolher Entre unique_ptr, shared_ptr e weak_ptr"
description: "Custos de ownership, layout do control block, make_shared vs shared_ptr(new T), enable_shared_from_this, ciclos e as assinaturas de API que vazam bugs de tempo de vida."
publishedAt: 2026-09-30
author: Dionisio
tags:
  - C++
  - Smart Pointers
  - Ownership
  - Performance
  - Boas Práticas
cover: /assets/images/smart-pointers.png
coverAlt: Três modelos de ownership lado a lado — um dono único, um control block compartilhado com contador e um observador fraco
---

<section class="ae-feature">
  <img src="/assets/images/smart-pointers.png" alt="Três modelos de ownership lado a lado — um dono único, um control block compartilhado com contador e um observador fraco" loading="eager" width="1200" height="630" fetchpriority="high" decoding="async" />
  <div class="ae-feature-copy">
    <p class="ae-kicker">C++ · Ownership · std::memory</p>
    <h2>A maior parte dos bugs de smart pointer não é bug de memória. É bug de ownership.</h2>
    <p>Ninguém dá double free num <code>shared_ptr</code>. Passam um por valor para um callback que sobrevive ao objeto, e depois se perguntam por que nada é destruído.</p>
    <div class="ae-meta"><span>C++11 → C++17</span><span>std::memory</span><span>Lifetime</span></div>
  </div>
</section>

Se você escreve C++ na última década, conhece os três nomes. `unique_ptr` para posse exclusiva, `shared_ptr` para compartilhada, `weak_ptr` para observar sem possuir. Repetir isso não serve para nada.

O que serve é a parte que não está no resumo de uma linha: **`shared_ptr` não é "o ponteiro seguro".** É um modelo de posse específico com um custo específico, e a maior parte dos bugs que as pessoas atribuem a smart pointers é, na verdade, o modelo errado escolhido para o problema. Um `shared_ptr` passado por valor para uma lambda que sobrevive ao escopo não quebra — ele mantém silenciosamente um objeto vivo pelo tempo de vida do processo. Essa é uma falha *diferente* de um double free, e bem mais difícil de achar.

Há uma [versão em inglês](/en/artigos-tecnicos/smart-pointers/).

## A Decisão Que Importa É a Primeira

Antes de qualquer questão de API, responda: **quantos donos esse objeto tem?**

| Donos | Tipo | Por quê |
| --- | --- | --- |
| Exatamente um | `std::unique_ptr<T>` | Sem overhead, sem atômico, movimento transfere a posse |
| O último de vários | `std::shared_ptr<T>` | Tempo de vida por contagem de referências |
| Zero — eu só preciso olhar | `T*` ou `T&` | Uma referência não-possuidora |
| Zero — preciso saber se ainda existe | `std::weak_ptr<T>` | Observa um `shared_ptr` sem mantê-lo vivo |
| Não preciso de alocação dinâmica | `T` | Um valor. A opção mais subutilizada. |

A maioria dos códigos melhoraria movendo entradas *para cima* nesta tabela, não para baixo. Se você não consegue nomear o segundo dono, não existe segundo dono, e o `shared_ptr` está te vendendo um incremento atômico que você não precisava.

O sinal de que você escolheu errado costuma ser um `shared_ptr` em parâmetro de função. Pergunte o que a função faz com a posse: se ela não guarda o ponteiro, não entrega para algo que sobrevive à chamada, e não precisa observar a contagem, ela não precisa de `shared_ptr`. Precisa de referência.

```cpp
// A assinatura diz "posso assumir a posse". Não assume — lê o valor.
double price_of(const std::shared_ptr<Instrument>& inst);

// A assinatura diz "preciso que isso exista agora". É a verdade.
double price_of(const Instrument& inst);

// A assinatura diz "posso guardar isso, ou nada". Também é a verdade.
void register_instrument(std::shared_ptr<Instrument> inst);
```

**Essa distinção é o custo inteiro do artigo.** Um parâmetro `shared_ptr` que nunca é guardado é uma extensão de tempo de vida que o chamador não pediu, e é invisível no call site: `price_of(ptr)` e `price_of(*ptr)` parecem igualmente razoáveis.

## unique_ptr: O Padrão, Não o Plano B

`unique_ptr` deveria ser seu primeiro reflexo. É uma abstração de custo zero, move, se recusa a copiar, e quando morre o objeto morre. Não há nada a ajustar.

```cpp
#include <memory>
#include <cassert>

struct Connection { ~Connection() { /* libera */ } };

std::unique_ptr<Connection> make_connection() {
    return std::make_unique<Connection>();   // C++14
}

int main() {
    auto conn = make_connection();
    assert(conn != nullptr);
    auto moved = std::move(conn);
    assert(conn == nullptr);                 // movido-de é válido e vazio
}
```

Três detalhes que aparecem em review:

- **`make_unique` é C++14; o `unique_ptr` em si é C++11.** Se você está em C++11, escreve `std::unique_ptr<T>(new T(...))` — correto, só verboso. O [mapa de versões](/pt/artigos-tecnicos/cpp-versoes-features/) acompanha isso.
- **`make_unique` não é só conveniência.** Ele chama o construtor e a alocação numa expressão só, então não existe janela em que um construtor que lança vaze. `f(std::unique_ptr<T>(new T), g())` pode vazar em C++11 porque a ordem de avaliação de argumentos é indefinida; `make_unique` fecha esse buraco.
- **O deleter faz parte do tipo.** `unique_ptr<T, D>` com um `D` customizado não é o mesmo tipo que `unique_ptr<T>`, e muda o tamanho. Uma função retornando a combinação errada não compila — e é esse o ponto.

Para arrays existe `unique_ptr<T[]>`, que chama `delete[]`. Prefira um container. A exceção é um buffer de tamanho fixo que você não consegue expressar de outro jeito, e isso é raro.

## shared_ptr: O Que Você Está Realmente Pagando

Um `shared_ptr<T>` são dois ponteiros: um para o objeto, um para um **control block**. Esse control block guarda a contagem forte, a contagem fraca e o deleter.

```
shared_ptr<T>  ──┬──> T           (o objeto)
                 └──> control_block { strong: 2, weak: 1, deleter }
```

Três consequências decorrem disso, e as três causam bugs reais:

- **Toda cópia é uma operação atômica.** Copiar um `shared_ptr` é um incremento atômico relaxado; destruir é um decremento acquire/release. É barato, não é de graça, e num laço quente não é erro de arredondamento. Passe por `const&` quando só lê.
- **Duas alocações, a menos que você use `make_shared`.** `std::shared_ptr<T>(new T)` aloca o objeto e depois aloca o control block. `std::make_shared<T>()` aloca os dois num bloco só. É mais rápido e mais amigável ao cache — e tem uma consequência que as pessoas não esperam: **a memória do objeto não é liberada enquanto o último `weak_ptr` também não morrer**, porque o control block e o objeto compartilham a alocação. Com um `weak_ptr` de vida longa, `make_shared` mantém a memória viva depois que o destrutor já rodou.
- **A contagem é compartilhada, o ponteiro não.** Dois `shared_ptr` para o mesmo objeto estão ok. **Dois `shared_ptr` criados independentemente para o mesmo ponteiro cru são double free**, porque cada um tem seu próprio control block. Esse é o erro clássico com `this`:

```cpp
struct Widget {
    // ERRADO: cria um segundo control block a cada chamada -> double free
    std::shared_ptr<Widget> self() { return std::shared_ptr<Widget>(this); }
};
```

O conserto é `enable_shared_from_this`, e só quando o objeto é genuinamente gerenciado por um `shared_ptr`:

```cpp
#include <memory>

struct Widget : std::enable_shared_from_this<Widget> {
    std::shared_ptr<Widget> self() { return shared_from_this(); }
};

// Chame só depois que um shared_ptr possui o objeto:
// auto w = std::make_shared<Widget>();
// auto s = w->self();          // OK: compartilha o control block existente
```

Chamar `shared_from_this()` num objeto que nenhum `shared_ptr` possui lança `std::bad_weak_ptr`, ou é comportamento indefinido antes do C++17. Essa é a armadilha: o construtor não pode chamá-lo, porque o `shared_ptr` ainda não existe. Mova esse trabalho para uma factory ou um `init()` explícito.

## weak_ptr: Quebrar Ciclos, Observar Sem Possuir

`weak_ptr` existe para dois trabalhos, e confundi-los causa vazamento.

**Trabalho um: entregar uma referência que não estende o tempo de vida.** Um cache guardando `shared_ptr` manteria toda entrada viva para sempre. Guardar `weak_ptr` mantém a contagem honesta — a entrada morre quando os donos reais terminam.

```cpp
#include <iostream>
#include <memory>
#include <vector>

class Registry {
    std::vector<std::weak_ptr<int>> entries_;
public:
    void add(const std::shared_ptr<int>& item) { entries_.push_back(item); }

    void report() const {
        for (const auto& weak : entries_) {
            if (auto locked = weak.lock()) {          // ref forte temporária
                std::cout << "vivo: " << *locked << '\n';
            } else {
                std::cout << "expirado\n";            // o dono se foi
            }
        }
    }
};
```

`lock()` devolve um `shared_ptr` que é válido ou nulo — nunca um ponteiro pendente. Repare na forma do laço: o `shared_ptr` vive só dentro do `if`, então não pode estender o tempo de vida por acidente além do statement. Se você se pegar guardando o resultado de `lock()`, pergunte se você queria mesmo possuir aquilo.

**Trabalho dois: quebrar um ciclo de referências fortes.** Dois `shared_ptr` apontando um para o outro mantêm ambos vivos para sempre, e nenhum dos dois destrutores roda.

```cpp
struct Node {
    std::shared_ptr<Node> next;    // forte: "eu possuo meu sucessor"
    std::weak_ptr<Node>  parent;   // fraca:  "eu sei quem me possui"
};
```

Uma lista duplamente ligada de `shared_ptr` é o vazamento canônico. A regra: **numa relação pai/filho, o pai possui forte e o filho aponta de volta fraco.** Desenhe o grafo antes de escolher o tipo.

## APIs Comuns: Onde os Tempos de Vida Mudam Silenciosamente

Várias APIs padrão têm forma de `shared_ptr`, e cada uma tem uma regra de tempo de vida que surpreende:

- **`std::enable_shared_from_this`** — coberto acima. Exige posse prévia.
- **`std::static_pointer_cast` / `dynamic_pointer_cast` / `const_pointer_cast`** — compartilham o control block, então a contagem é preservada. `dynamic_pointer_cast` num cast que falha devolve um `shared_ptr` vazio. Use esses em vez de fazer cast no ponteiro cru e reconstruir um `shared_ptr`, o que criaria um segundo control block.
- **`std::atomic<std::shared_ptr<T>>`** — C++20. Em C++11/14/17, as funções livres `std::atomic_*` sobre um `shared_ptr` são a forma suportada, e não são lock-free em geral. Se um `shared_ptr` está sendo lido e escrito de várias threads, um `shared_ptr` simples é data race, mesmo que a contagem em si seja atômica. **A contagem é thread-safe; o ponteiro não é.**
- **`std::weak_ptr::lock()`** — a única forma correta de obter uma referência forte a partir de uma fraca. Nunca `weak.lock().get()` e guarde o ponteiro cru.

## Quanto Custa

Números aproximados numa máquina de 64 bits, em bytes e ciclos, porque "smart pointers são de graça" é uma afirmação que vale conferir:

| Tipo | Tamanho | Custo de cópia |
| --- | --- | --- |
| `unique_ptr<T>` (deleter padrão) | 8 bytes | não permitido |
| `unique_ptr<T, D>` com deleter com estado | 8 + `sizeof(D)` | não permitido |
| `shared_ptr<T>` | 16 bytes | 1 incremento atômico + cópia de ponteiro |
| `weak_ptr<T>` | 16 bytes | 1 incremento atômico (contagem fraca) |
| `control_block` | ~24 bytes + estado do deleter | — |

Duas conclusões. Primeiro, `unique_ptr` tem o tamanho de um ponteiro cru e compila para o mesmo código — não há argumento para ponteiro cru possuidor depois que você pode usar ele. Segundo, `shared_ptr` não é "um ponteiro com segurança"; é um ponteiro mais um atômico mais uma alocação no heap, e num caminho de dados estilo structure-of-arrays isso é a diferença entre caber no cache e não caber.

Para o lado de performance dessa troca, veja [Cache Affinity](/pt/artigos-tecnicos/cache-affinity/).

## C++17 e Depois: As Vitórias Pequenas

Se seu baseline é C++17 ou mais novo, alguns extras removem atrito de verdade:

- **`std::unique_ptr` em init statements de `if`** — `if (auto handle = acquire(); handle) { ... }` escopa a posse no branch, que é exatamente o tempo de vida que você queria.
- **Structured bindings** deixam a natureza de par-de-ponteiros do `shared_ptr` visível quando você precisa, embora quase nunca devesse precisar.
- **`std::make_unique` e `std::make_shared` são o padrão.** Escrever `new` fora de uma factory é code smell que vale apontar em review.
- **`std::inplace_vector` e afins** (C++26) reduzem os casos em que você precisava de alocação no heap. A melhor forma de evitar o custo de smart pointer é evitar a alocação.

O [mapa de C++ por versão](/pt/artigos-tecnicos/cpp-versoes-features/) vale manter aberto enquanto você decide o que seu projeto consegue de fato compilar.

## O Checklist de Review

Cinco perguntas que pegam quase todo defeito de smart pointer que já vi em produção:

1. **Existe mais de um dono?** Se não, `unique_ptr` — ou um valor.
2. **Esse parâmetro `shared_ptr` é guardado?** Se não, deveria ser `T&` ou `T*`.
3. **Existe um ciclo?** Desenhe o grafo de posse. Todo laço precisa de um `weak_ptr` em algum ponto, e ele deve ser a aresta de volta.
4. **Alguém escreveu `shared_ptr(this)`?** Deveria ser `enable_shared_from_this`.
5. **Esse ponteiro é lido e escrito entre threads?** A contagem é atômica; o ponteiro não. Use `atomic<shared_ptr<T>>` (C++20) ou as funções atômicas livres, ou reestruture para não compartilhar.

Repare no que falta: nenhuma dessas perguntas é sobre `delete`. O RAII já resolveu isso. O que sobra são perguntas sobre *quem possui o quê*, e o compilador não pode respondê-las por você — um tipo só consegue codificar o modelo que você escolheu.

## Continue Lendo

- [RAII em C++](/pt/artigos-tecnicos/raii/) — o mecanismo sobre o qual esses tipos são construídos, e de onde vem ownership no sistema de tipos.
- [Paralelismo vs. Concorrência](/pt/artigos-tecnicos/paralelismo-vs-concorrencia/) — o contexto onde o custo do incremento atômico e a ressalva de thread-safety realmente mordem.
- [Trilha prática de C++](/pt/reference/trilha-cpp/) — ownership, move semantics, ranges e performance, com exercícios e um checklist gratuito.
- [C++ por Versão](/pt/artigos-tecnicos/cpp-versoes-features/) — quando `make_shared`, `make_unique` e `atomic<shared_ptr>` chegaram.

Smart pointers não eliminam a questão de ownership. Eles tornam possível respondê-la uma vez, no tipo, em vez de em todo call site — o que só é uma melhoria se a resposta que você escreveu foi a verdadeira.
