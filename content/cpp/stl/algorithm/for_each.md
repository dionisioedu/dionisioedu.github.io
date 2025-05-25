---
title: "std::for_each"
date: 2025-05-24T23:04:00-03:00
lastmod: 2025-05-24T23:04:00-03:00
description: "Detalhes sobre a função std::for_each da STL."
draft: false
hide_title: true
type: "docs"
menu:
  docs:
    parent: "stl"
    weight: 20
tags: ["C++", "STL", "algoritmo", "iteração"]
---

Aplica uma função a cada elemento em um intervalo `[first, last)`.
- **Cabeçalho**: `<algorithm>`
- **Assinatura**:
```cpp
for_each(InputIt first, InputIt last, Function fn);
```
- **Parâmetros**:
  - **first, last** - Iteradores que definem o intervalo de elementos a serem processados.
  - **fn** - Função unária a ser aplicada a cada elemento do intervalo.
- **Retorno**: A função fn (a partir de C++20) ou void (antes de C++20).
- **Exceções**: Depende da função fn fornecida; a própria for_each não lança exceções, a menos que fn o faça.
- **Versão**: `C++98`
- **Performance**: O(N), onde N é o número de elementos no intervalo.
- **Exemplo**:
```cpp
#include <algorithm>
#include <vector>
#include <iostream>
int main() {
    std::vector<int> vec = {1, 2, 3, 4};
    std::for_each(vec.begin(), vec.end(), [](int x) { std::cout << x << " "; }); // Imprime: 1 2 3 4
    return 0;
}
```
