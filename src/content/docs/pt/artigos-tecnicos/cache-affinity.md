---
title: "Cache Affinity: Por Que Seus Dados Não Devem Viajar Entre Núcleos"
description: "Entenda afinidade de cache, false sharing, alinhamento e por que mover dados entre cores pode custar centenas de ciclos de CPU"
publishedAt: 2026-07-19
author: Dionisio
tags:
  - Performance
  - C++
  - Cache
  - Baixa Latência
  - Sistemas
cover: /assets/images/cache-affinity.png
coverAlt: Diagrama de hierarquia de cache com núcleos de CPU e linhas de cache destacadas
---

<section class="ae-feature">
  <img src="/assets/images/cache-affinity.png" alt="Diagrama de hierarquia de cache com núcleos de CPU e linhas de cache destacadas" loading="eager" />
  <div class="ae-feature-copy">
    <p class="ae-kicker">CPU · Memória · Performance</p>
    <h2>Seus dados estão no lugar errado e isso está custando caro</h2>
    <p>
      Você pode escrever o algoritmo mais elegante do mundo. Se os dados não estiverem no cache
      certo, no núcleo certo, na hora certa, você está deixando performance na mesa — às vezes
      10x, às vezes 100x.
    </p>
    <div class="ae-meta">
      <span>Cache Coherence</span>
      <span>False Sharing</span>
      <span>NUMA</span>
      <span>Thread Pinning</span>
    </div>
  </div>
</section>

Tem uma verdade brutal sobre performance que pouca gente internaliza: **o gargalo não é a CPU. É
o caminho entre a CPU e a memória.**

Em 2026, um core de CPU ainda processa instruções na casa de ~0.25 nanossegundos. Mas buscar um
dado da RAM principal leva ~100 nanossegundos. Isso são **400 ciclos de CPU parados, esperando.**
E se o dado estiver no socket errado de uma máquina NUMA? **200-300 nanossegundos.** Literalmente
o dobro.

Cache affinity não é um truque. É a diferença entre um sistema que entrega latência previsível e
um que derrete sob carga porque cada requisição é um cache miss garantido.

## A Hierarquia Que Controla Tudo

Antes de falar de afinidade, você precisa visualizar o campo de jogo:

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

Latências reais (Intel Sapphire Rapids, 2024):

| Nível   | Latência | Penalidade vs L1 |
|---------|----------|-------------------|
| L1      | ~1 ns    | 1x               |
| L2      | ~4 ns    | 4x               |
| L3      | ~12 ns   | 12x              |
| RAM local | ~80 ns | 80x              |
| RAM remota (NUMA) | ~140 ns | 140x       |

O que isso significa na prática: se você acessar `prices[i]` e o dado estiver na RAM, você poderia
ter executado **320 instruções** no tempo de espera. Num loop de 1 milhão de elementos, isso é
tempo suficiente para processar a fatura inteira do cartão de crédito de um mês.

## Cache Affinity: O Conceito Que Muda Tudo

**Cache affinity** é o princípio de manter dados e threads colados ao mesmo núcleo de CPU para
maximizar cache hits.

Quando uma thread processa dados no Core 3 e acumula estado na L1 e L2 daquele core, ela tem
*affinity* com aquele núcleo. Se o scheduler do SO mover essa thread para o Core 7, todo o estado
de cache é perdido. A thread precisa reconstruir seu working set do zero, acessando L3 ou RAM.
Isso se chama **cold cache**.

O impacto é brutal:

```cpp
// Simulando perda de cache affinity
#include <benchmark/benchmark.h>
#include <vector>
#include <thread>
#include <sched.h>

constexpr size_t WORKING_SET = 16 * 1024 * 1024;  // 16 MB — maior que L2, menor que L3

void process_chunk(std::vector<int>& data, size_t start, size_t end) {
    int sum = 0;
    for (size_t i = start; i < end; ++i)
        sum += data[i];  // touch all data
    benchmark::DoNotOptimize(sum);
}

// Cenário 1: thread fixa no mesmo core — cache quente após primeira iteração
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

// Cenário 2: thread migrando entre cores a cada iteração — cache sempre frio
static void BM_CacheCold(benchmark::State& state) {
    std::vector<int> data(WORKING_SET / sizeof(int), 1);

    int core = 2;
    for (auto _ : state) {
        cpu_set_t cpuset;
        CPU_ZERO(&cpuset);
        CPU_SET(core, &cpuset);
        pthread_setaffinity_np(pthread_self(), sizeof(cpuset), &cpuset);
        core = (core == 2) ? 6 : 2;  // alterna entre cores a cada iteração

        process_chunk(data, 0, data.size());
    }
}
BENCHMARK(BM_CacheCold);

// Resultado típico:
// BM_CacheWarm:  ~8ms por iteração (dados na L3 do mesmo core, parcialmente L2)
// BM_CacheCold: ~14ms por iteração (dados migram, invalidação de cache a cada troca)
// Penalidade: ~75% mais lento apenas por perder afinidade de cache
```

75% mais lento. Sem mudar o algoritmo. Sem mudar os dados. Só mudando *onde* a thread roda.

## False Sharing: O Inimigo Silencioso

Cache affinity não é só sobre manter dados perto. É sobre mantê-los **separados quando threads
diferentes escrevem neles.**

O protocolo de coerência de cache (MESI no x86) garante que todas as CPUs vejam a memória
corretamente. Mas o preço é alto: quando o Core 0 escreve numa cache line, **todas as cópias
daquela cache line nos outros cores são invalidadas.**

Se duas threads escrevem em variáveis diferentes que caem na *mesma cache line*, você tem **false
sharing**: contenção de hardware onde não existe contenção lógica.

```cpp
// Exemplo clássico de false sharing
struct CounterPair {
    alignas(64) uint64_t counter_a;  // Core 0 escreve aqui
    uint64_t counter_b;              // Core 1 escreve aqui — MESMA cache line!
    // counter_b está nos bytes 8-15. A cache line vai de 0 a 63.
    // Cada escrita em counter_b invalida counter_a no Core 0. E vice-versa.
};

// Medindo o impacto
CounterPair counters{};

void thread_a() {
    for (int i = 0; i < 100'000'000; ++i)
        counters.counter_a++;  // ~300M ciclos com false sharing
}

void thread_b() {
    for (int i = 0; i < 100'000'000; ++i)
        counters.counter_b++;  // disputa a mesma cache line a cada escrita
}

// Rodando thread_a e thread_b em paralelo:
// Com false sharing:  ~800ms
// Sem false sharing:  ~180ms  (adicionando padding entre counter_a e counter_b)
// Penalidade: ~4.4x mais lento
```

O fix é simples e devastadoramente eficaz:

```cpp
struct CounterPairFixed {
    alignas(64) uint64_t counter_a;   // Cache line 0: bytes 0-7, padding até 63
    alignas(64) uint64_t counter_b;   // Cache line 1: bytes 64-71, padding até 127
    // Agora cada thread opera em uma cache line exclusiva.
    // Zero invalidação cruzada.
};
```

**Toda estrutura de dados compartilhada entre threads deve ser cache-line-aligned.** Se você tem
uma SPSC queue, head e tail precisam estar em cache lines separadas. Se você tem um array de
locks, cada lock precisa ocupar sua própria cache line. Se você tem um hot path com múltiplos
campos sendo escritos por threads diferentes, cada campo precisa de sua própria cache line.

## Cache Line Alignment Profissional

Em C++ moderno, o jeito mais expressivo de forçar alinhamento:

```cpp
#include <new>  // std::hardware_destructive_interference_size

// C++17: o compilador te diz o tamanho mínimo para evitar false sharing
constexpr size_t CACHE_LINE = std::hardware_destructive_interference_size;
// Tipicamente 64 no x86, 128 no Apple Silicon, 256 em algumas arquiteturas POWER

// Uso idiomático
struct alignas(CACHE_LINE) PaddedCounter {
    uint64_t value;
};

// Ou, para arrays:
struct ThreadLocalState {
    alignas(CACHE_LINE) char padding_before[0];
    int active_orders;
    double risk_exposure;
    char strategy_id;
    alignas(CACHE_LINE) char padding_after[0];
    // Força cada instância a ocupar uma cache line completa
};

std::array<ThreadLocalState, MAX_THREADS> thread_states;
```

O `alignas(CACHE_LINE) char padding_XX[0]` é um truque sujo e elegante: o array de tamanho zero
herda o alinhamento, forçando o próximo campo a cair na próxima cache line. Alguns compiladores
aceitam `alignas(64) char _pad[0]` como extensão, mas o padrão é usar struct wrapping.

## Técnica Avançada: Cache Warming

Se você sabe que vai precisar de um conjunto de dados daqui a pouco, por que esperar o cache miss?

```cpp
#include <xmmintrin.h>

// Prefetch em 4 níveis de agressividade:
// _MM_HINT_T0 — traz para todos os níveis de cache (L1, L2, L3)
// _MM_HINT_T1 — traz para L2 e L3
// _MM_HINT_T2 — traz para L3 apenas
// _MM_HINT_NTA — non-temporal: traz mas não polui caches superiores

void prefetch_order_book(const double* prices, size_t count, size_t ahead) {
    for (size_t i = 0; i < count; ++i) {
        if (i + ahead < count)
            _mm_prefetch(reinterpret_cast<const char*>(&prices[i + ahead]), _MM_HINT_T0);
        process(prices[i]);
    }
}

// Em sistemas de trading: prefetch os próximos 16 níveis do book enquanto processa o atual
```

Mas cuidado: prefetch não é grátis. Cada instrução de prefetch ocupa recursos do load buffer. Se
você prefetch coisas que não vai usar, está desperdiçando bandwidth de memória que poderia estar
servindo acessos reais.

Regra prática:
- Prefetch com `ahead = 8` a `16` elementos — esconde latência de L2/L3
- Prefetch com `ahead = 64` a `128` elementos — esconde latência de RAM
- Use `_MM_HINT_NTA` para dados que você vai ler uma vez só (streaming)
- NUNCA prefetch dentro de um `if` que raramente é verdadeiro

## NUMA Awareness: Quando Sua Máquina É Maior Que Um Socket

Em servidores com 2 ou 4 sockets, a RAM é dividida fisicamente. Cada socket tem sua própria
memória local ("próxima") e pode acessar a memória dos outros sockets ("remota"). A diferença de
latência é brutal: **80ns vs 140ns.**

NUMA-aware programming significa: se uma thread roda no socket 0, os dados que ela acessa devem
estar alocados na RAM do socket 0.

```cpp
#include <numa.h>
#include <numaif.h>

// Alocar memória vinculada a um nó NUMA específico
void* numa_alloc(size_t bytes, int node) {
    void* ptr = numa_alloc_onnode(bytes, node);
    if (!ptr) throw std::bad_alloc();
    return ptr;
}

// Migrar thread para um core específico
void pin_thread_to_core(int core_id) {
    cpu_set_t cpuset;
    CPU_ZERO(&cpuset);
    CPU_SET(core_id, &cpuset);
    pthread_setaffinity_np(pthread_self(), sizeof(cpuset), &cpuset);
}

// Setup completo: thread no core 4 (socket 0), dados alocados na RAM do socket 0
void setup_numa_aware(int numa_node, int core_on_that_node) {
    pin_thread_to_core(core_on_that_node);
    auto* buffer = static_cast<double*>(numa_alloc(1 << 20, numa_node));  // 1MB no nó certo
    // ... use buffer
    numa_free(buffer, 1 << 20);
}
```

Em sistemas de HFT, é comum alocar o order book inteiro com `numa_alloc_onnode()` e pinar as
threads de processamento para cores no mesmo socket. Isso garante que **100% dos acessos sejam
locais.** O custo de não fazer isso é pagar latência de cross-socket em cada atualização de preço.

## Como Medir Tudo Isso

Falar de cache affinity sem medir é astrologia. Ferramentas reais:

```bash
# Cache misses por processo
perf stat -e cache-references,cache-misses,L1-dcache-load-misses,LLC-load-misses ./seu_programa

# Perfil detalhado: quais linhas de código causam mais cache misses
perf record -e cache-misses ./seu_programa
perf report

# False sharing: a métrica que entrega o diagnóstico
perf stat -e l2_rqsts.all_rfo  ./seu_programa
# RFO = Request For Ownership — a CPU pedindo posse exclusiva de uma cache line
# Se esse número for alto entre threads que não compartilham dados lógicos,
# você tem false sharing. Garantido.

# Cachegrind: simulação precisa da hierarquia de cache
valgrind --tool=cachegrind --branch-sim=yes ./seu_programa
cg_annotate cachegrind.out.XXXX
```

A métrica que eu mais persigo: **ciclos por instrução (CPI).** Num sistema saudável com boa
cache affinity, CPI fica abaixo de 1.0. Se está acima de 2.0, você está passando mais tempo
esperando memória do que executando instruções.

## Resumo Prático: O Checklist da Cache Affinity

1. **Alinhe tudo a cache lines.** `alignas(64)` ou `std::hardware_destructive_interference_size`
2. **Separe dados de escrita por thread.** Cada thread deve ter ownership exclusivo de suas cache
   lines. Se duas threads escrevem na mesma cache line, você tem false sharing.
3. **Pinning de thread.** Se uma thread é dona de um conjunto de dados, deixe-a colada ao mesmo
   core. `pthread_setaffinity_np`.
4. **Pense em SoA (Struct of Arrays).** Se você itera sobre um campo específico de uma coleção,
   aquele campo deve ser contíguo na memória.
5. **NUMA matters.** Em máquinas multi-socket, aloque memória no nó onde a thread roda.
   `numa_alloc_onnode`.
6. **Prefetch com propósito.** Se você sabe o que vai acessar, avise a CPU. Mas não exagere.
7. **Meça, não suponha.** `perf stat`, cachegrind, CPI. Dados reais, não intuição.
8. **A primeira regra de performance:** os números não mentem. Se você não mediu, não otimizou.

Cache affinity não é um tópico acadêmico. É engenharia de performance que separa sistemas que
escalam de sistemas que colapsam sob carga. E a beleza é que os ganhos são enormes com mudanças
relativamente pequenas no layout de dados e política de scheduling.

Da próxima vez que seu sistema estiver lento, antes de mexer no algoritmo, pergunte: **meus dados
estão no lugar certo?**
