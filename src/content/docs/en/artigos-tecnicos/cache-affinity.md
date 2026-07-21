---
title: "Cache Affinity: Why Your Data Shouldn't Travel Between Cores"
description: "Understand cache affinity, false sharing, alignment, and why moving data across cores can cost hundreds of CPU cycles"
publishedAt: 2026-07-21
author: Dionisio
tags:
  - Performance
  - C++
  - Cache
  - Low Latency
  - Systems
cover: /assets/images/cache-affinity.png
coverAlt: CPU cache hierarchy diagram with cores and highlighted cache lines
---

<section class="ae-feature">
  <img src="/assets/images/cache-affinity.png" alt="CPU cache hierarchy diagram with cores and highlighted cache lines" loading="eager" />
  <div class="ae-feature-copy">
    <p class="ae-kicker">CPU · Memory · Performance</p>
    <h2>Your data is in the wrong place and it's costing you dearly</h2>
    <p>
      You can write the most elegant algorithm in the world. If the data isn't in the right cache,
      on the right core, at the right time, you're leaving performance on the table — sometimes
      10x, sometimes 100x.
    </p>
    <div class="ae-meta">
      <span>Cache Coherence</span>
      <span>False Sharing</span>
      <span>NUMA</span>
      <span>Thread Pinning</span>
    </div>
  </div>
</section>

Here's a brutal truth about performance that few people internalize: **the bottleneck isn't the
CPU. It's the path between the CPU and memory.**

In 2026, a CPU core still executes instructions in roughly 0.25 nanoseconds. But fetching data
from main RAM takes ~100 nanoseconds. That's **400 CPU cycles spent waiting.** And if the data is
on the wrong socket of a NUMA machine? **200-300 nanoseconds.** Literally double.

Cache affinity isn't a trick. It's the difference between a system that delivers predictable
latency and one that melts under load because every request is a guaranteed cache miss.

## The Hierarchy That Controls Everything

Before discussing affinity, you need to visualize the playing field:

```
Core 0              Core 1              Core 2              Core 3
  L1 (32KB)           L1 (32KB)           L1 (32KB)           L1 (32KB)
  L2 (256KB)          L2 (256KB)          L2 (256KB)          L2 (256KB)
       \                  |                  |                  /
        \____________________________________________________/
                           |
                      L3 Shared (16-32MB)
                           |
                      RAM (64-256GB)
                           |
                 [Socket 1 — NUMA Node 1]
```

Real latencies (Intel Sapphire Rapids, 2024):

| Level     | Latency | Penalty vs L1 |
|-----------|---------|----------------|
| L1        | ~1 ns   | 1x            |
| L2        | ~4 ns   | 4x             |
| L3        | ~12 ns  | 12x            |
| Local RAM | ~80 ns  | 80x            |
| Remote RAM (NUMA) | ~140 ns | 140x    |

What this means in practice: if you access `prices[i]` and the data is in RAM, you could have
executed **320 instructions** in the waiting time. In a 1-million-element loop, that's enough time
to process an entire month's credit card statement.

## Cache Affinity: The Concept That Changes Everything

**Cache affinity** is the principle of keeping data and threads pinned to the same CPU core to
maximize cache hits.

When a thread processes data on Core 3 and accumulates state in that core's L1 and L2, it has
*affinity* with that core. If the OS scheduler moves this thread to Core 7, all that cache state is
lost. The thread must rebuild its working set from scratch, hitting L3 or RAM. This is called
**cold cache.**

The impact is brutal:

```cpp
// Simulating cache affinity loss
#include <benchmark/benchmark.h>
#include <vector>
#include <thread>
#include <sched.h>

constexpr size_t WORKING_SET = 16 * 1024 * 1024;  // 16 MB — larger than L2, smaller than L3

void process_chunk(std::vector<int>& data, size_t start, size_t end) {
    int sum = 0;
    for (size_t i = start; i < end; ++i)
        sum += data[i];  // touch all data
    benchmark::DoNotOptimize(sum);
}

// Scenario 1: thread pinned to one core — cache stays warm after first iteration
static void BM_CacheWarm(benchmark::State& state) {
    std::vector<int> data(WORKING_SET / sizeof(int), 1);
    cpu_set_t cpuset;
    CPU_ZERO(&cpuset);
    CPU_SET(2, &cpuset);
    pthread_setaffinity_np(pthread_self(), sizeof(cpuset), &cpuset);

    for (auto _ : state) {
        process_chunk(data, 0, data.size());
    }
}
BENCHMARK(BM_CacheWarm);

// Scenario 2: thread bouncing between cores each iteration — cache always cold
static void BM_CacheCold(benchmark::State& state) {
    std::vector<int> data(WORKING_SET / sizeof(int), 1);

    int core = 2;
    for (auto _ : state) {
        cpu_set_t cpuset;
        CPU_ZERO(&cpuset);
        CPU_SET(core, &cpuset);
        pthread_setaffinity_np(pthread_self(), sizeof(cpuset), &cpuset);
        core = (core == 2) ? 6 : 2;  // alternates between cores each iteration

        process_chunk(data, 0, data.size());
    }
}
BENCHMARK(BM_CacheCold);

// Typical result:
// BM_CacheWarm:  ~8ms per iteration (data in same core's L3, partially L2)
// BM_CacheCold: ~14ms per iteration (data migrates, cache invalidation every switch)
// Penalty: ~75% slower just from losing cache affinity
```

75% slower. No algorithm change. No data change. Just moving *where* the thread runs.

## False Sharing: The Silent Killer

Cache affinity isn't just about keeping data close. It's about keeping it **separate when
different threads write to it.**

The cache coherence protocol (MESI on x86) ensures all CPUs see memory correctly. But the price is
high: when Core 0 writes to a cache line, **all copies of that cache line on other cores are
invalidated.**

If two threads write to different variables that land on the *same cache line*, you have **false
sharing**: hardware contention where no logical contention exists.

```cpp
// Classic false sharing example
struct CounterPair {
    alignas(64) uint64_t counter_a;  // Core 0 writes here
    uint64_t counter_b;              // Core 1 writes here — SAME cache line!
    // counter_b is at bytes 8-15. The cache line spans 0-63.
    // Every write to counter_b invalidates counter_a on Core 0. And vice versa.
};

// Measuring the impact
CounterPair counters{};

void thread_a() {
    for (int i = 0; i < 100'000'000; ++i)
        counters.counter_a++;  // ~300M cycles with false sharing
}

void thread_b() {
    for (int i = 0; i < 100'000'000; ++i)
        counters.counter_b++;  // fights for the same cache line on every write
}

// Running thread_a and thread_b in parallel:
// With false sharing:  ~800ms
// Without false sharing: ~180ms (adding padding between counter_a and counter_b)
// Penalty: ~4.4x slower
```

The fix is simple and devastatingly effective:

```cpp
struct CounterPairFixed {
    alignas(64) uint64_t counter_a;   // Cache line 0: bytes 0-7, padding to 63
    alignas(64) uint64_t counter_b;   // Cache line 1: bytes 64-71, padding to 127
    // Now each thread operates on its own exclusive cache line.
    // Zero cross-invalidation.
};
```

**Every shared data structure between threads must be cache-line-aligned.** If you have an SPSC
queue, head and tail need separate cache lines. If you have an array of locks, each lock must
occupy its own cache line. If you have a hot path with multiple fields being written by different
threads, each field needs its own cache line.

## Professional Cache Line Alignment

In modern C++, the most expressive way to force alignment:

```cpp
#include <new>  // std::hardware_destructive_interference_size

// C++17: the compiler tells you the minimum size to avoid false sharing
constexpr size_t CACHE_LINE = std::hardware_destructive_interference_size;
// Typically 64 on x86, 128 on Apple Silicon, 256 on some POWER architectures

// Idiomatic usage
struct alignas(CACHE_LINE) PaddedCounter {
    uint64_t value;
};

// Or, for arrays:
struct ThreadLocalState {
    alignas(CACHE_LINE) char padding_before[0];
    int active_orders;
    double risk_exposure;
    char strategy_id;
    alignas(CACHE_LINE) char padding_after[0];
    // Forces each instance to occupy a full cache line
};

std::array<ThreadLocalState, MAX_THREADS> thread_states;
```

The `alignas(CACHE_LINE) char padding_XX[0]` is a dirty elegant trick: the zero-length array
inherits the alignment, forcing the next field onto the next cache line. Some compilers accept
`alignas(64) char _pad[0]` as an extension, but the standard approach is struct wrapping.

## Advanced Technique: Cache Warming

If you know you'll need a dataset soon, why wait for the cache miss?

```cpp
#include <xmmintrin.h>

// Prefetch at 4 levels of aggressiveness:
// _MM_HINT_T0  — bring into all cache levels (L1, L2, L3)
// _MM_HINT_T1  — bring into L2 and L3
// _MM_HINT_T2  — bring into L3 only
// _MM_HINT_NTA — non-temporal: bring but don't pollute higher caches

void prefetch_order_book(const double* prices, size_t count, size_t ahead) {
    for (size_t i = 0; i < count; ++i) {
        if (i + ahead < count)
            _mm_prefetch(reinterpret_cast<const char*>(&prices[i + ahead]), _MM_HINT_T0);
        process(prices[i]);
    }
}

// In trading systems: prefetch the next 16 book levels while processing the current one
```

But beware: prefetch isn't free. Each prefetch instruction consumes load buffer resources. If you
prefetch things you won't use, you're wasting memory bandwidth that could be serving real accesses.

Rules of thumb:
- Prefetch with `ahead = 8` to `16` elements — hides L2/L3 latency
- Prefetch with `ahead = 64` to `128` elements — hides RAM latency
- Use `_MM_HINT_NTA` for data you'll read only once (streaming)
- NEVER prefetch inside an `if` that's rarely true

## NUMA Awareness: When Your Machine Is Larger Than One Socket

On 2- or 4-socket servers, RAM is physically divided. Each socket has its own local memory
("near") and can access other sockets' memory ("far"). The latency difference is brutal: **80ns vs
140ns.**

NUMA-aware programming means: if a thread runs on socket 0, the data it accesses must be allocated
from socket 0's RAM.

```cpp
#include <numa.h>
#include <numaif.h>

// Allocate memory bound to a specific NUMA node
void* numa_alloc(size_t bytes, int node) {
    void* ptr = numa_alloc_onnode(bytes, node);
    if (!ptr) throw std::bad_alloc();
    return ptr;
}

// Migrate thread to a specific core
void pin_thread_to_core(int core_id) {
    cpu_set_t cpuset;
    CPU_ZERO(&cpuset);
    CPU_SET(core_id, &cpuset);
    pthread_setaffinity_np(pthread_self(), sizeof(cpuset), &cpuset);
}

// Complete setup: thread on core 4 (socket 0), data allocated from socket 0's RAM
void setup_numa_aware(int numa_node, int core_on_that_node) {
    pin_thread_to_core(core_on_that_node);
    auto* buffer = static_cast<double*>(numa_alloc(1 << 20, numa_node));  // 1MB on right node
    // ... use buffer
    numa_free(buffer, 1 << 20);
}
```

In HFT systems, it's common to allocate the entire order book with `numa_alloc_onnode()` and pin
processing threads to cores on the same socket. This guarantees **100% local accesses.** The cost
of not doing this is paying cross-socket latency on every price update.

## How to Measure All of This

Talking about cache affinity without measuring is astrology. Real tools:

```bash
# Cache misses per process
perf stat -e cache-references,cache-misses,L1-dcache-load-misses,LLC-load-misses ./your_program

# Detailed profile: which source lines cause the most cache misses
perf record -e cache-misses ./your_program
perf report

# False sharing: the metric that gives you the diagnosis
perf stat -e l2_rqsts.all_rfo  ./your_program
# RFO = Request For Ownership — a CPU requesting exclusive ownership of a cache line
# If this number is high between threads that don't logically share data,
# you have false sharing. Guaranteed.

# Cachegrind: precise cache hierarchy simulation
valgrind --tool=cachegrind --branch-sim=yes ./your_program
cg_annotate cachegrind.out.XXXX
```

The metric I chase most: **cycles per instruction (CPI).** In a healthy system with good cache
affinity, CPI stays below 1.0. If it's above 2.0, you're spending more time waiting for memory
than executing instructions.

## Practical Summary: The Cache Affinity Checklist

1. **Align everything to cache lines.** `alignas(64)` or `std::hardware_destructive_interference_size`
2. **Separate write data per thread.** Each thread should have exclusive ownership of its cache
   lines. If two threads write to the same cache line, you have false sharing.
3. **Thread pinning.** If a thread owns a dataset, keep it pinned to the same core.
   `pthread_setaffinity_np`.
4. **Think in SoA (Struct of Arrays).** If you iterate over a specific field in a collection,
   that field should be contiguous in memory.
5. **NUMA matters.** On multi-socket machines, allocate memory on the node where the thread runs.
   `numa_alloc_onnode`.
6. **Prefetch with purpose.** If you know what you'll access, tell the CPU. But don't overdo it.
7. **Measure, don't assume.** `perf stat`, cachegrind, CPI. Real data, not intuition.
8. **The first rule of performance:** numbers don't lie. If you haven't measured, you haven't
   optimized.

Cache affinity isn't an academic topic. It's performance engineering that separates systems that
scale from systems that collapse under load. And the beauty is that the gains are enormous with
relatively small changes to data layout and scheduling policy.

Next time your system is slow, before touching the algorithm, ask: **is my data in the right
place?**
