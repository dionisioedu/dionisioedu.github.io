---
title: "RAII in C++ — Ownership as a Type, Not a Convention"
description: "How RAII actually works: constructors that acquire, destructors that release, and the unwinding guarantees that make exceptions safe. Plus where RAII breaks."
publishedAt: 2026-09-30
author: Dionisio
tags:
  - C++
  - RAII
  - Resource Management
  - Critical Systems
  - Best Practices
cover: /assets/images/raii.png
coverAlt: A stack frame unwinding, with each destructor releasing its resource in reverse order
---

<section class="ae-feature">
  <img src="/assets/images/raii.png" alt="A stack frame unwinding, with each destructor releasing its resource in reverse order" loading="eager" width="1200" height="630" fetchpriority="high" decoding="async" />
  <div class="ae-feature-copy">
    <p class="ae-kicker">C++ · Ownership · Exceptions</p>
    <h2>The best cleanup code is the code you never had to write</h2>
    <p>RAII is not a utility class. It is a claim about the language: that the compiler will run your cleanup, on every path out of a scope, no matter how you leave.</p>
    <div class="ae-meta"><span>C++98 → C++26</span><span>Exception safety</span><span>Handles</span></div>
  </div>
</section>

Most resource bugs are not logic bugs. They are path bugs. The allocation happened on line 40, the failure happened on line 55, and the `free` that belonged to line 90 never ran. You did not misunderstand the algorithm. You missed a branch.

RAII — *Resource Acquisition Is Initialization* — is the C++ answer to path bugs. The rule is short: **a resource's lifetime is bound to an object's lifetime**. You acquire in the constructor, you release in the destructor, and you let the compiler worry about which exit path you took.

There is also a [Portuguese edition](/pt/artigos-tecnicos/raii/).

## What the Standard Actually Guarantees

RAII is only useful if destructors are reliable. They are — on every path that leaves a scope *normally* or via an exception:

- Falling off the end of a block
- `return`, `return expr`, `return void_expr`
- `goto` and `break`/`continue` out of a loop
- An exception thrown from the scope or from anything it called

On all of these, destructors of completed-scope objects run, in **reverse order of construction**, including the partially constructed parts of base classes and members. This is [*stack unwinding*](https://eel.is/c++draft/except.ctor), and it is the mechanism RAII rides on.

The exception — and it is a deliberate one — is process termination. `std::exit`, `std::abort`, `std::quick_exit`, and a `noexcept` violation all end the process without unwinding. Your destructors do not run. If you are writing a service that calls `std::exit` from a library, understand that you just opted out of the guarantee. [The C++ standard's rules on termination](https://eel.is/c++draft/except.terminate).

There is a second guarantee that matters for correctness but is easy to forget: [`std::uncaught_exceptions()`](https://eel.is/c++draft/except.uncaught) lets a destructor ask whether it is running *because* of an exception. That is the difference between "normal cleanup" and "cleanup during failure," and a destructor that throws during unwinding calls `std::terminate`. **Destructors must not throw.** If your cleanup can fail, it needs a separate `close()` you call explicitly on the success path, with the destructor as a safety net.

## The Canonical Example

Everything else in this article is a variation on these 15 lines:

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

    File(const File&) = delete;                 // no copies: who closes it?
    File& operator=(const File&) = delete;

    void write(const char* data, std::size_t n) {
        if (std::fwrite(data, 1, n, handle_) != n)
            throw std::runtime_error("write failed");
    }

private:
    std::FILE* handle_;
};
```

Now compare the two ways to use it:

```cpp
// Manual: correct today, wrong after the next edit
void manual() {
    std::FILE* f = std::fopen("data.bin", "wb");
    if (!f) throw std::runtime_error("open failed");
    if (std::fwrite("hello", 1, 5, f) != 5) {
        std::fclose(f);                         // you must remember this
        throw std::runtime_error("write failed");
    }
    std::fclose(f);                             // and this
}

// RAII: correct on every path, including paths you add later
void with_raii() {
    File f("data.bin");
    f.write("hello", 5);
}   // ~File runs on success, on throw, on early return
```

The second version has one cleanup site, and it is not in your code. That is the whole point. The `manual()` version is *not* wrong — it is wrong *fragilely*, which is worse, because it survives review and breaks on the next refactor. **Static analysis can find a missing `fclose`. It cannot find one you will forget to add in six months.**

Notice also the deleted copy operations. A type that owns a raw handle cannot be copied without double-freeing. Deleting the copy is not decoration — it is the compiler refusing to let a future teammate write the bug for you.

## RAII Works Because You Are Not the Only One Talking to the OS

The language guarantee is necessary, not sufficient. RAII gets you a correct cleanup path and then hands the resource to a layer with its own correctness rules. Those rules are usually where the actual bugs are.

- **`std::fclose` on a buffered stream can fail.** It flushes; the flush may hit a full disk or a broken connection. A destructor that cannot report errors is fine for a file you only read, and a real problem for the write you are relying on. Call `std::fflush` explicitly, check its return, then close. This is the most common RAII-shaped bug in production C++.
- **POSIX guarantees `close()` succeeds**, even if the connection is broken, and that repeated calls on the same descriptor are safe. That is a stronger contract than `fclose`, and it is why raw descriptors are easier to wrap safely. [POSIX `close`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/close.html).
- **`free` and `delete` do not report failure.** If you understand that these operations are asked to succeed and will terminate the process if they cannot, deleting in a destructor is honest. If you assume they return errors, you are optimizing for a case that never happens.
- **`munmap`, `close`, and kernel state** are typically non-failing in the sense above, which makes the wrap-and-forget pattern exactly right.

The judgment call is: *can the release operation fail in a way I am required to act on?* If yes, RAII still gives you ordering and lifetime, but the visible path must be an explicit call.

## The Tools You Should Reach For First

You rarely need to write a class. The standard library already ships the ownership vocabulary:

| Need | Type |
| --- | --- |
| Exclusive ownership of a heap object | `std::unique_ptr<T>` |
| Shared ownership with a reference count | `std::shared_ptr<T>` |
| Non-owning observer of a shared object | `std::weak_ptr<T>` |
| A file handle | `std::fstream`, `std::ofstream`, `std::ifstream` |
| A mutex held for a scope | `std::lock_guard`, `std::scoped_lock`, `std::unique_lock` |
| A piece of state pushed and restored | a custom guard |
| A cleanup callback | `std::unique_ptr<void, F>` with a custom deleter |
| Scope exit of arbitrary code | a `scope_exit` guard (C++26, or your own) |

`unique_ptr` is C++11. `make_unique` is C++14. The [version map](/en/artigos-tecnicos/cpp-versoes-features/) is worth keeping nearby when you are choosing a baseline.

## The Five Ownership Rules

RAII in a codebase lives or dies on whether the team agrees on these.

- **A resource has exactly one owner.** If two objects believe they own the same file descriptor, one of them is wrong, and the failure will be intermittent. This is separate from `shared_ptr`, where ownership is explicitly shared and the resource is destroyed when the *last* owner leaves.
- **Ownership is expressed in the type, not in a comment.** `std::FILE*` does not say who frees it. `File` does. A reviewer should not have to trace call sites to know who is responsible.
- **A non-owning reference is not an owner.** Raw pointers and references are fine as parameters. They are dangerous as members.
- **Destructors are `noexcept` by default.** Do not make that a lie. Any cleanup that can fail belongs in an explicit `close()`.
- **The destructor runs exactly once.** If you are implementing manual reference counting, this is the invariant that breaks first.

## Copy and Move: The Contracts That Make RAII Safe

A class that owns a resource must say what copying and moving mean. Getting this wrong is the second-most-common RAII bug after forgetting cleanup.

- **Copy is not allowed for exclusive owners.** `= delete` it. Compilers give you a `unique_ptr` that cannot be copied for exactly this reason.
- **Move must leave the source in a valid, destructible state.** For a file wrapper, that means the moved-from object's handle is null, and its destructor checks.
- **Move operations must be `noexcept` where possible.** If a `std::vector` reallocation needs to grow storage and your move constructor can throw, the container will *copy* instead — silently abandoning your optimization. Mark them `noexcept`.
- **The Rule of Zero is the goal.** If every resource is already wrapped in a standard type, your own class needs no destructor, no copy operations, and no move operations. Let the compiler generate them. Code that follows the Rule of Zero has no cleanup code to get wrong.

```cpp
// Rule of Zero: all four special members are correct by construction
class Session {
    std::unique_ptr<Socket> socket_;
    std::shared_ptr<Logger> logger_;
    std::string user_;
public:
    Session(std::unique_ptr<Socket> s, std::shared_ptr<Logger> l, std::string u)
        : socket_(std::move(s)), logger_(std::move(l)), user_(std::move(u)) {}
};
```

No destructor, no copy constructor, no move constructor. `Session` still owns a socket and a logger, and both are released on every exit path. That is what a mature RAII codebase looks like.

## Where RAII Breaks

RAII is not universal. There are real cases where it is the wrong tool, and knowing them is part of using it well.

**Two-phase construction.** A constructor that can fail only via exception is fine. A constructor that must be separated from its own initialization — because it needs a framework callback, or an `init()` that returns an error code — breaks the "acquisition is initialization" claim. Prefer a factory function that returns `std::optional<Connection>` or `std::expected<Connection, Error>` and only constructs on success.

**Ordering and dependencies.** Destruction order is reverse construction order, which is usually what you want and occasionally exactly wrong. If your logger outlives your socket, and the socket's destructor logs its own closure, you have a dangling reference. This is invisible until shutdown, which is why shutdown bugs are so common.

**Singletons and globals.** A global object's destructor runs during static destruction, at a point where other globals may already be gone. If your global owns a resource that depends on another global, RAII will faithfully release it into a corrupted world.

**Asynchronous lifetimes.** RAII handles stack scopes. It does not handle "this resource must stay alive until three coroutines finish." That is a reference count, a `shared_ptr`, or an explicit protocol — not a destructor.

**Long-lived acquired state.** Holding a mutex or transaction for a scope is great. Holding a database transaction open for the lifetime of an object that may be cached for hours is a different problem dressed in RAII clothing. The lock is not the bug; the lifetime is.

## The Interaction With Exceptions People Get Wrong

The reason RAII and exceptions are usually mentioned together is that exceptions remove your ability to run cleanup manually. Every `throw` is a `goto` to an unknown handler, and hand-written cleanup before each one is a losing game.

Two consequences:

1. **RAII is what makes exceptions safe.** Without it, exception-correct code requires cleanup at every throw site, and that is not maintainable.
2. **RAII does not make exceptions cheap.** Unwinding is expensive, and in a hot path an exception used for control flow will dominate your profile. RAII tells you *where* the resource goes; it says nothing about whether throwing was the right call.

If you want a deeper treatment of executing work on multiple threads where these lifetimes interact, see [Parallelism vs. Concurrency](/en/artigos-tecnicos/paralelismo-vs-concorrencia/) and [Coroutines and Asynchronous Programming in C++](/en/artigos-tecnicos/corrotinas-programacao-assincrona-cpp/).

## Compiler and Toolchain Reality

Two facts that surprise people coming from reinterpreted examples online:

- **`noexcept` destructors are the default** since C++11. A destructor is implicitly `noexcept` unless a member's destructor is not. Do not fight this.
- **`std::uncaught_exceptions()` is C++17.** The pre-C++17 `std::uncaught_exception()` (singular, bool) is deprecated and cannot distinguish nested exception states. If you are supporting an older standard, the scope-guard patterns get noticeably harder.
- **`scope_exit` arrived in C++26.** Until your toolchain has it, the standard workaround is `std::unique_ptr` with a custom deleter, or a small hand-rolled guard.

A hand-rolled guard is roughly this, and it is worth having in your utilities:

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
    apply_new_settings();     // if this throws, rollback runs
    rollback = scope_exit{[]{}};  // discharge on success
}
```

That is the shape of every scope guard ever written, from `boost::scope_exit` to the C++26 version.

## What to Check in Code Review

RAII is not enforced by a linter. It is enforced by a reviewer who asks these five questions.

1. **Does every resource acquisition correspond to a destructor somewhere in the type system?** If the answer is "the caller is responsible," you have found a bug waiting to happen.
2. **Can the release fail in a way that matters?** If yes, is there an explicit `close()` on the success path?
3. **Are the copy and move operations stated, not inherited by accident?** A class that owns a raw handle and does not delete copy is not RAII.
4. **Is destruction order at shutdown actually safe?** Does anything released early get logged, or otherwise observed, by something released later?
5. **Is `noexcept` on the move operations and the destructor honest?**

These five questions catch most RAII-adjacent defects in a normal codebase. They also catch them early, before the intermittent failure that takes three engineers and a week to reproduce.

## Closing: The Real Argument

RAII is often sold as a way to avoid `delete`. That undersells it. The argument is about the shape of your code:

- Manual lifetime management puts the same invariant — "release happens exactly once" — at N call sites.
- RAII puts it at one site, checked by the compiler, on paths that include ones you have not written yet.

The cost is a class, usually small. The benefit is that ownership becomes a type-level fact instead of a convention that must be re-established every time somebody edits the function.

If you are early in your C++ journey, RAII is the concept worth being able to explain out loud, with the exception-safety argument attached. If you have been writing C++ for years, the interesting question is not whether you can write the wrapper — it is whether your codebase still has manual lifetime management hiding in it, and why.

## Keep Reading

- [Smart Pointers in C++](/en/artigos-tecnicos/smart-pointers/) — how ownership-as-a-type turns into the three concrete types you actually use, and what each one costs.
- [Move Semantics in C++](/en/artigos-tecnicos/move-semantics/) — why `std::move` is a cast and not an action, and where the copy you thought you removed still runs.
- [C++ by Version](/en/artigos-tecnicos/cpp-versoes-features/) — when `unique_ptr`, `make_unique`, `noexcept` defaults, and `std::uncaught_exceptions` entered the standard.
- [Practical C++ learning path](/en/reference/trilha-cpp/) — the ownership module, exercises, and a free modernization checklist.
- [Cache Affinity](/en/artigos-tecnicos/cache-affinity/) — where ownership decisions turn into performance.
- [C++ in High-Frequency Trading](/en/artigos-tecnicos/cpp-hft-low-latency/) — why deterministic cleanup matters when every nanosecond is money.

Every resource you acquire is a promise to release it exactly once. RAII is how you make the compiler keep that promise for you.
