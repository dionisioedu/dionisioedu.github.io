---
title: "std::sort"
date: 2025-05-24T23:04:00-03:00
lastmod: 2025-05-24T23:04:00-03:00
description: "Detalhes sobre a função std::sort da STL."
draft: false
type: "docs"
menu:
  docs:
    parent: "stl"
    weight: 20
tags: ["C++", "STL", "algoritmo", "ordenação"]
---

Ordena os elementos no intervalo `[first, last)` usando o operador `<` ou uma função de comparação personalizada. Utiliza introsort, uma combinação de quicksort, heapsort e insertion sort para garantir eficiência.

- **Cabeçalho**: `<algorithm>`
- **Assinatura**:
```cpp
sort(RandomIt first, RandomIt last);
sort(RandomIt first, RandomIt last, Compare comp);
```
- **Parâmetros**:
  - **first**, **last** - Iteradores que definem o intervalo a ser ordenado.
  - **comp** - Função de comparação que retorna true se o primeiro elemento for menor que o segundo.
- **Retorno**: Nenhum (void).
- **Exceções**: Pode lançar exceções de cópia, movimentação ou da função de comparação.
- **Versão**: `C++98`
- **Performance**: O(N log N)
- **Exemplo**:
```cpp
#include <vector>
#include <algorithm>
int main() {
    std::vector<int> vec = {5, 2, 9, 1, 5};
    std::sort(vec.begin(), vec.end()); // Ordena: {1, 2, 5, 5, 9}

    auto comp = [](int a, int b) { return a > b; };
    std::sort(vec.begin(), vec.end(), comp); // Ordem decrescente: {9, 5, 5, 2, 1}
    return 0;
}
```
