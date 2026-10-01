---
title: "RAII em C++ — Ownership Como Tipo, Não Como Convenção"
description: "Como o RAII realmente funciona: construtores que adquirem, destrutores que liberam e as garantias de unwinding que tornam exceções seguras. Mais os casos onde o RAII quebra."
publishedAt: 2026-09-30
author: Dionisio
tags:
  - C++
  - RAII
  - Gerenciamento de Recursos
  - Sistemas Críticos
  - Boas Práticas
cover: /assets/images/raii.png
coverAlt: Um stack frame sendo desenrolado, com cada destrutor liberando seu recurso em ordem inversa
---

<section class="ae-feature">
  <img src="/assets/images/raii.png" alt="Um stack frame sendo desenrolado, com cada destrutor liberando seu recurso em ordem inversa" loading="eager" width="1200" height="630" fetchpriority="high" decoding="async" />
  <div class="ae-feature-copy">
    <p class="ae-kicker">C++ · Ownership · Exceções</p>
    <h2>O melhor código de limpeza é aquele que você nunca precisou escrever</h2>
    <p>RAII não é uma classe utilitária. É uma afirmação sobre a linguagem: o compilador vai rodar sua limpeza, em todo caminho de saída do escopo, não importa como você saia.</p>
    <div class="ae-meta"><span>C++98 → C++26</span><span>Exception safety</span><span>Handles</span></div>
  </div>
</section>

A maior parte dos bugs de recurso não é bug de lógica. É bug de caminho. A alocação aconteceu na linha 40, a falha aconteceu na linha 55, e o `free` que pertencia à linha 90 nunca rodou. Você não errou o algoritmo. Você deixou um branch passar.

RAII — *Resource Acquisition Is Initialization* — é a resposta do C++ para bugs de caminho. A regra é curta: **o tempo de vida de um recurso é amarrado ao tempo de vida de um objeto**. Você adquire no construtor, libera no destrutor, e deixa o compilador se preocupar com qual caminho de saída você tomou.

Há uma [versão em inglês](/en/artigos-tecnicos/raii/).

## O Que o Padrão Realmente Garante

RAII só serve se destrutores forem confiáveis. Eles são — em todo caminho que sai de um escopo de forma *normal* ou via exceção:

- Chegar ao fim do bloco
- `return`, `return expr`, `return void_expr`
- `goto` e `break`/`continue` para fora de um laço
- Uma exceção lançada do escopo ou de qualquer coisa que ele chamou

Em todos esses casos, os destrutores dos objetos de escopo completo rodam, em **ordem inversa à da construção**, incluindo as partes parcialmente construídas de classes base e membros. Isso é [*stack unwinding*](https://eel.is/c++draft/except.ctor), e é o mecanismo no qual o RAII se apoia.

A exceção — e ela é deliberada — é a terminação do processo. `std::exit`, `std::abort`, `std::quick_exit` e uma violação de `noexcept` encerram o processo sem unwinding. Seus destrutores não rodam. Se você escreve um serviço que chama `std::exit` de dentro de uma biblioteca, entenda que acabou de abrir mão da garantia. [As regras de terminação do padrão C++](https://eel.is/c++draft/except.terminate).

Há uma segunda garantia que é importante para correção mas fácil de esquecer: [`std::uncaught_exceptions()`](https://eel.is/c++draft/except.uncaught) permite que um destrutor pergunte se está rodando *por causa* de uma exceção. Essa é a diferença entre "limpeza normal" e "limpeza em falha", e um destrutor que lança durante o unwinding chama `std::terminate`. **Destrutores não podem lançar exceções.** Se sua limpeza pode falhar, ela precisa de um `close()` separado que você chama explicitamente no caminho de sucesso, com o destrutor como rede de segurança.

## O Exemplo Canônico

Todo o resto deste artigo é uma variação destas 15 linhas:

```cpp
#include <cstdio>
#include <cassert>
#include <stdexcept>

class File {
public:
    explicit File(const char* path) : handle_(std::fopen(path, "wb")) {
        if (!handle_) throw std::runtime_error("open failed");
    }
    ~File() { if (handle_) std::fclose(handle_); }

    File(const File&) = delete;                 // sem cópias: quem fecha?
    File& operator=(const File&) = delete;

    void write(const char* data, std::size_t n) {
        if (std::fwrite(data, 1, n, handle_) != n)
            throw std::runtime_error("write failed");
    }

private:
    std::FILE* handle_;
};
```

Agora compare as duas formas de usar:

```cpp
// Manual: correto hoje, errado depois da próxima edição
void manual() {
    std::FILE* f = std::fopen("data.bin", "wb");
    if (!f) throw std::runtime_error("open failed");
    if (std::fwrite("hello", 1, 5, f) != 5) {
        std::fclose(f);                         // você tem que lembrar disso
        throw std::runtime_error("write failed");
    }
    std::fclose(f);                             // e disso
}

// RAII: correto em todo caminho, incluindo os que você adicionar depois
void with_raii() {
    File f("data.bin");
    f.write("hello", 5);
}   // ~File roda no sucesso, no throw, no return antecipado
```

A segunda versão tem um único ponto de limpeza, e ele não está no seu código. É esse o ponto. A versão `manual()` *não* é errada — ela é errada de forma *frágil*, o que é pior, porque sobrevive à revisão e quebra no próximo refactor. **Análise estática acha um `fclose` faltando. Ela não acha o que você vai esquecer de adicionar daqui a seis meses.**

Repare também nas operações de cópia deletadas. Um tipo que possui um handle cru não pode ser copiado sem double free. Deletar a cópia não é enfeite — é o compilador se recusando a deixar um colega futuro escrever o bug por você.

## O RAII Funciona Porque Você Não É o Único Conversando Com o SO

A garantia da linguagem é necessária, não suficiente. O RAII te dá um caminho de limpeza correto e então entrega o recurso para uma camada com regras de correção próprias. É nessas regras que os bugs de verdade costumam morar.

- **`std::fclose` num stream com buffer pode falhar.** Ele dá flush, e o flush pode esbarrar em disco cheio ou conexão caída. Um destrutor que não pode reportar erro é aceitável para um arquivo que você só lê, e problema real para a escrita na qual você está confiando. Chame `std::fflush` explicitamente, confira o retorno, e só então feche. Esse é o bug de forma-RAII mais comum em C++ de produção.
- **POSIX garante que `close()` sucede**, mesmo se a conexão estiver quebrada, e que chamadas repetidas no mesmo descritor são seguras. É um contrato mais forte que o de `fclose`, e é por isso que descritores crus são mais fáceis de encapsular com segurança. [POSIX `close`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/close.html).
- **`free` e `delete` não reportam falha.** Se você entende que essas operações são chamadas para suceder e vão terminar o processo se não conseguirem, deletar num destrutor é honesto. Se você assume que retornam erro, está otimizando para um caso que nunca acontece.
- **`munmap`, `close` e estado de kernel** são tipicamente infalíveis nesse sentido, o que torna o padrão encapsula-e-esquece exatamente o certo.

A decisão de julgamento é: *a operação de liberação pode falhar de um jeito sobre o qual eu sou obrigado a agir?* Se sim, o RAII ainda te dá ordem e tempo de vida, mas o caminho visível precisa ser uma chamada explícita.

## As Ferramentas Que Você Deve Procurar Primeiro

Você raramente precisa escrever uma classe. A biblioteca padrão já entrega o vocabulário de ownership:

| Necessidade | Tipo |
| --- | --- |
| Posse exclusiva de um objeto no heap | `std::unique_ptr<T>` |
| Posse compartilhada com contagem de referências | `std::shared_ptr<T>` |
| Observador não-possuidor de um objeto compartilhado | `std::weak_ptr<T>` |
| Um handle de arquivo | `std::fstream`, `std::ofstream`, `std::ifstream` |
| Um mutex mantido por um escopo | `std::lock_guard`, `std::scoped_lock`, `std::unique_lock` |
| Um pedaço de estado empilhado e restaurado | um guard customizado |
| Um callback de limpeza | `std::unique_ptr<void, F>` com deleter customizado |
| Código arbitrário na saída do escopo | um guard `scope_exit` (C++26, ou o seu próprio) |

`unique_ptr` é C++11. `make_unique` é C++14. O [mapa de versões](/pt/artigos-tecnicos/cpp-versoes-features/) vale ter à mão na hora de escolher um baseline.

## As Cinco Regras de Ownership

RAII num código vive ou morre conforme o time concorda com estas cinco.

- **Um recurso tem exatamente um dono.** Se dois objetos acham que possuem o mesmo descritor de arquivo, um dos dois está errado, e a falha vai ser intermitente. Isso é diferente de `shared_ptr`, onde a posse é explicitamente compartilhada e o recurso é destruído quando o *último* dono sai.
- **Ownership se expressa no tipo, não num comentário.** `std::FILE*` não diz quem libera. `File` diz. Um revisor não deveria precisar rastrear call sites para saber quem é o responsável.
- **Uma referência não-possuidora não é dono.** Ponteiros crus e referências são ótimos como parâmetros. São perigosos como membros.
- **Destrutores são `noexcept` por padrão.** Não transforme isso numa mentira. Toda limpeza que pode falhar pertence a um `close()` explícito.
- **O destrutor roda exatamente uma vez.** Se você está implementando contagem de referências manual, essa é a invariante que quebra primeiro.

## Cópia e Movimento: Os Contratos Que Tornam o RAII Seguro

Uma classe que possui um recurso precisa dizer o que cópia e movimento significam. Errar isso é o segundo bug de RAII mais comum, depois de esquecer a limpeza.

- **Cópia não é permitida para donos exclusivos.** `= delete`. O compilador te dá um `unique_ptr` que não pode ser copiado exatamente por isso.
- **O movimento deve deixar a origem num estado válido e destrutível.** Para um wrapper de arquivo, isso significa que o handle do objeto movido é nulo, e seu destrutor confere.
- **Operações de movimento devem ser `noexcept` quando possível.** Se um realocamento de `std::vector` precisa crescer o armazenamento e seu construtor de movimento pode lançar, o container vai *copiar* em vez de mover — abandonando silenciosamente sua otimização. Marque-as `noexcept`.
- **A Regra do Zero é a meta.** Se todo recurso já está encapsulado num tipo padrão, sua classe não precisa de destrutor, nem de operações de cópia, nem de movimento. Deixe o compilador gerá-las. Código que segue a Regra do Zero não tem código de limpeza para errar.

```cpp
// Regra do Zero: os quatro membros especiais estão corretos por construção
class Session {
    std::unique_ptr<Socket> socket_;
    std::shared_ptr<Logger> logger_;
    std::string user_;
public:
    Session(std::unique_ptr<Socket> s, std::shared_ptr<Logger> l, std::string u)
        : socket_(std::move(s)), logger_(std::move(l)), user_(std::move(u)) {}
};
```

Sem destrutor, sem construtor de cópia, sem construtor de movimento. `Session` ainda possui um socket e um logger, e ambos são liberados em todo caminho de saída. É assim que um código C++ maduro em RAII se parece.

## Onde o RAII Quebra

RAII não é universal. Existem casos reais em que é a ferramenta errada, e conhecê-los faz parte de usá-lo bem.

**Construção em duas fases.** Um construtor que só pode falhar via exceção está ótimo. Um construtor que precisa ser separado da própria inicialização — porque depende de um callback de framework, ou de um `init()` que devolve código de erro — quebra a afirmação "aquisição é inicialização". Prefira uma factory que devolve `std::optional<Connection>` ou `std::expected<Connection, Error>` e só constrói no sucesso.

**Ordem e dependências.** A ordem de destruição é a inversa da construção, o que geralmente é o que você quer e ocasionalmente exatamente o errado. Se seu logger sobrevive ao seu socket, e o destrutor do socket loga o próprio fechamento, você tem uma referência pendente. Isso é invisível até o shutdown, e é por isso que bug de desligamento é tão comum.

**Singletons e globais.** O destrutor de um objeto global roda durante a destruição estática, num ponto em que outros globais podem já ter ido embora. Se seu global possui um recurso que depende de outro global, o RAII vai fielmente liberá-lo num mundo corrompido.

**Tempos de vida assíncronos.** RAII cuida de escopos de pilha. Ele não cuida de "este recurso precisa ficar vivo até três corrotinas terminarem". Isso é contagem de referências, um `shared_ptr` ou um protocolo explícito — não um destrutor.

**Estado adquirido de vida longa.** Manter um mutex ou uma transação por um escopo é ótimo. Manter uma transação de banco aberta pelo tempo de vida de um objeto que pode ficar em cache por horas é outro problema vestido de RAII. O lock não é o bug; o tempo de vida é.

## A Interação Com Exceções Que As Pessoas Erram

A razão pela qual RAII e exceções costumam ser mencionados juntos é que exceções removem sua capacidade de rodar limpeza na mão. Todo `throw` é um `goto` para um handler desconhecido, e limpeza escrita à mão antes de cada um é um jogo perdido.

Duas consequências:

1. **RAII é o que torna exceções seguras.** Sem ele, código correto com exceções exige limpeza em todo ponto de throw, e isso não é mantível.
2. **RAII não torna exceções baratas.** Unwinding é caro, e num caminho quente uma exceção usada como controle de fluxo vai dominar seu profile. RAII te diz *para onde* o recurso vai; ele não diz nada sobre se lançar a exceção foi a decisão certa.

Se você quer um tratamento mais profundo de executar trabalho em múltiplas threads, onde esses tempos de vida interagem, veja [Paralelismo vs. Concorrência](/pt/artigos-tecnicos/paralelismo-vs-concorrencia/) e [Corrotinas e Programação Assíncrona em C++](/pt/artigos-tecnicos/corrotinas-programacao-assincrona-cpp/).

## Realidade de Compilador e Toolchain

Dois fatos que surpreendem quem vem de exemplos reinterpretados na internet:

- **Destrutores `noexcept` são o padrão** desde C++11. Um destrutor é implicitamente `noexcept` a menos que o destrutor de um membro não seja. Não brigue com isso.
- **`std::uncaught_exceptions()` é C++17.** O `std::uncaught_exception()` (singular, bool) pré-C++17 é deprecado e não consegue distinguir estados de exceção aninhados. Se você dá suporte a um padrão mais antigo, os padrões de scope guard ficam bem mais difíceis.
- **`scope_exit` chegou no C++26.** Enquanto sua toolchain não tiver, o contorno padrão é `std::unique_ptr` com um deleter customizado, ou um guard pequeno feito à mão.

Um guard feito à mão é mais ou menos isto, e vale ter no seu utilitário:

```cpp
template <class F>
class scope_exit {
public:
    explicit scope_exit(F f) noexcept : f_(std::move(f)) {}
    ~scope_exit() noexcept { f_(); }
    scope_exit(const scope_exit&) = delete;
    scope_exit& operator=(const scope_exit&) = delete;
private:
    F f_;
};

void update_config() {
    auto rollback = scope_exit{[] { restore_previous(); }};
    apply_new_settings();     // se isso lançar, rollback roda
    rollback = scope_exit{[]{}};  // desarma no sucesso
}
```

Essa é a forma de todo scope guard já escrito, do `boost::scope_exit` até a versão do C++26.

## O Que Conferir em Code Review

RAII não é imposto por linter. É imposto por um revisor que faz estas cinco perguntas.

1. **Toda aquisição de recurso corresponde a um destrutor em algum lugar do sistema de tipos?** Se a resposta é "o chamador é responsável", você achou um bug esperando para acontecer.
2. **A liberação pode falhar de um jeito que importa?** Se sim, existe um `close()` explícito no caminho de sucesso?
3. **As operações de cópia e movimento estão declaradas, e não herdadas por acidente?** Uma classe que possui um handle cru e não deleta a cópia não é RAII.
4. **A ordem de destruição no shutdown é realmente segura?** Algo liberado cedo demais é logado, ou de outra forma observado, por algo liberado depois?
5. **O `noexcept` nas operações de movimento e no destrutor é honesto?**

Essas cinco perguntas pegam a maior parte dos defeitos adjacentes a RAII num código normal. E pegam cedo, antes da falha intermitente que consome três engenheiros e uma semana para reproduzir.

## Encerrando: O Argumento Real

RAII costuma ser vendido como uma forma de evitar `delete`. Isso subestima o conceito. O argumento é sobre a forma do seu código:

- Gerenciamento manual de tempo de vida coloca a mesma invariante — "a liberação acontece exatamente uma vez" — em N call sites.
- RAII coloca em um único ponto, verificado pelo compilador, em caminhos que incluem os que você ainda não escreveu.

O custo é uma classe, geralmente pequena. O benefício é que ownership vira um fato no nível do tipo em vez de uma convenção que precisa ser restabelecida toda vez que alguém edita a função.

Se você está no começo da sua jornada em C++, RAII é o conceito que vale saber explicar em voz alta, com o argumento de exception safety junto. Se você escreve C++ há anos, a pergunta interessante não é se você consegue escrever o wrapper — é se o seu código ainda tem gerenciamento manual de tempo de vida escondido nele, e por quê.

## Continue Lendo

- [Smart Pointers em C++](/pt/artigos-tecnicos/smart-pointers/) — como ownership-como-tipo vira os três tipos concretos que você de fato usa, e quanto cada um custa.
- [C++ por Versão](/pt/artigos-tecnicos/cpp-versoes-features/) — quando `unique_ptr`, `make_unique`, o padrão `noexcept` e `std::uncaught_exceptions` entraram no padrão.
- [Trilha prática de C++](/pt/reference/trilha-cpp/) — o módulo de ownership, exercícios e um checklist gratuito de modernização.
- [Cache Affinity](/pt/artigos-tecnicos/cache-affinity/) — onde decisões de ownership viram performance.
- [C++ em High-Frequency Trading](/pt/artigos-tecnicos/cpp-hft-low-latency/) — por que limpeza determinística importa quando cada nanossegundo é dinheiro.

Todo recurso que você adquire é uma promessa de liberá-lo exatamente uma vez. RAII é como você faz o compilador cumprir essa promessa no seu lugar.
