---
title: "std::replace"
date: 2025-05-25T01:27:00-03:00
lastmod: 2025-05-25T01:27:00-03:00
description: "Detalhes sobre a função std::replace da STL."
draft: false
hide_title: true
type: "docs"
menu:
  docs:
    parent: "stl"
    weight: 20
tags: ["C++", "STL", "algoritmo", "substituição"]
---

Substitui todos os elementos iguais a um valor específico por outro valor em um intervalo `[first, last)`.
- **Cabeçalho**: `<algorithm>`
- **Assinatura**:
```cpp
replace(ForwardIt first, ForwardIt last, const T& old_value, const T& new_value);
```
- **Parâmetros**:
  - **first**, **last** - Iteradores que definem o intervalo.
  - **old_value** - Valor a ser substituído.
  - **new_value** - Valor a ser atribuído no lugar.
- **Retorno**: Nenhum (void).
- **Exceções**: Nenhuma, a menos que operações de atribuição lancem.
- **Versão**: `C++98`
- **Performance**: O(N), onde N é o número de elementos no intervalo.
- **Exemplo**:
```cpp
#include <algorithm>
#include <vector>
#include <iostream>
int main() {
    std::vector<int> vec = {1, 2, 2, 3, 2};
    std::replace(vec.begin(), vec.end(), 2, 5);
    for (int x : vec) std::cout << x << " "; // Imprime: 1 5 5 3 5
    return 0;
}
```
