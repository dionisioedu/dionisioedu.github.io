---
title: "std::copy"
date: 2025-05-25T01:24:00-03:00
lastmod: 2025-05-25T01:24:00-03:00
description: "Detalhes sobre a função std::copy da STL."
draft: false
hide_title: true
type: "docs"
menu:
  docs:
    parent: "stl"
    weight: 20
tags: ["C++", "STL", "algoritmo", "cópia"]
---

Copia elementos de um intervalo `[first, last)` para outro intervalo começando em result.
- **Cabeçalho**: `<algorithm>`
- **Assinatura**:
```cpp
copy(InputIt first, InputIt last, OutputIt result);
```
- **Parâmetros**:
  - **first**, **last** - Iteradores que definem o intervalo de entrada.
  - **result** - Iterador para o início do intervalo de saída.
- **Retorno**: Iterador para o fim do intervalo de saída.
- **Exceções**: Nenhuma, a menos que operações de cópia lancem.
- **Versão**: `C++98`
- **Performance**: O(N), onde N é o número de elementos no intervalo.
- **Exemplo**:
```cpp
#include <algorithm>
#include <vector>
#include <iostream>
int main() {
    std::vector<int> src = {1, 2, 3};
    std::vector<int> dst(3);
    auto it = std::copy(src.begin(), src.end(), dst.begin());
    for (auto i = dst.begin(); i != it; ++i) std::cout << *i << " "; // Imprime: 1 2 3
    return 0;
}
```
