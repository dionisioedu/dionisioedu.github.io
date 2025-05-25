---
title: "std::stable_partition"
date: 2025-05-25T01:29:00-03:00
lastmod: 2025-05-25T01:29:00-03:00
description: "Detalhes sobre a função std::stable_partition da STL."
draft: false
hide_title: true
type: "docs"
menu:
  docs:
    parent: "stl"
    weight: 20
tags: ["C++", "STL", "algoritmo", "particionamento"]
---

Particiona um intervalo `[first, last)` de modo que os elementos que satisfazem um predicado fiquem antes dos que não satisfazem, mantendo a ordem relativa dentro de cada partição.
- **Cabeçalho**: `<algorithm>`
- **Assinatura**:
```cpp
stable_partition(BidirectionalIt first, BidirectionalIt last, UnaryPredicate pred);
```
- **Parâmetros**:
  - **first**, **last** - Iteradores que definem o intervalo.
  - **pred** - Predicado unário que retorna true para elementos que devem ficar na primeira partição.
- **Retorno**: Iterador para o início da segunda partição (os elementos que não satisfazem o predicado).
- **Exceções**: Depende do predicado pred; a função em si não lança, a menos que pred o faça.
- **Versão**: `C++98`
- **Performance**: O(N log N) com memória extra, O(N) sem memória extra, onde N é o número de elementos no intervalo.
- **Exemplo**:
```cpp
#include <algorithm>
#include <vector>
#include <iostream>
int main() {
    std::vector<int> vec = {1, 2, 3, 4, 5};
    auto it = std::stable_partition(vec.begin(), vec.end(), [](int x) { return x % 2 == 0; });
    for (int x : vec) std::cout << x << " "; // Imprime: 2 4 1 3 5
    std::cout << "\nPonto de partição: " << *it << '\n'; // Imprime: 1
    return 0;
}
```
