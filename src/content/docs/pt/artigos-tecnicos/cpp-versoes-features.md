---
title: "C++ por Versão — O Que Mudou do C++98 ao C++26"
description: "As principais features de cada versão do C++: linguagem, biblioteca padrão, exemplos práticos e o que conferir antes de atualizar seu projeto."
publishedAt: 2026-09-15
author: Dionisio
tags:
  - C++
  - Engenharia de Software
  - Boas Práticas
  - Performance
cover: /assets/images/cpp-versions.png
coverAlt: Linha do tempo das oito versões do C++, de 1998 a 2026
---

<section class="ae-feature">
  <img src="/assets/images/cpp-versions.png" alt="Linha do tempo das oito versões do C++, de 1998 a 2026" loading="eager" />
  <div class="ae-feature-copy">
    <p class="ae-kicker">C++ · Linguagem · Biblioteca Padrão</p>
    <h2>Seu projeto usa C++. Mas qual C++?</h2>
    <p>Entre gerenciar recursos na mão e compor operações com ranges, existe uma história de decisões de engenharia. Conhecer essa história ajuda a escrever código melhor hoje.</p>
    <div class="ae-meta"><span>C++98 → C++26</span><span>Exemplos práticos</span><span>Modernização</span></div>
  </div>
</section>

Você abre um projeto e encontra `new`, `delete`, ponteiros crus e um monte de classes que só existem para passar uma função para um algoritmo. Abre outro e vê `unique_ptr`, lambdas, concepts e ranges. Os dois são C++. A experiência de manter cada um pode ser bem diferente.

Saber em qual versão uma feature apareceu evita duas coisas: reinventar o que a biblioteca já entrega e mandar para produção código que a toolchain do time não consegue compilar.

Este é um mapa das **principais mudanças de cada edição**, com exemplos e consequências práticas. Não é uma lista de todos os defect reports. A data de referência é **15 de setembro de 2026**. Há uma [versão em inglês](/en/artigos-tecnicos/cpp-versoes-features/).

## O Mapa Rápido

| Versão | Linguagem: destaques | Biblioteca: destaques |
| --- | --- | --- |
| C++98 | Primeira padronização ISO de classes, templates, exceções e namespaces | STL, strings e streams |
| C++03 | Correções e value-initialization | Ajustes de especificação e interoperabilidade |
| C++11 | `auto`, lambdas, move semantics, `constexpr`, variadic templates | Smart pointers, threads, atomics, chrono, unordered containers |
| C++14 | Lambdas genéricas, init-capture, `constexpr` mais flexível | `make_unique`, `shared_timed_mutex`, integer sequences |
| C++17 | Structured bindings, `if constexpr`, fold expressions, CTAD | `optional`, `variant`, `any`, `string_view`, filesystem |
| C++20 | Concepts, modules, coroutines, `<=>`, `consteval` | Ranges, `span`, `format`, `jthread`, sincronização |
| C++23 | Deducing this, `if consteval`, subscrito multidimensional | `expected`, `print`, `mdspan`, `generator`, mais ranges |
| C++26 | Reflection, contracts, pack indexing, expansion statements | Senders/receivers, SIMD, `inplace_vector` |

Leia a tabela como uma seleção de marcos, não como uma promessa de suporte. **Versão da linguagem, implementação do compilador e implementação da biblioteca são três coisas diferentes.** As tabelas oficiais de [GCC](https://gcc.gnu.org/projects/cxx-status.html) e [Clang](https://clang.llvm.org/cxx_status.html) separam esses detalhes.

## C++98 — A Base Que Continua no Seu Código

Classes e templates já existiam antes de 1998. O marco foi a primeira padronização internacional: uma base comum para a linguagem e sua biblioteca, incluindo containers, iteradores e algoritmos da STL. [História por Stroustrup](https://www.stroustrup.com/C%2B%2B.html).

O exemplo abaixo já expressava uma ideia poderosa: o algoritmo não precisa conhecer o container inteiro. Recebe um intervalo e trabalha sobre ele.

```cpp
// C++98
#include <algorithm>
#include <cassert>
#include <vector>

int main() {
    int raw[] = {30, 10, 20};
    std::vector<int> prices(raw, raw + 3);
    std::sort(prices.begin(), prices.end());
    assert(prices.front() == 10);
}
```

**O que levar para hoje:** RAII — associar a liberação de um recurso ao tempo de vida de um objeto — já era uma técnica fundamental. C++ moderno melhorou as ferramentas para aplicá-la. Não inventou a ideia de que um destrutor deve fechar o arquivo ou liberar o recurso.

## C++03 — Acertando as Regras

C++03 foi uma revisão de correções, sem a transformação de programação que viria em 2011. Um ajuste relevante foi a **value-initialization**, importante nas regras de inicialização de objetos. Stroustrup descreve essa edição como uma revisão pequena do padrão anterior. [FAQ](https://www.stroustrup.com/bs_faq.html).

```cpp
// C++03
#include <cassert>

struct Counters { int accepted; int rejected; };

int main() {
    Counters counters = Counters();
    assert(counters.accepted == 0 && counters.rejected == 0);
}
```

Não generalize para “todo objeto começa zerado”. Uma variável escalar local sem inicialização continua sendo um problema. Tampouco atribua `unordered_map` ao C++03: TR1 foi um relatório técnico separado; esse container entrou no padrão principal em C++11.

## C++11 — A Virada do C++ Moderno

`auto` passou a deduzir tipos; lambdas aproximaram código e uso; referências rvalue e move semantics permitiram transferir recursos. Vieram também `nullptr`, range-for, `enum class`, `override`, `final`, `noexcept`, `= default`, `= delete`, inicialização por listas, `static_assert` e `constexpr`.

Na biblioteca, `unique_ptr`, `shared_ptr`, `weak_ptr`, `thread`, mutexes, atomics, futures, `chrono`, `array`, `tuple` e containers unordered mudaram o cotidiano. A [FAQ de C++11 de Stroustrup](https://www.stroustrup.com/C%2B%2B11FAQ.html) explica a motivação dessas ferramentas.

```cpp
// C++11
#include <cassert>
#include <memory>
#include <utility>

int main() {
    std::unique_ptr<int> original(new int(42));
    auto owner = std::move(original);
    assert(!original && *owner == 42);
}
```

Aqui, o recurso tem um dono explícito. `std::move` permite selecionar a operação de movimento; sozinho, ele não transfere nada. É o construtor de `unique_ptr` que realiza a transferência. Para outros tipos, mover pode ter custos diferentes — ou até selecionar uma cópia se não houver operação de movimento adequada.

**Aplicação prática:** comece uma modernização esclarecendo ownership. Trocar sintaxe antes de entender quem possui cada recurso deixa o problema central intacto.

## C++14 — Menos Atrito no Dia a Dia

As lambdas ganharam parâmetros `auto` e capturas com inicialização. Funções puderam deduzir o retorno; variable templates e separadores de dígitos chegaram. `constexpr` passou a aceitar mais construções, incluindo loops. Na biblioteca, vieram `make_unique` e ferramentas como `integer_sequence`. [Histórico da linguagem no Clang](https://clang.llvm.org/cxx_status.html) e [biblioteca no GCC](https://gcc.gnu.org/onlinedocs/libstdc++/manual/status.html).

```cpp
// C++14
#include <cassert>
#include <memory>

constexpr int sum_to(int n) {
    int total = 0;
    for (int i = 1; i <= n; ++i) total += i;
    return total;
}

int main() {
    auto add = [](auto a, auto b) { return a + b; };
    auto answer = std::make_unique<int>(add(20, 22));
    static_assert(sum_to(4) == 10, "unexpected sum");
    assert(*answer == 42);
}
```

Repare na cronologia: `unique_ptr` é C++11, **`make_unique` é C++14**. Uma feature pequena pode eliminar uma construção manual repetida em centenas de lugares.

## C++17 — Tipos Mais Expressivos, Templates Mais Legíveis

Structured bindings dão nomes às partes de um objeto. `if constexpr` escolhe ramos em tempo de compilação. Fold expressions simplificam operações sobre parameter packs; CTAD deduz argumentos de templates de classes. Inline variables facilitam definições em headers.

`optional`, `variant` e `any` modelam situações diferentes; `string_view` representa uma visão não proprietária de texto; filesystem padroniza operações com caminhos. Também chegaram políticas de execução para algoritmos. [Status da biblioteca C++17](https://libcxx.llvm.org/Status/Cxx17.html).

```cpp
// C++17
#include <cassert>
#include <map>
#include <optional>
#include <string>

std::optional<int> lookup(const std::map<std::string, int>& stock,
                          const std::string& symbol) {
    if (auto it = stock.find(symbol); it != stock.end()) {
        const auto& [name, quantity] = *it;
        return quantity;
    }
    return std::nullopt;
}

int main() {
    const std::map<std::string, int> stock{{"ABC", 7}};
    assert(lookup(stock, "ABC").value_or(0) == 7);
    assert(!lookup(stock, "XYZ"));
}
```

Ausência agora aparece no tipo. Você não precisa escolher um número mágico e esperar que todo consumidor se lembre dele.

Dois cuidados: `string_view` não prolonga a vida da string original; políticas paralelas não prometem ganho automático. Medir ainda faz parte do trabalho. E a elisão garantida de cópia de C++17 vale para casos específicos com prvalues, não para toda forma de retorno, como NRVO.

## C++20 — Uma Mudança de Escala

Quatro nomes organizam a conversa: **concepts, ranges, coroutines e modules**. Concepts expressam requisitos de templates. Ranges aproximam algoritmos e intervalos. Coroutines permitem suspender e retomar uma execução. Modules oferecem uma alternativa à organização baseada apenas em inclusão textual.

Também chegaram `<=>`, `consteval`, `constinit`, designated initializers e mais capacidade de avaliação constante. A biblioteca ganhou `span`, `format`, `jthread`, stop tokens, semáforos, latches, barriers e operações de espera em atomics. [Biblioteca C++20](https://libcxx.llvm.org/Status/Cxx20.html).

```cpp
// C++20
#include <cassert>
#include <concepts>
#include <ranges>
#include <vector>

template<std::integral T>
constexpr T twice(T value) { return value + value; }

int main() {
    std::vector<int> values{1, 2, 3, 4};
    auto selected = values
        | std::views::filter([](int n) { return n % 2 == 0; })
        | std::views::transform([](int n) { return twice(n); });
    int total = 0;
    for (int n : selected) total += n;
    assert(total == 12);
}
```

Esse pipeline é uma view: percorremos os valores sem materializar outro vector. Os dados de origem precisam continuar vivos.

**As pegadinhas:** coroutine não cria thread nem entrega um runtime de I/O. `constinit` não torna uma variável imutável. Modules exigem integração da toolchain e do build; substituir `#include` por `import` mecanicamente não é um plano de migração.

## C++23 — Resultados, Impressão e Composição

Na linguagem, os destaques incluem parâmetro explícito de objeto (*deducing this*), `if consteval` e `operator[]` com múltiplos argumentos. Na biblioteca, `mdspan` representa dados multidimensionais sem ser dono deles; `generator` oferece um gerador baseado em coroutine; ranges ganharam adaptadores e `ranges::to`. [Status C++23 da libc++](https://libcxx.llvm.org/Status/Cxx23.html).

`expected` torna explícito “valor ou erro”. Já `print` e `println` levam a formatação à saída diretamente. Veja as propostas de [expected](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2022/p0323r12.html) e [impressão formatada](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2022/p2093r14.html).

```cpp
// C++23 — exige uma biblioteca com std::expected
#include <cassert>
#include <expected>

enum class Error { invalid_quantity };

std::expected<int, Error> validate(int quantity) {
    if (quantity <= 0) return std::unexpected(Error::invalid_quantity);
    return quantity;
}

int main() {
    const auto result = validate(10);
    assert(result && *result == 10);
    const auto failure = validate(0);
    assert(!failure && failure.error() == Error::invalid_quantity);
}
```

`optional` responde “tem valor?”. `expected` acrescenta “se falhou, por quê?”. Isso ajuda em validação, parsing e APIs nas quais falha é um resultado esperado. A escolha entre retorno explícito e exceções continua dependendo do contrato da aplicação.

Outra distinção útil: `format` chegou em C++20; **`print` chegou em C++23**. C++23 foi finalizado em 2023 e publicado como ISO/IEC 14882:2024; o apelido da versão não é necessariamente o ano da publicação ISO.

## C++26 — Reflection, Contracts e Execução Assíncrona

O WG21 concluiu o trabalho de C++26 em março de 2026. Isso não equivale a suporte completo em toda toolchain. O [relato de um participante da reunião de Croydon](https://mpusz.github.io/mp-units/latest/blog/2026/03/28/report-from-the-croydon-2026-iso-c-committee-meeting/) registra esse marco; confira a implementação recurso por recurso antes de adotar.

- **Reflection estática:** consultar informações do programa em tempo de compilação, útil para reduzir repetição em serialização e adaptação de tipos. [P2996](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2025/p2996r13.html).
- **Contracts:** expressar pré-condições, pós-condições e asserções de contrato. Não substituem validação de entrada não confiável.
- **Pack indexing e expansion statements:** mais ferramentas para selecionar e expandir elementos em código genérico.
- **Senders/receivers:** modelo de composição de operações assíncronas em `std::execution`. É diferente das políticas de execução introduzidas em C++17. [P2300](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2024/p2300r10.html).
- **SIMD e `inplace_vector`:** abstrações para paralelismo de dados e um container de tamanho variável com capacidade fixa e armazenamento interno. [Status da biblioteca](https://gcc.gnu.org/onlinedocs/libstdc++/manual/status.html).

Meu critério de adoção: primeiro um experimento isolado, depois cobertura de compiladores e plataformas, por último uma interface pública. Uma feature nova na fronteira de uma biblioteca pode obrigar todos os consumidores a atualizar juntos.

## Qual Versão Usar no Seu Projeto?

Comece pela versão mais recente **que a matriz real de suporte do projeto sustenta**. Um serviço com ambiente controlado e um SDK distribuído para terceiros têm restrições diferentes.

1. **Fixe o padrão no build.** Não dependa do default do compilador.
2. **Confira linguagem e biblioteca.** Trocar o executável do compilador pode manter uma biblioteca padrão antiga.
3. **Teste a feature de que você precisa.** Feature-test macros ajudam; `__cplusplus` sozinho não prova suporte completo.
4. **Valide ABI e dependências.** Compilar um arquivo de exemplo não garante compatibilidade entre bibliotecas binárias.
5. **Migre em etapas.** Ownership, tipos de retorno e algoritmos são pontos de partida concretos. Meça desempenho com a carga real.

Para executar um exemplo, salve o bloco em `example.cpp` e selecione a edição correspondente. Em uma toolchain GCC ou Clang compatível:

```bash
clang++ -std=c++20 -Wall -Wextra -pedantic example.cpp -o example
```

No CMake, para um alvo existente:

```cmake
target_compile_features(app PRIVATE cxx_std_20)
set_target_properties(app PROPERTIES CXX_EXTENSIONS OFF)
```

Isso pede **pelo menos C++20**; não certifica que todo recurso da edição está implementado. Para detalhes de disponibilidade, consulte [GCC](https://gcc.gnu.org/projects/cxx-status.html), [Clang](https://clang.llvm.org/cxx_status.html) e a biblioteca utilizada.

## Continue a Leitura

- [C++ em HFT: onde a latência aparece de verdade](/pt/artigos-tecnicos/cpp-hft-low-latency/).
- [Cache affinity: o custo de movimentar dados](/pt/artigos-tecnicos/cache-affinity/).
- [Referência técnica para aprofundar os fundamentos](/pt/reference/).

Conhecer as versões ajuda a fazer uma pergunta melhor no code review: **essa construção resolve o problema de forma mais clara, com os custos e o suporte que precisamos?** O número depois de `-std=` é só o começo.
