---
title: "std::partition"
date: 2025-05-25T01:28:00-03:00
lastmod: 2025-05-25T01:28:00-03:00
description: "Detalhes sobre a função std::partition da STL."
draft: false
hide_title: true
type: "docs"
menu:
  docs:
    parent: "stl"
    weight: 20
tags: ["C++", "STL", "algoritmo", "particionamento"]
---

Particiona um intervalo `[first, last)` de modo que os elementos que satisfazem um predicado fiquem antes dos que não satisfazem.
- **Cabeçalho**: `<algorithm>`
- **Assinatura**:
```cpp
partition(BidirectionalIt first, BidirectionalIt last, UnaryPredicate pred);
```
- **Parâmetros**:
  - **first**, **last** - Iteradores que definem o intervalo.
  - **pred** - Predicado unário que retorna true para elementos que devem ficar na primeira partição.
- **Retorno**: Iterador para o início da segunda partição (os elementos que não satisfazem o predicado).
- **Exceções**: Depende do predicado pred; a função em si não lança, a menos que pred o faça.
- **Versão**: `C++98`
- **Performance**: O(N), onde N é o número de elementos no intervalo.
- **Exemplo**:
```cpp
#include <algorithm>
#include <vector>
#include <iostream>
int main() {
    std::vector<int> vec = {1, 2, 3, 4, 5};
    auto it = std::partition(vec.begin(), vec.end(), [](int x) { return x % 2 == 0; });
    for (int x : vec) std::cout << x << " "; // Exemplo de saída: 2 4 3 1 5
    std::cout << "\nPonto de partição: " << *it << '\n'; // Pode imprimir: 3
    return 0;
}
```
