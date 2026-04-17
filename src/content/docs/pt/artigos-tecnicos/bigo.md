---
title: Anatomia da Notação Big-O - Entenda Complexidade de Algoritmos
description: Guia completo sobre Big-O notation, complexidade de algoritmos e análise de performance
publishedAt: 2026-02-25
author: Dionisio
tags:
  - Algoritmos
  - Performance
  - Estruturas de Dados
cover: /assets/images/big-o-graph.png
coverAlt: Gráfico usado para ilustrar complexidade de algoritmos e notação Big-O
--- 

**Visão Rápida:** — A notação Big-O é uma forma de medir quanto tempo e memória seu código pode consumir à medida que a entrada cresce. **Dominar Big-O é saber identificar padrões de custo para tomar decisões informadas.**

## Por que Big-O importa?

- **Escalabilidade previsível** — evita surpresas quando `n` passa de 1k para 10M
- **Linguagem comum** — candidatos e entrevistadores discutem soluções usando Big-O
- **Comparação objetiva** — decide rapidamente qual implementação vale manter e otimizar

## A Trindade Assintótica

| Notação | Significado | Caso |
|---------|-----------|------|
| **Ω (Big Omega)** | Limite inferior | Melhor caso |
| **Θ (Big Theta)** | Limite inferior e superior | Caso médio |
| **O (Big O)** | Limite superior | Pior caso |

**Regra de ouro**: Use Big-O para garantir que seu algoritmo **nunca excede** determinado custo.

## Casos de Complexidade

- **Pior caso (Big O)** — entrada que provoca máximo de trabalho
- **Caso médio (Θ)** — desempenho típico para entradas aleatórias
- **Melhor caso (Ω)** — raramente decisivo, mas serve de garantia mínima

## Como Calcular Big-O Passo a Passo

### 1. Mapeie as variáveis de entrada

Identifique tudo o que pode crescer: `n` (tamanho do vetor), `m` (número de arestas), `k` (profundidade da árvore) – elas vão aparecer nas contas.

### 2. Marque as operações-chave

Conte comparações, atribuições, leituras de memória e chamadas de função que realmente impactam desempenho. Comentários e variáveis auxiliares sem custo assintótico podem ser ignorados.

### 3. Avalie blocos lineares

Se dois trechos rodam um após o outro, soma-se o custo:

```
O(n)   // loop A
O(n²)  // loop B
───────
O(n²)  // resultado: dominante é n²
```

### 4. Inclua condicionais no pior caso

Para `if/else`, some apenas o caminho mais caro:

```python
if encontrado:        # O(1)
    return
else:                 # O(n)
    busca_linear()

# Big-O = O(n)
```

### 5. Multiplique loops aninhados

Cada loop interno se multiplica pelo externo:

```python
for i in range(n):        # n
    for j in range(m):    # m
        operacao()        # 1
# → O(n · m)
```

### 6. Trate recursão como recorrência

Escreva a equação e resolva via:
- Árvore de recursão
- Teorema Mestre
- Substituição

### 7. Normalização & descarte de detalhes

Remova constantes e termos menores:

```
3n + 7    → O(n)
n/2       → O(n)
log₂(n)   → O(log n)    // base não importa
```

### 8. Documente complexidade de espaço

Analise variáveis alocadas, pilha de recursão e buffers.

Ex.: Merge Sort usa `O(n)` extra; Quick Sort in-place usa `O(log n)` de pilha.

### 9. Cheque gargalos de I/O

Operações de disco/rede podem dominar o tempo de CPU – use Big-O para CPU e para I/O quando necessário.

### 10. Valide com experimento rápido

Use `time`, `perf` ou `cProfile` para confirmar que o comportamento real segue a análise assintótica.

## Mini-Exemplo Completo

```python
def foo(arr):
    n = len(arr)              # O(1)
    total = 0                 # O(1)

    # Loop externo               => n
    for i in range(n):
        total += arr[i]        # O(1)

        # Loop interno dependente => i
        for j in range(i):     
            total += arr[j]    # O(1)

    return total
```

**Receita:**

1. Loops aninhados → soma de série 1 + 2 + … + (n-1) = `n(n-1)/2` → **O(n²)**
2. Constantes ignoradas → **O(n²)** tempo, **O(1)** espaço

**Dica prática:** Ao revisar código, escreva o Big-O no comentário de cada bloco. Isso treina o olhar e facilita code-review de colegas iniciantes.

## Tabela de Complexidade de Estruturas

| Estrutura | Inserção | Busca | Deletion | Notas |
|-----------|----------|-------|----------|-------|
| Array estático | O(n) | O(n) | O(n) | Remoção desloca elementos |
| Array dinâmico | Amort. O(1) | O(n) | O(1) | Realoca ao dobrar capacidade |
| Lista ligada | O(1) | O(1) | O(n) | Sem acesso aleatório |
| Pilha | O(1) | — | O(1) | LIFO |
| Fila | O(1) | — | O(1) | FIFO |
| Hash table | O(1)¹ | O(1)¹ | O(1)¹ | ¹Média; colisões → O(n) |
| Árvore AVL/RB | O(log n) | O(log n) | O(log n) | Balanceada |
| Heap | O(log n) | O(1) topo | O(log n) | Fila de prioridade |
| Trie | O(L) | O(L) | O(L) | L = tamanho da chave |

## Exemplos Comentados

### O(1) - Constante

```python
def primeiro_elemento(arr):
    return arr[0]  # sempre executa em tempo fixo
```

### O(n) - Linear

```python
def buscar_elemento(arr, x):
    for i in range(len(arr)):
        if arr[i] == x:
            return i
    return -1
# Executa uma comparação por elemento → cresce linearmente
```

### O(log n) - Logarítmica

```python
def busca_binaria(arr, x):
    esq, dir = 0, len(arr) - 1
    while esq <= dir:
        meio = (esq + dir) // 2
        if arr[meio] == x:
            return meio
        esq, dir = (meio + 1, dir) if arr[meio] < x else (esq, meio - 1)
    return -1
# Cada passo descarta metade da entrada → curva logarítmica
```

### O(n²) - Quadrática

```python
for i in range(n):
    for j in range(n):
        processar(i, j)  # n × n chamadas
# Segundo loop roda n vezes para cada volta do primeiro
```

### O(n³) - Cúbica

```python
def multiplicar_matrizes(A, B, C, N):
    for i in range(N):
        for j in range(N):
            C[i][j] = 0
            for k in range(N):
                C[i][j] += A[i][k] * B[k][j]
# Três loops aninhados → N³ operações
```

### O(2ⁿ) - Exponencial

```python
def gerar_subconjuntos(arr):
    n = len(arr)
    for mask in range(1 << n):  # 2^n máscaras
        for j in range(n):
            if mask & (1 << j):
                print(arr[j])
# Há 2^n máscaras possíveis → tempo dobra a cada elemento
```

### O(n!) - Fatorial

```python
def permutacoes(a, l, r):
    if l == r:
        print(a)
        return
    for i in range(l, r + 1):
        swap(a, l, i)
        permutacoes(a, l + 1, r)  # n! permutações
        swap(a, l, i)
# Número de permutações é n! → explode rapidamente
```

## Gráfico de Complexidade

Observe como O(n!) explode comparado a O(n log n) — fundamental para escolhas arquiteturais.

Tamanho da entrada aumentando:
- **O(1)** — linha horizontal (ideal)
- **O(log n)** — cresce lentamente
- **O(n)** — cresce linearmente
- **O(n log n)** — cresce entre linear e quadrática
- **O(n²)** — cresce rapidamente
- **O(2ⁿ)** — explode
- **O(n!)** — apocalipse

## Espaço vs. Tempo

Big-O também mede memória.

- **Merge Sort**: `O(n log n)` tempo, `O(n)` espaço
- **Heap Sort**: `O(n log n)` tempo, `O(1)` espaço — troca mais comparação por menos RAM

## Armadilhas Frequentes

| Armadilha | Problema | Solução |
|-----------|----------|---------|
| Fibonacci recursivo | O(2ⁿ) | Memorizar → O(n) |
| vector::insert | Achar que é O(1) | Desloca elementos → O(n) |
| Hash sem tratamento | Supor O(1) sempre | Use chaining ou open addressing |

## Master Theorem Express

Para recursões da forma `T(n) = a T(n/b) + f(n)`:

| Caso | Condição | Resultado |
|------|----------|-----------|
| 1 | f(n) assintoticamente menor | Θ(n^{log_b a}) |
| 2 | f(n) igual | Θ(n^{log_b a} · log n) |
| 3 | f(n) maior | Θ(f(n)) |

**Takeaway**: Algoritmos acima de `O(n log n)` já podem se tornar gargalos em escala. Use esta lista como checklist mental na hora de propor soluções ou revisar PRs.

## Tabela Rápida

| O(1) | Constante | Acesso a arr[i] |
| O(n) | Linear | Procurar em array |
| O(log n) | Logarítmica | Binary Search |
| O(n log n) | Quasi-linear | Merge Sort |
| O(n²) | Quadrática | Bubble Sort, loops duplos |
| O(n³) | Cúbica | Multiplicação (ingênua) |
| O(2ⁿ) | Exponencial | Subconjuntos |
| O(n!) | Fatorial | Permutações |

## Exercício Guiado

**Objetivo**: Converter um algoritmo ingênuo `O(n²)` em `O(n)`.

### Passo 1 — Código inicial

```python
def contar_pares(arr):
    count = 0
    for i in range(len(arr)):
        for j in range(i + 1, len(arr)):
            if arr[i] == arr[j]:
                count += 1
    return count
```

### Passo 2 — Diagnóstico

Dois loops aninhados → quadrático. ❌

### Passo 3 — Otimização com Hash

```python
from collections import Counter

def contar_pares(arr):
    freq = Counter(arr)  # O(n)
    return sum(c * (c - 1) // 2 for c in freq.values())  # O(k)
```

Agora o algoritmo roda em **O(n)** tempo e **O(k)** espaço. ✅

## Mini-FAQ

**Q: Por que ignoramos constantes?**
A: Porque em escala grande, fatores proporcionais são irrelevantes frente ao crescimento assintótico.

**Q: Big-O mede tempo de qual operação?**
A: Qualquer métrica de custo: CPU, memória, I/O. Especifique qual está analisando.

**Q: Preciso decorar todas as classes?**
A: Não. Entenda o estilo de curva: constante, log, linear, quadrática, exponencial.

## Checklist de Entrevista

Quando apresentar uma solução:

1. Qual o **pior caso**?
2. Há estimativa realista do **caso médio**?
3. **Complexidade de espaço**?
4. **Estrutura de dados alternativa**?
5. Pode **paralelizar**?
6. **Trade-off tempo × memória** aceitável?

## Conclusão

A notação Big-O é a régua que ajuda a identificar gargalos antes que eles explodam em produção. 

Com um olhar crítico e prática constante, você passará a reconhecer padrões complexos à primeira vista — e otimizar à segunda.

**Desafio Final**: Pegue um script seu de ontem, estime Big-O, depois meça com `time`. Quanto as estimativas batem com a realidade?
