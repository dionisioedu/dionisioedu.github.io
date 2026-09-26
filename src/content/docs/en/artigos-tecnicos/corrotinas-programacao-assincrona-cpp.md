---
title: "Coroutines and Asynchronous Programming in Modern C++"
description: "Understand co_await, coroutine state, and the difference from std::async. C++20 examples with Asio, error handling, object lifetime, and cancellation."
publishedAt: 2026-09-26
author: Dionisio
tags:
  - C++
  - Concurrency
  - Asynchronous Programming
  - Software Engineering
cover: /assets/images/cpp-coroutines.webp
coverAlt: A coroutine suspends at co_await, frees the thread for other work, and resumes after the operation completes
---

<section class="ae-feature">
  <img src="/assets/images/cpp-coroutines.webp" alt="A coroutine suspends at co_await, frees the thread for other work, and resumes after the operation completes" width="1200" height="630" loading="eager" fetchpriority="high" decoding="async" />
  <div class="ae-feature-copy">
    <p class="ae-kicker">C++20 · Coroutines · Asynchrony</p>
    <h2>The code waits. Does the thread need to wait too?</h2>
    <p>Coroutines let a function suspend and continue later. The important part is understanding who manages that continuation.</p>
    <div class="ae-meta"><span>Runnable examples</span><span>Asio</span><span>From control flow to lifetime</span></div>
  </div>
</section>

Your service receives a request, queries another service, and stores the result. The business flow fits in three lines. The implementation grows when every step requires a callback, a state object, and a separate error path.

Coroutines help express that flow linearly without making the thread sit idle through every wait. But `co_await` does not turn an arbitrary function into a nonblocking operation. And code that looks sequential can still have concurrency problems.

Let's separate language, library, and execution, build a complete example, and discuss the decisions required before taking this model into production. The examples use C++20; the main one uses **standalone Asio 1.30.2**, a version pinned for reproducibility. A [Portuguese version is also available](/pt/artigos-tecnicos/corrotinas-programacao-assincrona-cpp/).

## 1. What is a C++ coroutine?

A regular function enters, executes, and returns. A **coroutine** can suspend execution and resume later, preserving the necessary state. C++20 provides these related constructs:

| Construct | Role |
| --- | --- |
| `co_await` | Await an object that participates in the suspension and resumption protocol |
| `co_return` | Complete the coroutine and deliver its result through the mechanism defined by its return type |
| `co_yield` | Produce a value through the coroutine protocol, commonly used in generators |

The compiler maintains a **coroutine frame**: state that can outlive the initial call. It includes the resumption position and objects that must survive suspension. Dynamic allocation may occur; the compiler can eliminate some allocations. Do not assume zero cost. The [LLVM coroutine documentation](https://llvm.org/docs/Coroutines.html) shows how a compiler represents that state and can optimize its allocation.

C++ coroutines are *stackless*: they preserve their own state rather than arbitrarily capturing an entire call stack. If an ordinary function they call blocks, the thread remains blocked.

The return type participates through `promise_type`, which defines aspects such as results, exceptions, and initial/final suspension. This *promise* is not necessarily a `std::promise`. Application code normally chooses a library-provided type rather than implementing that low-level machinery.

## 2. A coroutine is neither a thread nor an I/O runtime

A coroutine describes a flow that can suspend. It does not automatically create threads, connections, or an event loop. An **executor** defines the execution context; the library coordinates operations and continuations.

Recall the distinction in the article on [parallelism and concurrency](/en/artigos-tecnicos/paralelismo-vs-concorrencia/): two coroutines can be in progress on one thread. This overlaps waiting without executing two computations simultaneously on that thread.

```text
Thread:       A starts → A suspends → B starts → B suspends → other work
Operation A:             [........ waiting ........] → ready
Thread:                                                   A resumes
```

The diagram shows one possibility, not a universal ordering. Depending on the executor, a continuation may even execute on another thread. The library contract matters as much as the syntax.

The `co_await` protocol checks `await_ready()`, uses `await_suspend()` when needed, and obtains the result through `await_resume()`. An operation may already be ready and not suspend. Additional rules transform the awaited object; see [expr.await](https://eel.is/c++draft/expr.await). Finding a `co_await` does not by itself imply a thread switch.

## 3. Before coroutines: what does `std::async` provide?

`std::async` has existed since C++11 and returns a `std::future`. With the explicit `std::launch::async` policy, the function executes as if in a new thread:

```cpp
// C++20 — future_example.cpp
#include <cassert>
#include <future>
#include <iostream>

int main() {
    auto answer = std::async(std::launch::async, [] {
        return 6 * 7;
    });

    // Independent work could happen here.
    const int value = answer.get();
    assert(value == 42);
    std::cout << value << '\n';
}
```

`get()` waits if the result is not ready and propagates a stored exception. Without the explicit policy, the implementation may choose deferred execution. Destroying a future associated with `std::async` may also wait for the task under the shared state's conditions. These details are in the [`std::async` contract](https://eel.is/c++draft/futures.async).

This can suit isolated work, but does not automatically provide a bounded worker pool. Creating thousands of tasks with this policy is not equivalent to a scalable I/O server. Nor does a `std::future` become directly awaitable with `co_await` merely by existing: that requires an integration supplying the appropriate protocol.

## 4. Complete example: two waits, one thread

We'll use timers to show the behavior without relying on an external API, network connection, or credentials. This demonstrates **asynchronous waiting**, not processing performance.

Standalone Asio uses `asio::`. Boost.Asio offers a related API under `boost::asio::`, but dependency setup differs. Here, use the headers from [Asio 1.30.2](https://github.com/chriskohlhoff/asio/tree/asio-1-30-2).

```cpp
// C++20 + standalone Asio 1.30.2 — coroutine_timers.cpp
#include <utility>
#include <asio.hpp>
#include <cassert>
#include <chrono>
#include <exception>
#include <iostream>
#include <string>

using namespace std::chrono_literals;

asio::awaitable<void> wait_and_report(
    std::string name, std::chrono::milliseconds delay) {
    const auto executor = co_await asio::this_coro::executor;
    asio::steady_timer timer(executor);
    timer.expires_after(delay);

    std::cout << name << " started\n";
    co_await timer.async_wait(asio::use_awaitable);
    std::cout << name << " completed\n";
    co_return;
}

int main() {
    asio::io_context context;
    int completed = 0;
    bool failed = false;

    auto on_complete = [&](std::exception_ptr error) {
        ++completed;
        if (!error) return;
        failed = true;
        try {
            std::rethrow_exception(error);
        } catch (const std::exception& e) {
            std::cerr << e.what() << '\n';
        } catch (...) {
            std::cerr << "Unknown coroutine error\n";
        }
    };

    asio::co_spawn(context, wait_and_report("A", 100ms), on_complete);
    asio::co_spawn(context, wait_and_report("B", 200ms), on_complete);
    context.run();

    assert(completed == 2);
    return failed ? 1 : 0;
}
```

### Who does what?

- `awaitable<void>` is Asio's coroutine return type.
- `co_spawn` starts each flow on the chosen executor and connects completion to its handler.
- `use_awaitable` integrates the operation with `co_await`; errors become exceptions in this mode.
- `on_complete` receives exceptions escaping the coroutine. It is an ordinary lambda, not a coroutine lambda.

These contracts are documented in [Asio's coroutine support](https://think-async.com/Asio/asio-1.30.2/doc/asio/overview/composition/cpp20_coroutines.html).

`async_wait` registers the wait without keeping the thread busy running the timer. The [timer documentation](https://think-async.com/Asio/asio-1.30.2/doc/asio/reference/basic_waitable_timer/async_wait.html) specifies completion on expiry or cancellation. While a coroutine is suspended, the event loop can serve other work.

There is one call to [`context.run()`](https://think-async.com/Asio/asio-1.30.2/doc/asio/reference/io_context/run.html), on the main thread. It processes events and may wait when no work is ready; it does not magically make the rest of `main()` nonblocking. This program's handlers run on that same thread, so its counters do not need atomics.

A typical run prints `A started`, `B started`, and then their completions. Do not treat the exact order or 200 ms as guaranteed: scheduling and load affect when work is serviced. The point is that we do not need to finish waiting for A before starting B's wait.

### How to compile

The first example only needs a standard library with future support. For the second, configure Asio's include directory. On Linux with GCC and headers available through `ASIO_INCLUDE`:

```bash
g++ -std=c++20 -O2 -Wall -Wextra -pedantic -pthread future_example.cpp -o future_example
g++ -std=c++20 -O2 -Wall -Wextra -pedantic -pthread -DASIO_STANDALONE -I"$ASIO_INCLUDE" coroutine_timers.cpp -o coroutine_timers
./future_example
./coroutine_timers
```

`ASIO_INCLUDE` must point to the directory containing `asio.hpp`. Both examples were compiled and executed on Windows with GCC 13.1 (MinGW). For the Asio example, this was the validated PowerShell command:

```powershell
g++ -std=c++20 -O2 -Wall -Wextra -pedantic -pthread -mthreads -DASIO_STANDALONE -D_WIN32_WINNT=0x0601 -I "$env:ASIO_INCLUDE" coroutine_timers.cpp -o coroutine_timers.exe -lws2_32 -lmswsock
.\coroutine_timers.exe
```

On this toolchain, `-mthreads` lets Asio detect thread support. Check your compiler, standard library, and Asio combination; selecting C++20 does not install dependencies.

## 5. Linear code does not mean parallel operations

If you await one operation and only then start another, you have built a sequence. That may be exactly what you need: you cannot send a query's result before receiving it.

When operations are independent, start them separately or use a composition abstraction supplied by the library. The two `co_spawn` calls do that in our example. Writing two consecutive `co_await` expressions does not create that overlap on its own.

Do not put heavy compression, a lengthy parser, or `std::this_thread::sleep_for` on the event loop expecting syntax to remove the blocking. CPU work needs its own strategy: partitioning, an appropriate executor, and bounded workers. Resumption must preserve the data access contract.

## 6. The risk spanning every suspension: lifetime

A suspension separates two moments in your program. Between them, the caller can leave its scope, a connection can close, or a request can be cancelled.

In the example, `name` is passed by value and the timer is local to the coroutine. Both remain valid during the wait. The handler's captured counters remain alive until `run()` finishes. If several threads execute `run()`, that argument about serial access no longer holds and shared state needs protection.

Three rules from the [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-concurrency) help during review:

- **CP.51:** avoid capturing lambdas that are coroutines; the closure may die before resumption.
- **CP.52:** do not hold blocking locks across suspension points.
- **CP.53:** prefer value parameters over references when a coroutine needs to preserve its data.

Passing a pointer by value does not extend the pointed-to object's lifetime. The same applies to `string_view`, spans, and borrowed buffers. Define who owns each resource and who may destroy it while an operation uses it.

Do not treat `coroutine_handle::destroy()` as a universal cancellation button. If a pending operation can still resume that state, destroying it too early creates invalid access. Coordinating this is part of the library and application contract.

## 7. Errors, cancellation, and shutdown belong in the design

A production implementation needs answers to four questions:

| Question | Required decision |
| --- | --- |
| Did the operation fail? | Propagate, recover, or log with context; do not silently discard it |
| Did the client leave? | Request cancellation through a supported mechanism and observe completion |
| Did the deadline expire? | Define the timeout and what happens to work already in progress |
| Is the service shutting down? | Stop admitting new work and resolve existing operations before releasing their resources |

In Asio, cancelling a timer can complete its wait with `operation_aborted`. That is not the same as interrupting arbitrary code at an arbitrary line. A cancellation request must be accepted and processed by the mechanism involved.

Using `detached` in every `co_spawn` is tempting because it reduces code. But it removes the completion channel chosen in this example. When tasks must be accounted for and failures handled, keep an explicit observation path.

Bound in-flight operations, buffers, and queues too. Thousands of coroutines do not necessarily occupy thousands of threads, but they still consume memory and put pressure on external services. Cleaner syntax does not remove the need for backpressure.

## 8. How to tell whether it helped

Start with a flow whose real problem is waiting or composition complexity. Compare readability, cancellation, memory consumption, throughput, and latency under load. Include failures and shutdown in your tests, not just the happy path.

The timer example does not demonstrate CPU acceleration. It demonstrates that the executor can serve another flow during a wait. That distinction lets you choose the tool without promising gains you have not measured.

**Exercise:** add a third coroutine and make one throw before its timer. Verify that its handler observes the error and that the others still complete. Then replace an asynchronous wait with a blocking wait and observe the effect on other tasks' progress. Do not turn that observation into a production benchmark.

## Conclusion: `co_await` makes waiting explicit, not automatic

Coroutines make asynchronous flows easier to express using local variables, loops, and exception handling. The language provides suspension and resumption; the library provides types, operations, and execution integration.

The result works well when the contract is clear too: who owns the data, where execution resumes, how errors reach the responsible code, and when work ends. **Before asking where to put `co_await`, ask what can wait and who will manage the continuation.**

## References and next steps

- [C++ Working Draft — coroutines](https://eel.is/c++draft/dcl.fct.def.coroutine), [`co_await`](https://eel.is/c++draft/expr.await), and [`std::async`](https://eel.is/c++draft/futures.async). The draft evolves; this article uses C++20 or earlier features.
- [Asio 1.30.2 — C++20 coroutine support](https://think-async.com/Asio/asio-1.30.2/doc/asio/overview/composition/cpp20_coroutines.html), [`async_wait`](https://think-async.com/Asio/asio-1.30.2/doc/asio/reference/basic_waitable_timer/async_wait.html), and [`io_context::run`](https://think-async.com/Asio/asio-1.30.2/doc/asio/reference/io_context/run.html).
- [C++ Core Guidelines — concurrency and parallelism](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-concurrency): especially CP.51, CP.52, and CP.53.
- On this site: [parallelism vs. concurrency](/en/artigos-tecnicos/paralelismo-vs-concorrencia/), [C++ by version](/en/artigos-tecnicos/cpp-versoes-features/), and the [C++ learning path](/en/reference/trilha-cpp/).
