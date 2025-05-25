---
title: "std::iota"
date: 2025-05-25T01:36:00-03:00
lastmod: 2025-05-25T01:36:00-03:00
description: "Detalhes sobre a função std::iota da STL."
draft: false
hide_title: true
type: "docs"
menu:
  docs:
    parent: "numeric"
    weight: 20
tags: ["C++", "STL", "numérico", "preenchimento"]
---

Preenche um intervalo `[first, last)` com valores incrementais a partir de um valor inicial, usando o operador ++.
- **Cabeçalho**: `<numeric>`
- **Assinatura**:
```cpp
iota(ForwardIt first, ForwardIt last, T value);
```
- **Parâmetros**:
  - **first**, **last** - Iteradores que definem o intervalo `[first, last)` a ser preenchido.
  - **value** - Valor inicial a ser atribuído ao primeiro elemento.
- **Retorno**: Nenhum (void).
- **Exceções**: Nenhuma, a menos que operações de atribuição ou incremento lancem.
- **Versão**: `C++11`
- **Performance**: O(N), onde N é o número de elementos no intervalo.
- **Exemplo**:
```cpp
#include <numeric>
#include <vector>
#include <iostream>
int main() {
    std::vector<int> vec(5);
    std::iota(vec.begin(), vec.end(), 1); // Preenche com 1, 2, 3, 4, 5
    for (int x : vec) std::cout << x << " "; // Imprime: 1 2 3 4 5
    return 0;
}
```
