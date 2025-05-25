---
title: "std::find_if"
date: 2025-05-25T01:07:00-03:00
lastmod: 2025-05-25T01:07:00-03:00
description: "Detalhes sobre a função std::find_if da STL."
draft: false
hide_title: true
type: "docs"
menu:
  docs:
    parent: "stl"
    weight: 20
tags: ["C++", "STL", "algoritmo", "busca"]
---

Busca o primeiro elemento em um intervalo `[first, last)` que satisfaz um predicado especificado.
- **Cabeçalho**: `<algorithm>`
- **Assinatura**:
```cpp
find_if(InputIt first, InputIt last, UnaryPredicate pred);
```
- **Parâmetros**:
  - **first, last** - Iteradores que definem o intervalo de busca.
  - **pred** - Predicado unário que retorna true para o elemento desejado.
- **Retorno**: Iterador para o primeiro elemento que satisfaz pred ou last se não encontrado.
- **Exceções**: Nenhuma, a menos que o predicado pred lance.
- **Versão**: `C++98`
- **Performance**: O(N), onde N é o número de elementos no intervalo.
- **Exemplo**:
```cpp
#include <algorithm>
#include <vector>
#include <iostream>
int main() {
    std::vector<int> vec = {1, 3, 4, 6};
    auto it = std::find_if(vec.begin(), vec.end(), [](int x) { return x % 2 == 0; }); // Busca o primeiro número par
    if (it != vec.end()) std::cout << *it << '\n'; // Imprime: 4
    return 0;
}
```
