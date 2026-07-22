---
title: C++ in High-Frequency Trading — What Actually Matters for Low Latency
description: "Real C++ techniques used in HFT: lock-free programming, cache locality, custom allocation, and what genuinely makes a difference at the nanosecond level"
publishedAt: 2026-07-17
author: Dionisio
tags:
  - C++
  - HFT
  - Low Latency
  - Critical Systems
  - Performance
cover: /assets/images/hft-cpp-latency.png
coverAlt: Trading floor with high-speed charts and C++ code overlay
---

<section class="ae-feature">
  <img src="/assets/images/hft-cpp-latency.png" alt="Trading floor with high-speed charts and C++ code overlay" loading="eager" />
  <div class="ae-feature-copy">
    <p class="ae-kicker">C++ · Finance · Performance</p>
    <h2>When every nanosecond is money, the compiler is your best friend</h2>
    <p>
      High-Frequency Trading isn't about "writing fast C++". It's about knowing every CPU cycle,
      every cache miss, and every mispredicted branch. This article goes straight to what actually
      matters for making your code fly in real trading systems.
    </p>
    <div class="ae-meta">
      <span>C++23</span>
      <span>Lock-Free</span>
      <span>Cache Coherence</span>
      <span>SIMD</span>
    </div>
  </div>
</section>

In 2020, Jane Street processed over **1 billion** market data messages per day. In C++. Citadel
Securities moves over **$470 billion** in daily volume. All in C++.

If you think C++ is "legacy" or "just for old operating systems," the financial markets disagree —
and they disagree with real money. Top HFT firms pay **$400k to $1M per year** for C++ engineers
who master the right techniques.

The question isn't knowing C++. It's knowing *which* C++ to write and *where* every instruction
matters.

## Why C++ Is Irreplaceable in HFT

Python is slow. Java has GC pauses. Rust is still gaining ground. Go has goroutines but lacks
fine-grained allocation control. C# shares Java's GC problem.

C++ offers three things none of these languages deliver simultaneously:

1. **Absolute memory control** — stack allocation, custom allocators, placement new
2. **Zero-cost abstractions** — templates, constexpr, and metaprogramming with no overhead
3. **Direct hardware access** — inline assembly, intrinsics, SIMD, cache prefetching

In HFT, you're not optimizing milliseconds. You're optimizing **nanoseconds**. An L3 cache miss
costs ~40 nanoseconds. A mispredicted branch costs ~15 nanoseconds. And when your order needs to
reach the exchange before everyone else's, that's the difference between profit and loss.

## 1. Memory Allocation — Stack Is Money, Heap Is Tax

The first rule of HFT: **never allocate on the hot path**. Ever.

```cpp
// Terrible: dynamic allocation on the critical path
void process_order_bad(const Order& order) {
    auto enriched = std::make_unique<EnrichedOrder>();  // malloc on hot path = death
    enriched->price = order.price * 1.0001;
    send_to_exchange(std::move(enriched));
}

// Excellent: everything on the stack, zero allocation
void process_order_good(const Order& order) {
    EnrichedOrder enriched;  // stack allocation — free
    enriched.price = order.price * 1.0001;
    send_to_exchange(enriched);
}
```

But you can't always put everything on the stack. That's where **custom allocators** come in:

```cpp
// Arena allocator — allocates a large block once, then "allocates" within it
template<size_t Size>
class Arena {
    alignas(64) char buffer[Size];
    char* ptr = buffer;
public:
    template<typename T>
    T* alloc() {
        auto* p = reinterpret_cast<T*>(ptr);
        ptr += sizeof(T);
        return p;
    }
    void reset() { ptr = buffer; }
};

// Usage: "dynamic" allocation without syscall, without lock, O(1)
Arena<1 << 20> arena;  // 1 MB on stack or data segment
auto* order = arena.alloc<EnrichedOrder>();
```

The arena is thread-local, lock-free, and never calls malloc. The cost is literally a pointer
increment. This is the kind of thing that separates a system that scales from one that dies under
load.

## 2. Lock-Free — The Right Way to Share Data

Mutex is forbidden on the hot path. A `std::mutex::lock()` that falls into `futex` can cost
**microseconds** — an eternity in HFT.

The real alternative is **lock-free queues**, particularly SPSC (Single Producer, Single Consumer):

```cpp
#include <atomic>
#include <cstddef>

template<typename T, size_t Capacity>
class SPSCQueue {
    static_assert((Capacity & (Capacity - 1)) == 0, "Capacity must be power of 2");

    alignas(64) T buffer[Capacity];           // cache-line aligned
    alignas(64) std::atomic<size_t> head{0};  // separate cache line
    alignas(64) std::atomic<size_t> tail{0};  // separate cache line

public:
    bool try_push(const T& item) {
        const size_t current_tail = tail.load(std::memory_order_relaxed);
        const size_t next_tail = (current_tail + 1) & (Capacity - 1);
        if (next_tail == head.load(std::memory_order_acquire))
            return false;  // full
        buffer[current_tail] = item;
        tail.store(next_tail, std::memory_order_release);
        return true;
    }

    bool try_pop(T& item) {
        const size_t current_head = head.load(std::memory_order_relaxed);
        if (current_head == tail.load(std::memory_order_acquire))
            return false;  // empty
        item = buffer[current_head];
        head.store((current_head + 1) & (Capacity - 1), std::memory_order_release);
        return true;
    }
};
```

Critical observations in this code:

- `alignas(64)` — prevents **false sharing**. Without it, head and tail would share the same cache
  line, and each write would cause invalidation on the other thread, destroying performance.
- Correct memory orders — `acquire` for reads, `release` for writes. Never `memory_order_seq_cst`
  unless necessary. Every extra barrier is lost nanoseconds.
- Power of 2 capacity — enables bitmask (`& (Capacity - 1)`) instead of modulo (`%`), which is an
  expensive operation.

## 3. Cache Locality — The CPU Hates Surprises

RAM is ~100 nanoseconds away from the CPU. L1 cache is ~1 nanosecond. That means accessing RAM is
**100x slower** than hitting L1 cache.

In HFT, you design your data structures to fit in cache lines (64 bytes on x86):

```cpp
// Terrible: array of structs — each field scattered across different cache lines
struct OrderBad {
    uint64_t id;
    double price;
    int32_t quantity;
    char side;
    char padding[3];  // manual padding beats letting the compiler guess
};

// Good for per-struct access, but terrible for loops that only need price

// Excellent: struct of arrays — all order prices in a contiguous cache line
struct OrderBook {
    std::array<uint64_t, 1024> ids;
    std::array<double, 1024>   prices;     // 8 * 8 = 64 bytes = 1 cache line of doubles
    std::array<int32_t, 1024>  quantities;
    std::array<char, 1024>     sides;
};
```

When you iterate over `prices`, the hardware prefetcher automatically loads the next cache line.
This is **3-10x faster** than accessing the array of structs.

### Manual Prefetching

And when you know what you'll access next and the prefetcher doesn't?

```cpp
#include <xmmintrin.h>  // _mm_prefetch

for (size_t i = 0; i < count; ++i) {
    // Tell the CPU: "I'll need prices[i+16] soon, start fetching it now"
    _mm_prefetch(reinterpret_cast<const char*>(&prices[i + 16]), _MM_HINT_T0);
    process(prices[i]);
}
```

This hides memory latency by fetching while you process the current item. In market data feed
systems processing thousands of updates per tick, this reduces processing time by **20-40%**.

## 4. Compile-Time — If You Can Solve It Now, Solve It

Everything that can be resolved at compile time *must* be resolved at compile time:

```cpp
// Constexpr: lookup tables generated by the compiler
constexpr auto generate_crc_table() {
    std::array<uint32_t, 256> table{};
    for (uint32_t i = 0; i < 256; ++i) {
        uint32_t crc = i;
        for (int j = 0; j < 8; ++j)
            crc = (crc >> 1) ^ ((crc & 1) ? 0xEDB88320 : 0);
        table[i] = crc;
    }
    return table;
}

// Compiled once, in the binary, zero runtime cost
constexpr auto CRC32_TABLE = generate_crc_table();

inline uint32_t fast_crc32(const uint8_t* data, size_t len) {
    uint32_t crc = 0xFFFFFFFF;
    for (size_t i = 0; i < len; ++i)
        crc = CRC32_TABLE[(crc ^ data[i]) & 0xFF] ^ (crc >> 8);
    return crc ^ 0xFFFFFFFF;
}
```

This is used in FIX engine protocols for message checksums. Table generated at compile time, zero
runtime overhead.

## 5. Templates and CRTP — Polymorphism Without Virtual Dispatch

`virtual` has a cost: vtable lookup, indirection, and worst of all — it prevents inlining. In HFT,
you want **static polymorphism**:

```cpp
// CRTP: Curiously Recurring Template Pattern
template<typename Derived>
class OrderHandler {
public:
    void handle(const Order& order) {
        // Static dispatch — resolved at compile time
        static_cast<Derived*>(this)->handle_impl(order);
    }
};

class EquityHandler : public OrderHandler<EquityHandler> {
public:
    void handle_impl(const Order& order) {
        // Equity-specific code — will be inlined
        route_to_nyse(order);
    }
};

class ForexHandler : public OrderHandler<ForexHandler> {
public:
    void handle_impl(const Order& order) {
        route_to_ebs(order);
    }
};
```

Zero vtable, zero indirection, 100% inlineable. The compiler generates code as if each `handle()`
calls the final function directly.

## 6. SIMD — Processing Multiple Data Points in One Instruction

When you need to compute the average price of 8 orders, why do 8 separate operations?

```cpp
#include <immintrin.h>  // AVX2

// Computes weighted average of 4 doubles at once
__m256d compute_vwap(__m256d prices, __m256d volumes) {
    auto weighted = _mm256_mul_pd(prices, volumes);          // price * volume (4 at once)
    auto total_volume = _mm256_hadd_pd(volumes, volumes);    // horizontal sum of volumes
    // ... final reduction and division
    return _mm256_div_pd(weighted, total_volume);
}
```

AVX-512 on modern CPUs processes **8 doubles simultaneously**. For pre-trade risk calculation,
option greeks, or real-time VWAP, SIMD turns a 1000-iteration loop into 125 iterations. Linearly
faster.

## What Firms Really Look For

After 20 years writing C++, I can say with confidence: HFT firms aren't looking for someone who
"knows the STL." They want:

- **Someone who understands what happens between the code and silicon** — pipeline, branch
  predictor, cache hierarchy, TLB
- **Someone who knows when NOT to use smart pointers** — `shared_ptr` on the hot path is
  performance suicide (atomic reference counting = contention)
- **Someone who reads generated assembly** — `objdump -d`, `perf report`, Godbolt — to verify the
  compiler actually inlined what you expected
- **Someone who knows how to measure** — `perf stat`, `valgrind --tool=cachegrind`, PAPI counters.
  Without measurement, "optimization" is superstition

The best way into this market? Build a **matching engine** from scratch. An order book that
processes thousands of orders per second with zero allocation, lock-free, and predictable latency.
That's the portfolio project that makes HFT recruiters stop and read.

## Recommended Reading

- *C++ Concurrency in Action* — Anthony Williams. The lock-free C++ bible.
- *Computer Systems: A Programmer's Perspective* — Bryant & O'Hallaron. Understand what your code
  does on the hardware.
- *What Every Programmer Should Know About Memory* — Ulrich Drepper. The definitive paper on memory
  hierarchy. Available for free.
- Talks by **David Gross** (Jane Street) and **Carl Cook** (Optiver) at CppCon.

If you want to be among the engineers writing the code that moves billions per day, the path starts
with understanding every CPU cycle and every cache line byte.

It's not about "modern C++." It's about **conscious C++**.
