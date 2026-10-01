---
title: "Smart Pointers in C++ — Choosing Between unique_ptr, shared_ptr and weak_ptr"
description: "Ownership costs, control block layout, make_shared vs shared_ptr(new T), enable_shared_from_this, cycles, and the API signatures that leak lifetime bugs."
publishedAt: 2026-09-30
author: Dionisio
tags:
  - C++
  - Smart Pointers
  - Ownership
  - Performance
  - Best Practices
cover: /assets/images/smart-pointers.png
coverAlt: Three ownership models side by side — a single owner, a shared control block with a reference count, and a weak observer
---

<section class="ae-feature">
  <img src="/assets/images/smart-pointers.png" alt="Three ownership models side by side — a single owner, a shared control block with a reference count, and a weak observer" loading="eager" width="1200" height="630" fetchpriority="high" decoding="async" />
  <div class="ae-feature-copy">
    <p class="ae-kicker">C++ · Ownership · std::memory</p>
    <h2>Most smart pointer bugs are not memory bugs. They are ownership bugs.</h2>
    <p>Nobody double-frees a <code>shared_ptr</code>. They pass one by value into a callback that outlives the object, and then wonder why nothing is ever destroyed.</p>
    <div class="ae-meta"><span>C++11 → C++17</span><span>std::memory</span><span>Lifetime</span></div>
  </div>
</section>

If you have written C++ in the last decade, you know the three names. `unique_ptr` for exclusive ownership, `shared_ptr` for shared, `weak_ptr` to observe without owning. Repeating that is not useful.

What is useful is the part that is not in the one-line summary: **`shared_ptr` is not "the safe pointer."** It is a specific ownership model with a specific cost, and most of the bugs people blame on smart pointers are actually the wrong model chosen for the problem. A `shared_ptr` passed by value into a lambda that outlives its scope does not crash — it silently keeps an object alive for the lifetime of the process. That is a *different* failure than a double free, and it is much harder to find.

There is also a [Portuguese edition](/pt/artigos-tecnicos/smart-pointers/).

## The Decision That Matters Is the First One

Before any API question, answer this: **how many owners does this object have?**

| Owners | Type | Why |
| --- | --- | --- |
| Exactly one | `std::unique_ptr<T>` | No overhead, no atomic, moves transfer ownership |
| The last one of several | `std::shared_ptr<T>` | Reference-counted lifetime |
| Zero — I only need to look | `T*` or `T&` | A non-owning reference |
| Zero — I need to check if it still exists | `std::weak_ptr<T>` | Observes a `shared_ptr` without keeping it alive |
| No dynamic allocation needed | `T` | A value. This is the most underused option. |

Most codebases would improve by moving entries *up* this table, not down. If you cannot name the second owner, there is no second owner, and `shared_ptr` is buying you an atomic increment you did not need.

The signal that you picked wrong is usually a `shared_ptr` in a function parameter. Ask what the function does with ownership: if it does not store the pointer, does not hand it to something that outlives the call, and does not need to observe the count, it does not need a `shared_ptr`. It needs a reference.

```cpp
// The signature says "I might take ownership." It doesn't — it reads the value.
double price_of(const std::shared_ptr<Instrument>& inst);

// The signature says "I need this to exist right now." That is the truth.
double price_of(const Instrument& inst);

// The signature says "I might store this, or nothing." Also the truth.
void register_instrument(std::shared_ptr<Instrument> inst);
```

**That distinction is the entire cost of the article.** A `shared_ptr` parameter that is never stored is a lifetime extension the caller did not intend, and it is invisible at the call site: `price_of(ptr)` and `price_of(*ptr)` look equally reasonable.

## unique_ptr: The Default, Not the Fallback

`unique_ptr` should be your first reach. It is a zero-overhead abstraction, it moves, it refuses to copy, and when it dies the object dies. There is nothing to tune.

```cpp
#include <memory>
#include <cassert>

struct Connection { ~Connection() { /* release */ } };

std::unique_ptr<Connection> make_connection() {
    return std::make_unique<Connection>();   // C++14
}

int main() {
    auto conn = make_connection();
    assert(conn != nullptr);
    auto moved = std::move(conn);
    assert(conn == nullptr);                 // moved-from is valid and empty
}
```

Three details that come up in review:

- **`make_unique` is C++14; `unique_ptr` itself is C++11.** If you are on C++11 you are writing `std::unique_ptr<T>(new T(...))` — which is correct, just verbose. The [version map](/en/artigos-tecnicos/cpp-versoes-features/) tracks this.
- **`make_unique` is not just convenience.** It calls the constructor and the allocation in one expression, so there is no window where a thrown constructor leaks. `f(std::unique_ptr<T>(new T), g())` can leak in C++11 because argument evaluation order is unspecified; `make_unique` closes that hole.
- **The deleter is part of the type.** `unique_ptr<T, D>` with a custom `D` is not the same type as `unique_ptr<T>`, and it changes the size. A function returning the wrong combination fails to compile — which is the point.

For arrays, `unique_ptr<T[]>` exists and calls `delete[]`. Prefer a container. The exception is a fixed-size, non-owning-elsewhere buffer you cannot express otherwise, and that is rare.

## shared_ptr: What You Are Actually Paying For

A `shared_ptr<T>` is two pointers: one to the object, one to a **control block**. That control block holds the strong count, the weak count, and the deleter.

```
shared_ptr<T>  ──┬──> T           (the object)
                 └──> control_block { strong: 2, weak: 1, deleter }
```

Three consequences follow, and all three cause real bugs:

- **Every copy is an atomic operation.** Copying a `shared_ptr` is a relaxed atomic increment; destroying it is an acquire/release decrement. That is cheap but not free, and in a hot loop it is not a rounding error. Pass by `const&` when you only read.
- **Two allocations, unless you use `make_shared`.** `std::shared_ptr<T>(new T)` allocates the object, then allocates the control block. `std::make_shared<T>()` allocates both in one block. That is faster and more cache-friendly — and it has a consequence people do not expect: **the object's memory is not freed until the last `weak_ptr` also dies**, because the control block and the object share an allocation. With a long-lived `weak_ptr`, `make_shared` keeps the memory alive after the destructor has run.
- **The count is shared, the pointer is not.** Two `shared_ptr`s to the same object are fine. **Two independently created `shared_ptr`s to the same raw pointer are a double free**, because each has its own control block. This is the classic mistake with `this`:

```cpp
struct Widget {
    // WRONG: creates a second control block on every call -> double free
    std::shared_ptr<Widget> self() { return std::shared_ptr<Widget>(this); }
};
```

The fix is `enable_shared_from_this`, and only when the object is genuinely managed by a `shared_ptr`:

```cpp
#include <memory>

struct Widget : std::enable_shared_from_this<Widget> {
    std::shared_ptr<Widget> self() { return shared_from_this(); }
};

// Call it only after a shared_ptr owns the object:
// auto w = std::make_shared<Widget>();
// auto s = w->self();          // OK: shares the existing control block
```

Calling `shared_from_this()` on an object that no `shared_ptr` owns throws `std::bad_weak_ptr`, or is undefined before C++17. That is the trap: the constructor cannot call it, because the `shared_ptr` does not exist yet. Move that work to a factory function or an explicit `init()`.

## weak_ptr: Breaking Cycles, Observing Without Owning

`weak_ptr` exists for two jobs, and mixing them up causes leaks.

**Job one: hand out a reference that does not extend lifetime.** A cache holding `shared_ptr`s would keep every entry alive forever. Holding `weak_ptr`s keeps the count honest — the entry dies when the real owners are done.

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
            if (auto locked = weak.lock()) {          // temporary strong ref
                std::cout << "alive: " << *locked << '\n';
            } else {
                std::cout << "expired\n";             // owner is gone
            }
        }
    }
};
```

`lock()` returns a `shared_ptr` that is either valid or null — never a dangling pointer. Note the shape of the loop: the `shared_ptr` lives only inside the `if`, so it cannot accidentally extend the lifetime past the statement. If you find yourself storing the result of `lock()`, ask whether you actually wanted to own it.

**Job two: break a strong reference cycle.** Two `shared_ptr`s pointing at each other keep both alive forever, and neither destructor runs.

```cpp
struct Node {
    std::shared_ptr<Node> next;    // strong: "I own my successor"
    std::weak_ptr<Node>  parent;   // weak:   "I know who owns me"
};
```

A doubly-linked list of `shared_ptr`s is the canonical leak. The rule: **in a parent/child relationship, the parent owns strongly and the child points back weakly.** Draw the graph before you pick the type.

## Common APIs: Where Lifetimes Quietly Change

Several standard APIs are `shared_ptr`-shaped, and each has a lifetime rule that surprises people:

- **`std::enable_shared_from_this`** — covered above. Requires prior ownership.
- **`std::static_pointer_cast` / `dynamic_pointer_cast` / `const_pointer_cast`** — these share the control block, so the count is preserved. `dynamic_pointer_cast` on a failed cast returns an empty `shared_ptr`. Use these instead of casting the raw pointer and rebuilding a `shared_ptr`, which would create a second control block.
- **`std::atomic<std::shared_ptr<T>>`** — C++20. In C++11/14/17, the `std::atomic_*` free functions on a `shared_ptr` are the supported form, and they are not lock-free in general. If a `shared_ptr` is being read and written from multiple threads, a plain `shared_ptr` is a data race even though the count itself is atomic. **The count is thread-safe; the pointer is not.**
- **`std::weak_ptr::lock()`** — the only correct way to get a strong reference from a weak one. Never `weak.lock().get()` and store the raw pointer.

## What It Costs

Rough numbers on a 64-bit machine, all in bytes and cycles, because "smart pointers are free" is a claim worth checking:

| Type | Size | Copy cost |
| --- | --- | --- |
| `unique_ptr<T>` (default deleter) | 8 bytes | not allowed |
| `unique_ptr<T, D>` with stateful deleter | 8 + `sizeof(D)` | not allowed |
| `shared_ptr<T>` | 16 bytes | 1 atomic increment + pointer copy |
| `weak_ptr<T>` | 16 bytes | 1 atomic increment (weak count) |
| `control_block` | ~24 bytes + deleter state | — |

Two takeaways. First, `unique_ptr` is the size of a raw pointer and compiles to the same code — there is no argument for raw owning pointers once you can use it. Second, `shared_ptr` is not "a pointer with safety"; it is a pointer plus an atomic plus a heap allocation, and in a structure-of-arrays style data path that is the difference between fitting in cache and not.

For the performance side of that trade-off, see [Cache Affinity](/en/artigos-tecnicos/cache-affinity/).

## C++17 and Later: The Small Wins

If your baseline is C++17 or newer, a few extras remove real friction:

- **`std::unique_ptr` in `if` init statements** — `if (auto handle = acquire(); handle) { ... }` scopes the ownership to the branch, which is exactly the lifetime you meant.
- **Structured bindings** make the pair-of-pointers nature of `shared_ptr` visible when you need it, though you almost never should.
- **`std::make_unique` and `std::make_shared` are the default.** Writing `new` outside a factory function is a code smell worth flagging in review.
- **`std::inplace_vector` and friends** (C++26) reduce the cases where you needed heap allocation at all. The best way to avoid smart pointer costs is to avoid the allocation.

The [C++ by version](/en/artigos-tecnicos/cpp-versoes-features/) map is worth keeping open while you decide what your project can actually compile.

## The Review Checklist

Five questions that catch nearly every smart pointer defect I have seen in production:

1. **Is there more than one owner?** If not, `unique_ptr` — or a value.
2. **Does this `shared_ptr` parameter get stored?** If not, it should be `T&` or `T*`.
3. **Is there a cycle?** Draw the ownership graph. Any loop needs a `weak_ptr` somewhere, and it should be the back-edge.
4. **Was `shared_ptr(this)` ever written?** It should be `enable_shared_from_this`.
5. **Is this pointer read and written across threads?** The count is atomic; the pointer is not. Use `atomic<shared_ptr<T>>` (C++20) or the atomic free functions, or restructure so it is not shared.

Note what is missing: none of these questions are about `delete`. RAII already solved that. What remains are questions about *who owns what*, and the compiler cannot answer those for you — a type can only encode the model you chose.

## Keep Reading

- [RAII in C++](/en/artigos-tecnicos/raii/) — the mechanism these types are built on, and where ownership in a type system comes from.
- [Parallelism vs. Concurrency](/en/artigos-tecnicos/paralelismo-vs-concorrencia/) — the context where the atomic-increment cost and the thread-safety caveat actually bite.
- [Practical C++ learning path](/en/reference/trilha-cpp/) — ownership, move semantics, ranges and performance, with exercises and a free checklist.
- [C++ by Version](/en/artigos-tecnicos/cpp-versoes-features/) — when `make_shared`, `make_unique` and `atomic<shared_ptr>` arrived.

Smart pointers do not remove the question of ownership. They make it possible to answer it once, in the type, instead of at every call site — which is only an improvement if the answer you wrote down was the true one.
