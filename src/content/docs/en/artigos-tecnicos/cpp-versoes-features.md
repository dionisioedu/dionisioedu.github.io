---
title: "C++ by Version — What Changed from C++98 to C++26"
description: "The major features of every C++ version: language changes, standard library additions, practical examples, and what to check before upgrading a project."
publishedAt: 2026-09-15
author: Dionisio
tags:
  - C++
  - Software Engineering
  - Best Practices
  - Performance
cover: /assets/images/cpp-versions.png
coverAlt: Timeline of the eight C++ versions, from 1998 to 2026
---

<section class="ae-feature">
  <img src="/assets/images/cpp-versions.png" alt="Timeline of the eight C++ versions, from 1998 to 2026" loading="eager" />
  <div class="ae-feature-copy">
    <p class="ae-kicker">C++ · Language · Standard Library</p>
    <h2>Your project uses C++. But which C++?</h2>
    <p>Between managing resources by hand and composing operations with ranges lies a history of engineering decisions. Understanding that history helps you write better code today.</p>
    <div class="ae-meta"><span>C++98 → C++26</span><span>Practical examples</span><span>Modernization</span></div>
  </div>
</section>

You open one project and find `new`, `delete`, raw pointers, and classes whose only job is to pass a function to an algorithm. You open another and see `unique_ptr`, lambdas, concepts, and ranges. Both are C++. Maintaining them can be a very different experience.

Knowing when a feature arrived helps you avoid reinventing something the library already provides — and shipping code your team's toolchain cannot compile.

This is a map of the **major changes in each edition**, with examples and practical consequences. It is not an inventory of every defect report. The reference date is **September 15, 2026**. There is also a [Portuguese edition](/pt/artigos-tecnicos/cpp-versoes-features/).

## The Quick Map

| Version | Language highlights | Library highlights |
| --- | --- | --- |
| C++98 | First ISO standardization of classes, templates, exceptions, namespaces | STL, strings, streams |
| C++03 | Corrections and value-initialization | Specification and interoperability fixes |
| C++11 | `auto`, lambdas, move semantics, `constexpr`, variadic templates | Smart pointers, threads, atomics, chrono, unordered containers |
| C++14 | Generic lambdas, init-capture, more flexible `constexpr` | `make_unique`, `shared_timed_mutex`, integer sequences |
| C++17 | Structured bindings, `if constexpr`, fold expressions, CTAD | `optional`, `variant`, `any`, `string_view`, filesystem |
| C++20 | Concepts, modules, coroutines, `<=>`, `consteval` | Ranges, `span`, `format`, `jthread`, synchronization |
| C++23 | Deducing this, `if consteval`, multidimensional subscripting | `expected`, `print`, `mdspan`, `generator`, more ranges |
| C++26 | Reflection, contracts, pack indexing, expansion statements | Senders/receivers, SIMD, `inplace_vector` |

Read this as a selection of milestones, not a support guarantee. **The language edition, compiler implementation, and library implementation are three different things.** The official [GCC](https://gcc.gnu.org/projects/cxx-status.html) and [Clang](https://clang.llvm.org/cxx_status.html) tables track those details.

## C++98 — The Foundation Still in Your Code

Classes and templates existed before 1998. The milestone was the first international standard: a shared baseline for the language and library, including STL containers, iterators, and algorithms. [History by Stroustrup](https://www.stroustrup.com/C%2B%2B.html).

This example already expressed a powerful idea: an algorithm does not need to know the entire container. Give it a range and let it work.

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

**What still matters:** RAII — tying resource cleanup to an object's lifetime — was already fundamental. Modern C++ improved the tools for applying it. It did not invent the idea that a destructor should close the file or release the resource.

## C++03 — Getting the Rules Right

C++03 was a corrective revision, without the programming transformation that would arrive in 2011. One relevant change was **value-initialization**, part of the rules governing object initialization. Stroustrup describes this edition as a small revision of its predecessor. [FAQ](https://www.stroustrup.com/bs_faq.html).

```cpp
// C++03
#include <cassert>

struct Counters { int accepted; int rejected; };

int main() {
    Counters counters = Counters();
    assert(counters.accepted == 0 && counters.rejected == 0);
}
```

Do not turn this into “every object starts at zero.” An uninitialized local scalar is still a problem. And do not credit C++03 with `unordered_map`: TR1 was a separate technical report; that container entered the main standard in C++11.

## C++11 — The Modern C++ Turning Point

`auto` gained type deduction; lambdas brought behavior closer to its use; rvalue references and move semantics enabled resource transfer. The edition also introduced `nullptr`, range-for, `enum class`, `override`, `final`, `noexcept`, `= default`, `= delete`, list initialization, `static_assert`, and `constexpr`.

In the library, `unique_ptr`, `shared_ptr`, `weak_ptr`, `thread`, mutexes, atomics, futures, `chrono`, `array`, `tuple`, and unordered containers changed everyday work. [Stroustrup's C++11 FAQ](https://www.stroustrup.com/C%2B%2B11FAQ.html) explains the motivation behind these tools.

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

The resource now has an explicit owner. `std::move` enables selection of a move operation; it transfers nothing by itself. The `unique_ptr` constructor performs the transfer. For other types, moving can have different costs — or select a copy when no suitable move operation exists.

**Practical use:** start a modernization effort by clarifying ownership. Changing syntax before understanding who owns each resource leaves the central problem untouched.

## C++14 — Less Everyday Friction

Lambdas gained `auto` parameters and initialized captures. Functions could deduce their return type; variable templates and digit separators arrived. `constexpr` accepted more constructs, including loops. The library added `make_unique` and tools such as `integer_sequence`. [Clang language history](https://clang.llvm.org/cxx_status.html) and [GCC library status](https://gcc.gnu.org/onlinedocs/libstdc++/manual/status.html).

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

Notice the chronology: `unique_ptr` is C++11; **`make_unique` is C++14**. A small feature can remove a manual construction repeated across hundreds of call sites.

## C++17 — More Expressive Types, Clearer Templates

Structured bindings name the parts of an object. `if constexpr` selects branches at compile time. Fold expressions simplify operations over parameter packs; CTAD deduces class template arguments. Inline variables make definitions in headers easier.

`optional`, `variant`, and `any` model different situations; `string_view` provides a non-owning view of text; filesystem standardizes path operations. Execution policies for algorithms also arrived. [C++17 library status](https://libcxx.llvm.org/Status/Cxx17.html).

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

Absence now appears in the type. You do not have to choose a magic number and hope every consumer remembers it.

Two cautions: `string_view` does not extend the original string's lifetime; parallel policies do not promise an automatic speedup. Measurement remains part of the job. C++17's guaranteed copy elision also applies to specific prvalue cases, not every return pattern, such as NRVO.

## C++20 — A Change in Scale

Four names organize the conversation: **concepts, ranges, coroutines, and modules**. Concepts express template requirements. Ranges bring algorithms and sequences closer together. Coroutines allow execution to suspend and resume. Modules provide an alternative to organization based solely on textual inclusion.

Other additions include `<=>`, `consteval`, `constinit`, designated initializers, and more constant evaluation capabilities. The library gained `span`, `format`, `jthread`, stop tokens, semaphores, latches, barriers, and atomic waiting operations. [C++20 library status](https://libcxx.llvm.org/Status/Cxx20.html).

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

This pipeline is a view: we traverse values without materializing another vector. The source data must remain alive.

**The traps:** a coroutine does not create a thread or supply an I/O runtime. `constinit` does not make a variable immutable. Modules require toolchain and build integration; mechanically replacing `#include` with `import` is not a migration plan.

## C++23 — Results, Printing, and Composition

Language highlights include explicit object parameters (*deducing this*), `if consteval`, and multi-argument `operator[]`. In the library, `mdspan` represents multidimensional data without owning it; `generator` supplies a coroutine-based generator; ranges gained adaptors and `ranges::to`. [libc++ C++23 status](https://libcxx.llvm.org/Status/Cxx23.html).

`expected` makes “value or error” explicit. `print` and `println` take formatting straight to output. See the proposals for [expected](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2022/p0323r12.html) and [formatted output](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2022/p2093r14.html).

```cpp
// C++23 — requires a library implementing std::expected
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

`optional` answers “is there a value?” `expected` adds “if it failed, why?” That helps with validation, parsing, and APIs where failure is an expected outcome. Choosing explicit returns or exceptions still depends on the application's contract.

Another useful distinction: `format` arrived in C++20; **`print` arrived in C++23**. C++23 was finalized in 2023 and published as ISO/IEC 14882:2024; an edition's nickname does not necessarily match its ISO publication year.

## C++26 — Reflection, Contracts, and Async Execution

WG21 completed its C++26 work in March 2026. That does not mean every toolchain fully supports it. A [Croydon meeting participant's report](https://mpusz.github.io/mp-units/latest/blog/2026/03/28/report-from-the-croydon-2026-iso-c-committee-meeting/) records that milestone; check implementation feature by feature before adopting it.

- **Static reflection:** query program information at compile time, useful for reducing repetitive serialization and type adaptation code. [P2996](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2025/p2996r13.html).
- **Contracts:** express preconditions, postconditions, and contract assertions. They do not replace validation of untrusted input.
- **Pack indexing and expansion statements:** more tools for selecting and expanding elements in generic code.
- **Senders/receivers:** a model for composing asynchronous operations in `std::execution`. This differs from the execution policies introduced in C++17. [P2300](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2024/p2300r10.html).
- **SIMD and `inplace_vector`:** abstractions for data parallelism and a variable-size container with fixed capacity and internal storage. [Library status](https://gcc.gnu.org/onlinedocs/libstdc++/manual/status.html).

My adoption rule: an isolated experiment first, compiler and platform coverage next, a public interface last. A new feature at a library boundary can force every consumer to upgrade together.

## Which Version Should Your Project Use?

Start with the newest edition **your project's actual support matrix can sustain**. A service in a controlled environment and an SDK distributed to third parties face different constraints.

1. **Set the standard in the build.** Do not depend on the compiler default.
2. **Check language and library support.** Replacing the compiler executable can leave an older standard library in place.
3. **Test the feature you need.** Feature-test macros help; `__cplusplus` alone does not prove complete support.
4. **Validate ABI and dependencies.** Compiling an example file does not establish compatibility between binary libraries.
5. **Migrate in steps.** Ownership, return types, and algorithms are concrete starting points. Measure performance under a representative workload.

To run an example, save its block as `example.cpp` and select the corresponding edition. With a compatible GCC or Clang toolchain:

```bash
clang++ -std=c++20 -Wall -Wextra -pedantic example.cpp -o example
```

In CMake, for an existing target:

```cmake
target_compile_features(app PRIVATE cxx_std_20)
set_target_properties(app PROPERTIES CXX_EXTENSIONS OFF)
```

This requests **at least C++20**; it does not certify that every feature in the edition is implemented. For availability, consult [GCC](https://gcc.gnu.org/projects/cxx-status.html), [Clang](https://clang.llvm.org/cxx_status.html), and the library you use.

## Keep Reading

- [C++ in HFT: where latency actually appears](/en/artigos-tecnicos/cpp-hft-low-latency/).
- [Cache affinity: the cost of moving data](/en/artigos-tecnicos/cache-affinity/).
- [Technical reference for stronger fundamentals](/en/reference/).

Knowing the editions helps you ask a better code review question: **does this construct solve the problem more clearly, with the costs and support we need?** The number after `-std=` is only the beginning.
