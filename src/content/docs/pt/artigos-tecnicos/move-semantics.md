---
title: "Move Semantics em C++ — std::move Não Move Nada"
description: "\"std::move\" é um cast, não uma ação. Para o que uma referência rvalue realmente liga, por que moved-from é \"válido mas não especificado\", e onde a cópia que você achou ter eliminado continua lá."
publishedAt: 2026-10-07
author: Dionisio
tags:
  - C++
  - Move Semantics
  - Performance
  - Ownership
  - Boas Práticas
cover: /assets/images/move-semantics.png
coverAlt: Um lvalue sendo convertido em xvalue e seu ponteiro de buffer transferido para um novo objeto, deixando a origem vazia
---

<section class="ae-feature">
  <img src="/assets/images/move-semantics.png" alt="Um lvalue sendo convertido em xvalue e seu ponteiro de buffer transferido para um novo objeto, deixando a origem vazia" loading="eager" width="1200" height="630" fetchpriority="high" decoding="async" />
  <div class="ae-feature-copy">
    <p class="ae-kicker">C++ · Move Semantics · Performance</p>
    <h2><code>std::move</code> não move nada</h2>
    <p>É um cast. Produz uma referência rvalue e sai do caminho. Se algum byte é de fato movido é decidido depois, na resolução de sobrecarga — exatamente onde a maioria das pessoas para de ler e começa a adivinhar.</p>
    <div class="ae-meta"><span>C++11 → C++20</span><span>Categorias de valor</span><span>RVO</span></div>
  </div>
</section>

Tem uma frase que encerra mais discussões de C++ do que qualquer outra: "usei `std::move`, então não tem cópia". Soa como um fato. É um desejo.

`std::move` tem um único trabalho, e não é o trabalho que o nome anuncia. Ele converte o argumento para uma referência rvalue — nada mais. Nenhum byte de memória é tocado. Nenhum buffer é transferido. Nenhum construtor roda. Se isso soa decepcionante, você está começando a entender o assunto.

Move semantics é a feature que mudou o que "passar por valor" custa, que tornou o `unique_ptr` possível, que transformou uma cópia de `std::vector` em um roubo de ponteiro. É também a feature onde a distância entre o que você *acha* que o compilador faz e o que ele *de fato* faz tem as consequências mais caras. Este artigo é sobre fechar essa distância.

Há uma [versão em inglês](/en/artigos-tecnicos/move-semantics/).

## O Que std::move Realmente É

Abra a biblioteca padrão e você encontra isto:

```cpp
template <class T>
constexpr std::remove_reference_t<T>&& move(T&& t) noexcept {
    return static_cast<std::remove_reference_t<T>&&>(t);
}
```

Essa é a função inteira. É `constexpr`, é `noexcept`, e não gera código nenhum. **`std::move` é um cast nomeado com um departamento de marketing.** A [entrada do cppreference sobre `std::move`](https://en.cppreference.com/w/cpp/utility/move) diz o mesmo com mais educação: ele "produz uma expressão xvalue que identifica seu argumento".

Então quando você escreve isto:

```cpp
std::string a = "olá, esta é uma string razoavelmente longa que possui um buffer no heap";
std::string b = std::move(a);
```

o move não acontece na linha do `std::move`. Acontece no `=` — mais especificamente, acontece *se* `std::string` tiver um construtor de move e *se* a resolução de sobrecarga escolher ele em vez do construtor de cópia. O `std::move` não realiza a transferência; ele torna a transferência *elegível*. O tipo faz o resto.

Esse é o primeiro lugar onde as pessoas se perdem. `std::move` não é um verbo. É um adjetivo. Ele marca o argumento como "okay canibalizar", e aí um construtor, ou uma atribuição, ou um método de container decide se aceita a oferta.

## Categorias de Valor, a Versão de Três Palavras

Você pode escrever C++ de produção por anos sem dizer "xvalue" em voz alta. Mas move semantics é escrito em categorias de valor, então aqui estão as três que você precisa:

- **lvalue** — tem nome, tem endereço, pode aparecer à esquerda do `=`. O `a` do trecho acima. "Eu sou uma coisa à qual você pode se referir de novo."
- **prvalue** — um temporário puro. `std::string{"temp"}`. "Eu sou um valor, não um lugar."
- **xvalue** — um lvalue "expirando". O resultado de `std::move(a)`. "Eu ainda nomeio uma coisa, mas você pode levar as tripas dela."

Um **rvalue** é um prvalue ou um xvalue. Uma referência rvalue (`T&&`) liga em rvalues. Um construtor de move recebe `T&&`. A resolução de sobrecarga prefere `T&&` a `const T&` quando o argumento é um rvalue — essa preferência *é* move semantics. Todo o resto é contabilidade.

A regra que mais derruba gente: **uma variável cujo tipo é `T&&` é ela própria um lvalue.** O nome tem endereço; é uma coisa à qual você pode se referir de novo. É por isso que um construtor de move precisa escrever `std::move(arg.member)` e não só `arg.member`:

```cpp
// Construtor de move simples
A(A&& arg) : member(std::move(arg.member)) // "arg.member" é lvalue
{}

// Operador de atribuição por move simples
A& operator=(A&& other) {
    member = std::move(other.member);
    return *this;
}
```

Esqueça o `std::move` interno e você tem uma cópia. O compilador não vai te avisar. O código vai estar correto e mais lento do que você alegou que era, o que é o pior tipo de correto.

## A Demo Que Todo Mundo Deveria Rodar Uma Vez

Aqui está o fato que encerra a discussão. Instrumente um tipo, conte as operações, assista.

```cpp
#include <iostream>
#include <utility>
#include <vector>

struct Tracker {
    std::string name;
    explicit Tracker(std::string n) : name(std::move(n)) {}
    Tracker(const Tracker& o) : name(o.name) { std::cout << "  COPY " << name << '\n'; }
    Tracker(Tracker&& o) noexcept : name(std::move(o.name))
    { std::cout << "  MOVE " << name << '\n'; }
};

int main() {
    std::vector<Tracker> v;
    v.reserve(1);

    Tracker local("local");
    std::cout << "push_back(local):\n";
    v.push_back(local);                  // lvalue -> COPY

    std::cout << "push_back(std::move(local)):\n";
    v.push_back(std::move(local));       // xvalue -> MOVE
}
```

Saída:

```
push_back(local):
  COPY local
push_back(std::move(local)):
  MOVE local
```

A primeira chamada copia. A segunda move. Mesma função, mesmo objeto, a uma distância de um cast. **Essa é a proposta de valor inteira, e você acabou de vê-la não fazer nada** — até a resolução de sobrecarga decidir que faria alguma coisa. Esse também é o modelo mental que torna o resto do artigo óbvio em vez de surpreendente.

## Onde a Cópia Que Você Eliminou Ainda Está

Seis formas de a afirmação "usei `std::move`" falhar em silêncio. Cada uma já mordeu uma base de código de verdade.

**1. O tipo não tem operações de move.** Um tipo definido pelo usuário com destrutor, construtor de cópia ou operador de atribuição por cópia declarados **não** gera construtor de move implícito — ele *não* é gerado, e o `std::move` vai cair de volta alegremente na cópia. Você escreveu `std::move`; você ganhou uma cópia. Essa é a armadilha da [Regra dos Cinco](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-five): declare um dos membros especiais e você precisa considerar os cinco.

```cpp
struct NoMove {
    std::string data;
    ~NoMove() {}                 // destrutor declarado pelo usuário
    // ...nenhum move ctor/assign é declarado implicitamente...
};

NoMove a;
NoMove b = std::move(a);         // chama o construtor de CÓPIA. Sim, de verdade.
```

Declare o destrutor e o compilador para de te oferecer moves. Adicione `NoMove(NoMove&&) = default;` e `NoMove& operator=(NoMove&&) = default;` se quiser eles de volta.

**2. O argumento é `const`.** `std::move` num objeto `const` produz um `const T&&`. Nenhum construtor de move recebe `const T&&` — mover exige mutar a origem. A resolução de sobrecarga cai na cópia, sempre. `const std::string&&` liga, e aí você copia.

```cpp
const std::string name = "imutável para sempre";
auto copy = std::move(name);     // const T&& -> construtor de cópia. Em silêncio.
```

Alguns compiladores agora emitem um diagnóstico próximo de `-Wpessimizing-move` para isso; não confie nele. **Um rvalue `const` é uma contradição.** O `std::move` não conserta um objeto `const`, porque mover *é* uma mutação.

**3. Você moveu um membro mas não o resto.** Um construtor de move que move três de quatro membros deixa o quarto copiado. Compila, parece movido, e um campo te custa uma alocação. É por isso que `= default` importa quando o compilador consegue gerar um move correto para você.

**4. O construtor de move não é `noexcept`, e um container desistiu dele.** A realocação do `std::vector` oferece a garantia forte de exceção. Ele só consegue isso com um move `noexcept`, porque se um move lançasse no meio da realocação não existe caminho de volta. Se seu move pode lançar, **o `std::vector` copia em vez de mover** — e faz isso em silêncio, a cada crescimento. Marque os moves como `noexcept` ou perca-os exatamente onde mais importam.

```cpp
// Este move pode lançar, então o vector vai copiar na realocação.
Widget(Widget&& other) : data_(std::move(other.data_)) { /* ...pode lançar... */ }

// Neste o vector confia. Marque.
Widget(Widget&& other) noexcept : data_(std::move(other.data_)) {}
```

**5. Era um return, e a elisão de cópia já tinha feito o trabalho.** Desde C++17, retornar um prvalue — `return Widget{...};` — tem **elisão de cópia garantida**; não há move nem cópia, o objeto é construído direto no armazenamento do chamador. E retornar um local nomeado é NRVO, que o compilador faz com ou sem `std::move`. Escrever `return std::move(local);` pode *derrotar* a NRVO e forçar um move de verdade. É o único lugar onde o `std::move` é ativamente prejudicial. ([Elisão de cópia garantida do C++17](https://en.cppreference.com/w/cpp/language/copy_elision).)

```cpp
Widget make_bad() {
    Widget w;
    return std::move(w);   // pessimizing move: bloqueia a NRVO
}

Widget make_good() {
    Widget w;
    return w;              // NRVO, ou o move implícito de um local nomeado
}
```

**6. A assinatura recebe por valor mas você moveu para um parâmetro que nunca foi usado como destino de move.** Parâmetros "sink" — `void store(std::string s)` com chamadores escrevendo `store(std::move(name))` — funcionam, e movem. Mas um parâmetro por valor que depois é *copiado* para um membro em vez de movido perde todo o sentido. Mova-o na última vez que você o toca, em nenhum outro lugar.

## `std::move` em Assinaturas, `std::forward` em Templates

Uma regra que sobrevive ao contato com código de verdade:

- **`std::move` no corpo da função** quando você quer transferir a posse de algo que você possui.
- **`std::move` na lista de inicialização de membros do construtor** quando você está assumindo a posse de um parâmetro.
- **`std::forward<T>(t)` num template**, nunca `std::move`.

A diferença são as **forwarding references**. `T&&` onde `T` é um parâmetro de template deduzido não é uma referência rvalue — é uma forwarding reference, e ela liga tanto em lvalues quanto em rvalues. `std::forward` preserva a categoria de valor original; `std::move` a destrói. Use `std::move` numa forwarding reference e você vai transformar o lvalue de um chamador num objeto roubado. É assim que o `std::vector::emplace_back` vira uma armadilha que você mesmo escreveu.

```cpp
// ERRADO: uma forwarding reference que sempre move.
template <class T>
void bad_forward(T&& value) {
    consume(std::move(value));   // rouba também de chamadores com lvalue
}

// CERTO: preserve o que o chamador te deu.
template <class T>
void good_forward(T&& value) {
    consume(std::forward<T>(value));
}
```

## O Custo, Honestamente

Moves não são de graça, e fingir que são é como você termina confuso no profiler.

| Operação | O que faz |
| --- | --- |
| `std::move(x)` | Zero. Não compila para nada. Um cast. |
| Move de uma `std::string` | Rouba o ponteiro do buffer no heap. **O(1)**, sem alocação. |
| Move de um `std::vector` | Rouba o ponteiro do buffer. **O(1)**, sem alocação. |
| Move de um `std::array<T, N>` | **O(N)** — é um valor, não tem indireção para roubar. |
| Move de um tipo só com membros pequenos | Aproximadamente o custo de uma cópia, ou perto o bastante para não importar. |

Duas consequências que vale internalizar:

- **Moves brilham em tipos com um handle no heap e um ponteiro para roubar.** Para um `std::array<int, 4>`, um "move" são quatro cópias de int. A abstração não cria velocidade do nada; ela move a *posse* da coisa que era caro.
- **Um objeto moved-from não sumiu.** É "válido mas não especificado". Você pode destruí-lo, atribuir a ele, ou chamar qualquer operação sem precondições — `clear()`, `empty()`. Você não pode chamar nada com precondição, e não pode assumir nada sobre o valor dele.

## Moved-From É "Válido Mas Não Especificado" — Não "Vazio"

Essa é a frase que as pessoas pulam e depois debugam por duas horas.

```cpp
std::vector<std::string> v;
std::string str = "exemplo";
v.push_back(std::move(str));   // str agora é válida mas não especificada

str.back();                    // INDEFINIDO se size()==0; back() tem precondição
if (!str.empty())
    str.back();                // OK: empty() não tem precondição, e nós checamos
str.clear();                   // OK: clear() não tem precondições
```

O estado moved-from da `std::string` por acaso é vazio em toda implementação comum, e **não é garantido que seja**. Se `std::move` moveu sua `std::string`, não leia `str.size()` depois e ramifique sobre isso. Atribua a ela, reutilize-a como sink, ou deixe-a morrer. O contrato é deliberadamente estreito: [a padrão garante que os invariantes valem, nada mais](https://en.cppreference.com/w/cpp/utility/move). Escreva código contra o contrato, não contra o comportamento atual da libstdc++.

O auto-move tem sua própria pequena armadilha. `v = std::move(v);` é legal e deixa `v` num estado válido mas não especificado. Não é um no-op. Não escreva isso, e não "otimize" assumindo que não faz nada.

## O Que Usar no Lugar de Escrever Moves à Mão

A maioria do código não deveria declarar construtor de move nenhum. A Regra de Zero ainda ganha:

- **Deixe o compilador gerar os moves.** Uma classe só com membros que já são movíveis não precisa de operações de move. Escreva `= default` só quando tiver um motivo para suprimir ou forçar uma.
- **Siga a Regra dos Cinco quando precisar possuir um recurso cru.** Declare um membro especial e os outros não aparecem. Declare todos os cinco e ganhe a semântica que você quis.
- **Use `std::exchange` para o reset do moved-from.** Ele atribui o novo valor e retorna o antigo, numa expressão — o idioma canônico para escrever um move correto:
  ```cpp
  Widget(Widget&& other) noexcept
      : handle_(std::exchange(other.handle_, nullptr)) {}
  ```
- **`std::move_if_noexcept`** existe para o caso interno de container onde a garantia forte depende de `noexcept`. Você raramente vai chamá-lo; você deveria saber que é por isso que `noexcept` importa.

## O Checklist de Code Review

Cinco perguntas que pegam quase todo defeito de move semantics que já vi em produção:

1. **O move é de fato um move?** O tipo tem construtor de move `noexcept`, e o argumento é um rvalue não-`const`? Se qualquer um for falso, você copiou.
2. **Existem chamadas de `std::move` em objetos `const`?** Cada uma delas é uma cópia disfarçada.
3. **Todos os moves são `noexcept`?** Se não, o objeto é alguma vez armazenado num `std::vector`? Então ele está sendo copiado na realocação, em silêncio.
4. **Existe um `return std::move(local);`?** Remova. Você está brigando com a elisão de cópia garantida.
5. **`std::move` está sendo usado numa forwarding reference?** Deveria ser `std::forward<T>`, ou você está roubando de chamadores com lvalue.

Note sobre o que nenhuma dessas perguntas é: micro-tuning de performance. Todas são sobre *se o move aconteceu*. É aí que mora o custo real — não num move 3 nanocycles mais lento, mas numa cópia que você acreditava ser um move, rodando um milhão de vezes por hora.

## Fechando: O Cast Que Não É Uma Ação

Move semantics é uma ideia com um publicitário ruim. A ideia: o tempo de vida de um valor pode terminar antes, e o compilador vai escolher um construtor que o consome em vez de copiá-lo. O publicitário ruim: uma função chamada `std::move` que não move.

Depois que você internaliza que `std::move` é um *cast para xvalue* e que a resolução de sobrecarga é quem de fato decide, o resto para de ser trivia e vira um jeito de ler código — você pergunta "qual construtor roda aqui?" em vez de "isso é rápido?". As duas perguntas têm a mesma resposta.

E o hábito que vale manter: **quando você afirma um move, prove.** Instrumente o tipo, conte as operações, leia o assembly se quiser. "Usei `std::move`" não é evidência. Nunca foi. `std::move` é uma promessa que você faz ao conjunto de sobrecargas, e o conjunto de sobrecargas cumpre as promessas dele, não as suas.

## Continue Lendo

- [RAII em C++](/pt/artigos-tecnicos/raii/) — o modelo de posse do qual move semantics depende em silêncio, e as regras de membros especiais que fazem moves aparecerem ou sumirem.
- [Smart Pointers em C++](/pt/artigos-tecnicos/smart-pointers/) — onde o `std::move` é o mecanismo que faz do `unique_ptr` um dono de primeira classe.
- [C++ por Versão](/pt/artigos-tecnicos/cpp-versoes-features/) — onde referências rvalue, `noexcept` e elisão de cópia garantida entraram no padrão.
- [Trilha prática de C++](/pt/reference/trilha-cpp/) — move semantics como o passo três, com o exercício e um checklist de modernização gratuito.

O `std::move` não move nada. Entender por que é a lição inteira.
