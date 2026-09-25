---
title: "Parallelism vs. Concurrency — From the Idea to C++ Code"
description: "Understand concurrency, parallelism, and asynchronous operations with complete C++20 examples, data races, synchronization, and practical measurement criteria."
publishedAt: 2026-09-25
author: Dionisio
tags:
  - C++
  - Concurrency
  - Performance
  - Software Engineering
cover: /assets/images/concurrency-parallelism.webp
coverAlt: Two tasks interleaved on one CPU and executing simultaneously on two CPUs
---

<section class="ae-feature">
  <img src="/assets/images/concurrency-parallelism.webp" alt="Two tasks interleaved on one CPU and executing simultaneously on two CPUs" width="1200" height="630" loading="eager" fetchpriority="high" decoding="async" />
  <div class="ae-feature-copy">
    <p class="ae-kicker">C++ · Concurrency · Performance</p>
    <h2>Two tasks in progress. But how many are executing?</h2>
    <p>Adding threads is easy. Understanding the work, the waiting, and the shared memory is what turns them into a solution.</p>
    <div class="ae-meta"><span>From fundamentals to production</span><span>C++20 examples</span><span>No promised speedup</span></div>
  </div>
</section>

You open an application that downloads a file while responding to your clicks. Then you run a program that splits an image across several cores to apply a filter. Both have more than one task. But they solve different problems.

The first needs to remain useful while part of its work waits. The second wants to finish a computation sooner. Confusing those needs often produces the same rushed solution: create more threads and hope.

Let's build a mental model, write code, and arrive at an engineering decision. The complete examples use C++20. A [Portuguese version is also available](/pt/artigos-tecnicos/paralelismo-vs-concorrencia/).

## 1. Concurrency organizes; parallelism executes simultaneously

**Concurrency** organizes tasks whose periods of progress can overlap. One task may wait while another advances. This can happen on a single thread, alternating steps, or across multiple threads.

**Parallelism** is simultaneous execution of work. Two cores can process different parts of an image at the same instant. Vector instructions also provide data parallelism; creating threads is not its only form.

Rob Pike presents this distinction between composing tasks and executing simultaneously in [Concurrency is not parallelism, on the official Go blog](https://go.dev/blog/waza-talk). It remains useful when the language is C++.

```text
Time →
One CPU:   [ A1 ][ B1 ][ A2 ][ B2 ]  interleaved tasks

Two CPUs:
CPU 1:     [ A1 ][ A2 ]
CPU 2:     [ B1 ][ B2 ]              simultaneous execution
```

The diagram omits overhead and waiting. It is not a benchmark, and it does not imply that two CPUs deliver exactly twice the speed.

| Concept | Main question | Example |
| --- | --- | --- |
| Concurrency | How can several tasks progress without requiring one to finish before another starts? | Serving connections while some wait for data |
| Parallelism | Which work can execute simultaneously? | Computing independent blocks on several cores |
| Asynchrony | How can the result arrive later, without waiting for it in this call? | Starting a read and receiving a completion notification |

**Asynchronous does not mean parallel.** An API can return control and complete later through an event loop. It can also use a thread pool. The API's name does not reveal where computation happens.

In C++20, coroutines allow a function to suspend and resume, but do not themselves provide a thread, scheduler, or I/O implementation. The library integrating the coroutine is an essential part of that story.

## 2. Concurrency without creating threads

This toy cooperative scheduler keeps two tasks started and alternates their steps. Each task stores its own progress:

```cpp
// C++20 — cooperative.cpp
#include <array>
#include <cassert>
#include <iostream>

struct Task {
    char name;
    int completed = 0;

    void step() {
        ++completed;
        std::cout << name << completed << ' ';
    }
};

int main() {
    std::array<Task, 2> tasks{{{'A'}, {'B'}}};
    for (int round = 0; round < 3; ++round) {
        for (auto& task : tasks) task.step();
    }
    assert(tasks[0].completed == 3 && tasks[1].completed == 3);
    std::cout << '\n';
}
```

The output is `A1 B1 A2 B2 A3 B3`. There is only one thread: no two of these steps execute simultaneously. Concurrency comes from decomposing the work into tasks that progress in turns.

The limitation is just as clear: if `step()` blocks for five seconds, the other task waits. A real event loop needs short steps and suitable I/O operations; simply putting a slow function in a queue does not make it nonblocking. This example illustrates scheduling, not an I/O library.

## 3. Independent work on two threads

Now we want to sum a million integers. We divide the input into two ranges, accumulate in local variables, and publish one result per worker:

```cpp
// C++20 — partitioned_sum.cpp
#include <cassert>
#include <cstddef>
#include <cstdint>
#include <iostream>
#include <numeric>
#include <thread>
#include <vector>

int main() {
    const std::vector<int> values(1'000'000, 1);
    const auto middle = values.size() / 2;
    std::int64_t left = 0;
    std::int64_t right = 0;

    auto sum = [&values](std::size_t first, std::size_t last) {
        std::int64_t result = 0;
        for (auto i = first; i < last; ++i) result += values[i];
        return result;
    };

    std::jthread a([&] { left = sum(0, middle); });
    std::jthread b([&] { right = sum(middle, values.size()); });
    a.join();
    b.join();

    const auto total = left + right;
    const auto reference = std::accumulate(
        values.begin(), values.end(), std::int64_t{0});
    assert(total == reference && total == 1'000'000);
    std::cout << total << '\n';
}
```

The ranges do not overlap; the input is read-only; each output has a single writer. The main program reads the results after `join()`, which waits for thread completion and establishes the required synchronization. This design does not need a mutex.

The threads **may** execute in parallel if resources are available and the scheduler chooses to do so. On one CPU, they may simply interleave. The code creates an opportunity, not a guarantee of simultaneous execution or better performance.

`std::jthread`, available since C++20, also automatically joins during destruction if it still owns a joinable thread. Here, explicit `join()` calls mark the point where we need the results. Its stop request is cooperative: it does not forcibly interrupt a function that ignores the request. See the [`jthread` contract in the C++ draft](https://eel.is/c++draft/thread.jthread.class).

The captured references remain valid until both threads finish. Real code also needs an exception strategy: an exception escaping a thread function terminates the process; results and errors need a defined communication channel.

## 4. Shared state is where things become difficult

Imagine replacing the two results with one shared `total` and performing `++total` from each thread. That increment reads and modifies the same object. Without synchronization, potentially concurrent conflicting accesses, at least one of them non-atomic and without the required ordering, can constitute a **data race**. In C++, this is undefined behavior, not merely “sometimes the counter is wrong.” The rule is specified in [intro.races](https://eel.is/c++draft/intro.races).

A `std::atomic<int>` handles an isolated counter update. It does not automatically make a compound operation correct, such as “check the balance, then withdraw.” Two threads may both observe sufficient funds before either reduces the balance, even with separate atomic loads and stores.

To protect that business rule, checking and modifying must belong to the same protected region:

```cpp
// C++20 — account.cpp
#include <cassert>
#include <mutex>
#include <thread>

class Account {
    std::mutex mutex_;
    int balance_ = 100;
public:
    bool withdraw(int amount) {
        if (amount <= 0) return false;
        std::lock_guard lock(mutex_);
        if (balance_ < amount) return false;
        balance_ -= amount;
        return true;
    }

    int balance() {
        std::lock_guard lock(mutex_);
        return balance_;
    }
};

int main() {
    Account account;
    bool first = false;
    bool second = false;
    std::jthread a([&] { first = account.withdraw(80); });
    std::jthread b([&] { second = account.withdraw(80); });
    a.join();
    b.join();
    assert(first != second);
    assert(account.balance() == 20);
}
```

One withdrawal wins; we do not know which. The guarantee concerns the balance, not the service order. `lock_guard` releases the mutex when leaving its scope, including through an early return.

This separates a **data race**, a violation of the memory model, from a **race condition**, a logical error that depends on event ordering. You can eliminate the former and still have the latter.

Mutexes do not solve everything either: two threads waiting for each other's locks can deadlock. Avoid calling unknown code or performing slow I/O while holding a lock. Whenever possible, reduce shared state before making synchronization more sophisticated. The [C++ Core Guidelines, section CP](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-concurrency), discuss these choices.

## 5. Why more threads can make everything slower

The sum example demonstrates correctness, not acceleration. Adding integers is cheap; creating threads and moving memory can cost more than the savings. In a service, reusing a bounded set of workers often makes more sense than creating a thread for every item.

A simple model helps: if 20% of the time remains strictly sequential and 80% can be divided perfectly among four workers, the ideal speedup is `1 / (0.20 + 0.80 / 4) = 2.5`, not 4. This assumes fixed work, perfect division, and zero additional overhead. Real execution also involves:

- **Contention:** workers competing for the same mutex or resource.
- **Memory bandwidth:** cores waiting for data, even without locks.
- **False sharing:** different variables on the same cache line causing coherence traffic. This is not a data race, but it can be expensive.
- **Small tasks:** scheduling and communication costing more than useful work.
- **Too many workers:** more runnable threads competing for the available resources.

Algorithm execution policies, introduced in C++17, offer another tool: `std::execution::par` permits parallel execution, but an implementation can execute sequentially. `par_unseq` adds restrictions: it is not a place to arbitrarily introduce blocking locks. Check the [policy rules in the draft](https://eel.is/c++draft/algorithms.parallel.exec) and your library's support before treating a policy as an acceleration switch.

## 6. How to choose and validate an approach

| Situation | First approach to investigate |
| --- | --- |
| Many operations waiting for the network | Asynchronous I/O, timeouts, and bounded in-flight operations |
| Heavy, divisible computation | Partition data and measure with a bounded worker count |
| An unresponsive interface | Move long work off the UI thread; return results safely |
| A heavily contested counter | Accumulate locally and combine; consider atomics for genuinely isolated operations |
| A saturated database or external service | Limit demand; adding threads may worsen the queue |

In production, bound queue sizes too. When arrivals exceed capacity, **backpressure** means slowing down or rejecting work before memory use and latency grow without control. Define who cancels, who waits for shutdown, and who receives errors.

To run each example, save its block using the indicated filename. With GCC or Clang and a compatible C++20 standard library:

```bash
clang++ -std=c++20 -O2 -Wall -Wextra -pedantic -pthread partitioned_sum.cpp -o partitioned_sum
./partitioned_sum
```

Change the filename to test the other programs. Expected outputs are `A1 B1 A2 B2 A3 B3` and `1000000`; the account program exits silently when its checks pass. Flags and thread support depend on the platform.

All three programs were compiled and executed with GCC 13.1 (MinGW) in C++20 mode. If your library does not provide `std::jthread`, selecting `-std=c++20` is not enough: check the installed standard library implementation too.

Before announcing an improvement:

1. Compare against a correct sequential version, using the same input and verifying the result.
2. Measure the path that matters. An end-to-end measurement should include creation, synchronization, and joining; if you measure only the kernel, identify that distinction.
3. Use `std::chrono::steady_clock`, repeat measurements, and record hardware, compiler, optimization, input size, and worker count. `sleep_for` is not a computation benchmark.
4. Observe throughput and latency, including percentiles under load. A lower average can hide a worse queue.
5. Look for data races with [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html) on a supported platform. It analyzes observed executions rather than proving the absence of all errors; its overhead also makes that run unsuitable as a production benchmark.

**Exercise:** adapt the sum for odd sizes and empty input. Then vary the data size and compare the sequential version with two workers. Find where coordination pays off, or record that it did not for this work on your machine.

## Conclusion: start with the work, not the thread

Concurrency organizes tasks that progress over overlapping periods. Parallelism executes work simultaneously. Asynchrony describes an operation delivering its result later. A system can combine all three, but each choice should address a concrete need.

My starting point would be to identify waiting and computation, define ownership, divide independent work, and make synchronization points explicit. Only then choose threads, tasks, or an event loop. **The best thread count is the one that supports your system's correct behavior and measured performance.**

## References and next steps

- [Go Blog — Concurrency is not parallelism](https://go.dev/blog/waza-talk): the conceptual distinction and Rob Pike's talk.
- [C++ Working Draft — `jthread`](https://eel.is/c++draft/thread.jthread.class), [data races](https://eel.is/c++draft/intro.races), and [execution policies](https://eel.is/c++draft/algorithms.parallel.exec): language and library contracts. The draft evolves; these examples use only C++20 or earlier features.
- [C++ Core Guidelines — Concurrency and parallelism](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-concurrency): design and review guidance.
- [Clang — ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html): usage, supported platforms, and limitations.
- On this site: [C++ by version](/en/artigos-tecnicos/cpp-versoes-features/), [cache affinity](/en/artigos-tecnicos/cache-affinity/), and the [practical C++ learning path](/en/reference/trilha-cpp/).
