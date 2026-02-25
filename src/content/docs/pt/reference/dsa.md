---
title: Estruturas de Dados e Algoritmos
description: 'Índice abrangente, com profundidade e exemplos, para dominar DSA do zero ao avançado.'
---

> **Por que guardar este link?**  
> Ele condensa anos de conteúdo espalhado em livros, blogs e fóruns em **um índice vivo**. Cada item será (ou já é) uma página dedicada com código, GIFs, benchmarks e desafios. Compartilhe no seu grupo — e volte sempre que precisar de referência rápida.

---

# Sumário
1. [Panorama Geral](#panorama-geral)  
2. [Estruturas de Dados — Visão Detalhada](#estruturas-de-dados)  
3. [Algoritmos Essenciais — Visão Detalhada](#algoritmos-essenciais)  
4. [Mapas Mentais & Analogias](#mapas-mentais)  
5. [Caminho de Aprendizado de 12 Semanas](#plano-12-semanas)  
6. [Padrões de Entrevista](#padrões-de-entrevista)  
7. [Estudos de Caso Reais](#cases)  
8. [Ferramentas & Bibliografia](#recursos)  
9. [FAQ Rápido](#faq)  

---

## <a name="panorama-geral"></a>1 · Panorama Geral

O universo de DSA pode ser dividido em **4 eixos**:

| Eixo | Pergunta que responde | Exemplo rápido |
|------|----------------------|----------------|
| **Estrutura de Dados** | _Como armazeno a informação?_ | Hash → chave→valor rápido |
| **Algoritmo** | _Como transformo a informação?_ | Dijkstra → menor caminho |
| **Paradigma** | _Qual estratégia geral?_ | Dividir & Conquistar, DP |
| **Complexidade** | _Quanto custa a operação?_ | O(n), O(n log n), etc |


## <a name="estruturas-de-dados"></a>2 · Estruturas de Dados — Visão Detalhada

### 2.1 Lineares Clássicas

| Estrutura | Operações principais | Quando NÃO usar |
|-----------|---------------------|-----------------|
| **Array** | Acesso aleatório **O(1)** | Inserir no meio frequentemente |
| **Vector/ArrayList** | Inserção amortizada **O(1)** | Tamanho explode além da RAM |
| **Lista Ligada** | Inserção O(1) na cabeça | Precisa de busca aleatória |

#### Dica prática  
> Arrays aproveitam cache de CPU muito melhor que listas ligadas — para **loops intensos**, escolha array mesmo que inserções sejam um pouco mais caras.

### 2.2 Estruturas de Auxílio

| Estrutura | Conceito | Uso moderno |
|-----------|----------|-------------|
| **Stack** | LIFO | Desfazer Ctrl+Z, parsing de expressões |
| **Queue** | FIFO | Fila de tarefas, BFS |
| **Deque** | Fila dupla | Algoritmo de janela máxima |

### 2.3 Árvores & Derivados

| Estrutura | Altura | Vantagem distintiva |
|-----------|--------|---------------------|
| **AVL** | balanceada | Rotinas de insert/delete determinísticas |
| **Red‑Black** | balanceada | Implementação simples na STL/Java | 
| **B‑Tree** | baixa (ordem m) | Índices de disco, bancos de dados |
| **Segment Tree** | log n | Range queries com updates |
| **Fenwick (BIT)** | log n | Implementação concisa de prefix sum |

### 2.4 Estruturas de Grafos

* **Adjacency List** — memória **O(V+E)**, ideal para grafos esparsos.  
* **Adjacency Matrix** — acesso **O(1)**, pesado em memória **O(V²)**.  

### 2.5 Estruturas Probabilísticas

| Estrutura | Tamanho | Falso positivo | Aplicação |
|-----------|---------|----------------|-----------|
| **Bloom Filter** | muito pequeno | sim | Filtro de cache, anti‑spam |
| **Count‑Min Sketch** | pequeno | aproximação | Detector de trending topics |


## <a name="algoritmos-essenciais"></a>3 · Algoritmos Essenciais — Visão Detalhada

### 3.1 Ordenação (Sorting)

| Algoritmo | Estável? | Pior caso | Espaço |
|-----------|----------|-----------|--------|
| **Merge** | Sim | O(n log n) | O(n) |
| **Quick** | Não | O(n²) | O(log n) |
| **Heap** | Não | O(n log n) | O(1) |
| **Counting/Radix** | Sim | O(n+k) | O(n+k) |

### 3.2 Pesquisa & Seleção

| Algoritmo | Caso de uso | Complexidade |
|-----------|-------------|--------------|
| **Binary Search** | Procurar valor em array ordenado | O(log n) |
| **QuickSelect** | k‑ésimo menor | O(n) médio |

### 3.3 Grafos

| Algoritmo | Tipo de grafo | Nota |
|-----------|---------------|------|
| **BFS** | não ponderado | Caminho mínimo em níveis |
| **DFS** | geral | Detectar ciclos, topologia |
| **Dijkstra** | pesos positivos | Fila de prioridade |
| **A*** | heurístico | Jogos 2D/3D |
| **Kruskal** | MST | Union‑Find |

### 3.4 Programação Dinâmica

| Problema | Abordagem | Complexidade |
|----------|-----------|--------------|
| **Knapsack** | Tabela DP | O(n W) espaço otimizado p/ O(W) |
| **Longest Common Subsequence** | Matriz DP | O(n m) |
| **Edit Distance** | DP | O(n m) |

### 3.5 Strings

| Algoritmo | O quê faz | Complexidade |
|-----------|-----------|--------------|
| **KMP** | Busca substring | O(n+m) |
| **Trie** | Busca prefixo | O(L) |
| **Suffix Array + LCP** | Múltiplas consultas | O(n log n) build |


## <a name="mapas-mentais"></a>4 · Mapas Mentais & Analogias

* Array = **prédios numerados** em rua reta.  
* Lista ligada = **caça‑tesouro**: cada pista aponta para próxima.  
* Árvore = **pastas do computador**.  
* Heap = **fila VIP** onde o menor ou maior sai primeiro.  
* Trie = **dicionário por prefixo**: cor‑, cora‑, coração.

Experimente desenhar essas analogias para fixar!


## <a name="plano-12-semanas"></a>5 · Caminho de Aprendizado (12 Semanas)

| Semana | Tema | Entregável | Problema "Boss" |
|--------|------|-----------|-----------------|
| 1‑2 | Arrays & Hashes | CRUD simples | "Two Sum" |
| 3‑4 | Stack, Queue, Deque | LRU Cache | "Sliding Window Max" |
| 5‑6 | Árvores BST & Heap | Priority Queue | "Kth Largest in Stream" |
| 7‑8 | Grafos | BFS/DFS | "Course Schedule" |
| 9‑10 | DP | Tabulação vs memo | "Word Break" |
| 11 | Strings | KMP, Trie | "Implement Trie" |
| 12 | Revisão & Contest | Codeforces Div 4 | 2 h simuladas |


## <a name="padrões-de-entrevista"></a>6 · Padrões de Entrevista

1. **Two Pointers** — remoção duplicados, reverso string.  
2. **Sliding Window** — substring sem repetir caracteres.  
3. **Fast & Slow Pointers** — detectar ciclo em lista.  
4. **Merge Intervals** — calendários, reservas.  
5. **Top K** — heap ou QuickSelect.

> Resolva **2 problemas de cada padrão** para internalizar.


## <a name="cases"></a>7 · Estudos de Caso Reais

| Empresa | Desafio | Solução DSA |
|---------|---------|-------------|
| Netflix | Recomendação em escala | Trie + grafos de similaridade |
| Uber | Matching motorista‑passageiro | Heap + Dijkstra em mapa | 
| Google Maps | Rotas em tempo real | A* + heurística Haversine |
| Instagram | Feed ordenado | Merge múltiplas filas de prioridade |


## <a name="recursos"></a>8 · Ferramentas & Bibliografia

* **VisuAlgo** — animações interativas.  
* **AlgoExpert / NeetCode** — playlists focadas.  
* **Livros**: *CLRS*, *Grokking Algorithms*, *Algorithm Design Manual*.  
* **Perf Tools**: `hyperfine` (benchmarks), `perf`, `gprof`.


## <a name="faq"></a>9 · FAQ Rápido

| Pergunta | Resposta curta |
|----------|----------------|
| Preciso decorar todos os algoritmos? | Não, aprenda **padrões**. |
| Qual linguagem usar em entrevistas? | A que você digita sem pensar — Python é aceito na maioria. |
| Quanto tempo para dominar DSA? | Com 1 h/dia, 3‑6 meses para ficar confortável. |
| Big‑O é tudo? | Importante, mas **cache, paralelismo, I/O** também contam em produção. |
