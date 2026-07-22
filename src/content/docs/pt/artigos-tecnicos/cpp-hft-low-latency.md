---
title: C++ em High-Frequency Trading — O Que Realmente Importa para Baixa Latência
description: "Técnicas reais de C++ usadas em HFT: lock-free, cache locality, alocação customizada e o que faz diferença de verdade nos nanossegundos"
publishedAt: 2026-07-17
author: Dionisio
tags:
  - C++
  - HFT
  - Baixa Latência
  - Sistemas Críticos
  - Performance
cover: /assets/images/hft-cpp-latency.png
coverAlt: Painel de traders com gráficos de alta velocidade e código C++ sobreposto
---

<section class="ae-feature">
  <img src="/assets/images/hft-cpp-latency.png" alt="Painel de traders com gráficos de alta velocidade e código C++ sobreposto" loading="eager" />
  <div class="ae-feature-copy">
    <p class="ae-kicker">C++ · Finanças · Performance</p>
    <h2>Quando cada nanossegundo vale dinheiro, o compilador é seu melhor amigo</h2>
    <p>
      High-Frequency Trading não é sobre "escrever C++ rápido". É sobre conhecer cada ciclo de CPU,
      cada cache miss e cada branch prediction errada. Este artigo vai direto ao que realmente
      importa para deixar seu código voando em sistemas de trading reais.
    </p>
    <div class="ae-meta">
      <span>C++23</span>
      <span>Lock-Free</span>
      <span>Cache Coherence</span>
      <span>SIMD</span>
    </div>
  </div>
</section>

Em 2020, a Jane Street processava mais de **1 bilhão** de mensagens de mercado por dia. Em C++.
A Citadel Securities movimenta mais de **US$ 470 bilhões** em volume diário. Tudo em C++.

Se você acha que C++ é "legado" ou "coisa de sistema operacional antigo", o mercado financeiro
discorda — e discorda com dinheiro de verdade. O topo do mercado de HFT paga salários de **US$
400k a US$ 1M por ano** para engenheiros C++ que dominam as técnicas certas.

A questão não é saber C++. É saber *qual* C++ fazer e *onde* cada instrução importa.

## Por Que C++ É Insubstituível no HFT

Python é lento. Java tem GC pauses. Rust ainda está entrando. Go tem goroutines, mas não tem
controle fino de alocação. C# tem o mesmo problema de GC do Java.

C++ oferece três coisas que nenhuma dessas linguagens entrega simultaneamente:

1. **Controle absoluto de memória** — alocação stack, custom allocators, placement new
2. **Zero-cost abstractions** — templates, constexpr, e metaprogramação sem overhead
3. **Acesso direto ao hardware** — inline assembly, intrinsics, SIMD, cache prefetching

No HFT, você não está otimizando milissegundos. Está otimizando **nanossegundos**. Um cache miss
L3 custa ~40 nanossegundos. Uma branch prediction errada custa ~15 nanossegundos. E quando sua
ordem precisa chegar na bolsa antes da dos outros, isso é a diferença entre lucro e prejuízo.

## 1. Alocação de Memória — Stack é Dinheiro, Heap é Imposto

A primeira regra do HFT: **não aloque no hot path**. Nunca.

```cpp
// Péssimo: alocação dinâmica no caminho crítico
void process_order_bad(const Order& order) {
    auto enriched = std::make_unique<EnrichedOrder>();  // malloc no hot path = morte
    enriched->price = order.price * 1.0001;
    send_to_exchange(std::move(enriched));
}

// Ótimo: tudo na stack, zero alocação
void process_order_good(const Order& order) {
    EnrichedOrder enriched;  // stack allocation — grátis
    enriched.price = order.price * 1.0001;
    send_to_exchange(enriched);
}
```

Mas nem sempre é possível colocar tudo na stack. É aí que entram os **custom allocators**:

```cpp
// Arena allocator — aloca um bloco grande uma vez, depois "aloca" dentro dele
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

// Uso: alocação "dinâmica" sem syscall, sem lock, O(1)
Arena<1 << 20> arena;  // 1 MB na stack ou data segment
auto* order = arena.alloc<EnrichedOrder>();
```

A arena é thread-local, não tem lock, não chama malloc. O custo é literalmente um incremento de
ponteiro. Isso é o tipo de coisa que separa um sistema que escala de um que morre sob carga.

## 2. Lock-Free — O Jeito Certo de Compartilhar Dados

Mutex é proibido no hot path. Um `std::mutex::lock()` que cai em `futex` pode custar
**microssegundos** — uma eternidade no HFT.

A alternativa real é usar **lock-free queues**, particularmente a SPSC (Single Producer, Single
Consumer):

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
            return false;  // cheia
        buffer[current_tail] = item;
        tail.store(next_tail, std::memory_order_release);
        return true;
    }

    bool try_pop(T& item) {
        const size_t current_head = head.load(std::memory_order_relaxed);
        if (current_head == tail.load(std::memory_order_acquire))
            return false;  // vazia
        item = buffer[current_head];
        head.store((current_head + 1) & (Capacity - 1), std::memory_order_release);
        return true;
    }
};
```

Observações cruciais neste código:

- `alignas(64)` — evita **false sharing**. Sem isso, head e tail compartilhariam a mesma cache
  line, e cada escrita causaria invalidação na outra thread, destruindo performance.
- Memory orders corretos — `acquire` para ler, `release` para escrever. Nada de
  `memory_order_seq_cst` sem necessidade. Cada barreira a mais são nanossegundos perdidos.
- Power of 2 no capacity — permite usar bitmask (`& (Capacity - 1)`) em vez de módulo (`%`), que é
  uma operação cara.

## 3. Cache Locality — A CPU Odeia Surpresas

A memória RAM está a ~100 nanossegundos de distância da CPU. A cache L1 está a ~1 nanossegundo.
Isso significa que acessar a RAM é **100x mais lento** que acessar a cache L1.

No HFT, você projeta suas estruturas de dados para caber em cache lines (64 bytes no x86):

```cpp
// Péssimo: array of structs — cada campo está em uma cache line diferente
struct OrderBad {
    uint64_t id;
    double price;
    int32_t quantity;
    char side;
    char padding[3];  // manual padding é melhor que deixar o compilador adivinhar
};

// Bom para acesso por struct, mas péssimo para loops que só precisam de price

// Ótimo: struct of arrays — preço de todas as ordens em uma cache line contígua
struct OrderBook {
    std::array<uint64_t, 1024> ids;
    std::array<double, 1024>   prices;     // 8 * 8 = 64 bytes = 1 cache line de doubles
    std::array<int32_t, 1024>  quantities;
    std::array<char, 1024>     sides;
};
```

Quando você itera sobre `prices`, o hardware prefetcher carrega a próxima cache line
automaticamente. Isso é **3-10x mais rápido** que acessar o array de structs.

### Prefetching Manual

E quando você sabe o que vai acessar em seguida e o prefetcher não?

```cpp
#include <xmmintrin.h>  // _mm_prefetch

for (size_t i = 0; i < count; ++i) {
    // Diz pra CPU: "vou precisar do prices[i+16] logo, já começa a trazer"
    _mm_prefetch(reinterpret_cast<const char*>(&prices[i + 16]), _MM_HINT_T0);
    process(prices[i]);
}
```

Isso esconde a latência da memória fazendo o fetch enquanto você processa o item atual. Em
sistemas de market data feed, onde você processa milhares de updates por tick, isso reduz o tempo
de processamento em **20-40%**.

## 4. Compile-Time — Se Dá pra Resolver Agora, Resolva

Tudo que pode ser resolvido em tempo de compilação *deve* ser resolvido em tempo de compilação:

```cpp
// Constexpr: tabelas de lookup geradas pelo compilador
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

// Compilada uma vez, no binário, zero custo runtime
constexpr auto CRC32_TABLE = generate_crc_table();

inline uint32_t fast_crc32(const uint8_t* data, size_t len) {
    uint32_t crc = 0xFFFFFFFF;
    for (size_t i = 0; i < len; ++i)
        crc = CRC32_TABLE[(crc ^ data[i]) & 0xFF] ^ (crc >> 8);
    return crc ^ 0xFFFFFFFF;
}
```

Isso é usado em protocolos de fix engine (FIX Protocol) para checksums de mensagens. Tabela gerada
em tempo de compilação, zero overhead.

## 5. Templates e CRTP — Polimorfismo Sem Virtual Dispatch

`virtual` tem custo: vtable lookup, indireção, e pior — impede inlining. No HFT, você quer
**polimorfismo estático**:

```cpp
// CRTP: Curiously Recurring Template Pattern
template<typename Derived>
class OrderHandler {
public:
    void handle(const Order& order) {
        // Dispatch estático — resolvido em tempo de compilação
        static_cast<Derived*>(this)->handle_impl(order);
    }
};

class EquityHandler : public OrderHandler<EquityHandler> {
public:
    void handle_impl(const Order& order) {
        // Código específico para equities — será inlineado
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

Zero vtable, zero indireção, 100% inlineável. O compilador gera código como se cada `handle()`
chamasse a função final diretamente.

## 6. SIMD — Processando Múltiplos Dados em Uma Instrução

Quando você precisa calcular o preço médio de 8 ordens, por que fazer 8 operações separadas?

```cpp
#include <immintrin.h>  // AVX2

// Calcula o preço médio de 4 doubles de uma vez
__m256d compute_vwap(__m256d prices, __m256d volumes) {
    auto weighted = _mm256_mul_pd(prices, volumes);          // price * volume (4 de uma vez)
    auto total_volume = _mm256_hadd_pd(volumes, volumes);    // soma horizontal dos volumes
    // ... redução final e divisão
    return _mm256_div_pd(weighted, total_volume);
}
```

AVX-512 em CPUs modernas processa **8 doubles simultaneamente**. Para cálculo de risco pré-trade,
greeks de opções, ou VWAP em tempo real, SIMD transforma um loop de 1000 iterações em 125
iterações. Linearmente mais rápido.

## O Que as Firms Realmente Procuram

Depois de 20 anos escrevendo C++, posso dizer com segurança: as firms de HFT não estão procurando
alguém que "conhece a STL". Elas querem:

- **Alguém que entende o que acontece entre o código e o silício** — pipeline, branch predictor,
  cache hierarchy, TLB
- **Alguém que sabe quando NÃO usar smart pointers** — `shared_ptr` no hot path é suicídio de
  performance (atomic reference counting = contenção)
- **Alguém que lê assembly gerado** — `objdump -d`, `perf report`, Godbolt — para verificar se o
  compilador realmente inlineou o que você esperava
- **Alguém que sabe medir** — `perf stat`, `valgrind --tool=cachegrind`, PAPI counters. Sem
  medição, "otimização" é superstição

O melhor caminho para entrar nesse mercado? Construa um **matching engine** do zero. Uma order
book que processa milhares de ordens por segundo com zero alocação, lock-free, e latência
previsível. Isso é projeto de portfólio que faz recrutador de HFT parar e ler.

## Leitura Recomendada

- *C++ Concurrency in Action* — Anthony Williams. A bíblia de lock-free em C++.
- *Computer Systems: A Programmer's Perspective* — Bryant & O'Hallaron. Entenda o que seu código
  faz no hardware.
- *What Every Programmer Should Know About Memory* — Ulrich Drepper. O paper definitivo sobre
  hierarquia de memória. Disponível gratuito.
- Talks do **David Gross** (Jane Street) e **Carl Cook** (Optiver) no CppCon.

Se você quer estar entre os engenheiros que escrevem o código que move bilhões por dia, o caminho
começa entendendo cada ciclo de CPU e cada byte de cache line.

Não é sobre "C++ moderno". É sobre **C++ consciente**.
