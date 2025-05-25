---
title: "std::fill"
date: 2025-05-25T01:26:00-03:00
lastmod: 2025-05-25T01:26:00-03:00
description: "Detalhes sobre a função std::fill da STL."
draft: false
hide_title: true
type: "docs"
menu:
  docs:
    parent: "stl"
    weight: 20
tags: ["C++", "STL", "algoritmo", "preenchimento"]
---

Preenche um intervalo `[first, last)` com um valor específico.
- **Cabeçalho**: `<algorithm>`
- **Assinatura**:
```cpp
fill(ForwardIt first, ForwardIt last, const T& value);
```
- **Parâmetros**:
  - **first**, **last** - Iteradores que definem o intervalo a ser preenchido.
  - **value** - Valor a ser atribuído aos elementos.
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
    std::vector<int> vec(5);
    std::fill(vec.begin(), vec.end(), 42);
    for (int x : vec) std::cout << x << " "; // Imprime: 42 42 42 42 42
    return 0;
}
```
