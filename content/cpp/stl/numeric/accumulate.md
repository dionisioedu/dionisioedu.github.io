---
title: "std::accumulate"
date: 2025-05-25T01:35:00-03:00
lastmod: 2025-05-25T01:35:00-03:00
description: "Detalhes sobre a função std::accumulate da STL."
draft: false
hide_title: true
type: "docs"
menu:
  docs:
    parent: "stl"
    weight: 20
tags: ["C++", "STL", "numérico", "acumulação"]
---

Acumula os valores de um intervalo `[first, last)` a partir de um valor inicial, aplicando uma operação binária.
- **Cabeçalho**: `<numeric>`
- **Assinatura**:
```cpp
accumulate(InputIt first, InputIt last, T init);
accumulate(InputIt first, InputIt last, T init, BinaryOperation op);
```
- **Parâmetros**:
  - **first**, **last** - Iteradores que definem o intervalo `[first, last)` de entrada.
  - **init** - Valor inicial da acumulação.
  - **op** - Operação binária a ser aplicada (padrão: std::plus).
- **Retorno**: Resultado da acumulação.
- **Exceções**: Depende da operação op; a função em si não lança, a menos que op o faça.
- **Versão**: `C++98`
- **Performance**: O(N), onde N é o número de elementos no intervalo.
- **Exemplo**:
```cpp
#include <numeric>
#include <vector>
#include <iostream>
int main() {
    std::vector<int> vec = {1, 2, 3, 4};
    int sum = std::accumulate(vec.begin(), vec.end(), 0); // Soma: 0 + 1 + 2 + 3 + 4
    std::cout << sum << '\n'; // Imprime: 10
    int product = std::accumulate(vec.begin(), vec.end(), 1, std::multiplies<int>{}); // Produto: 1 * 1 * 2 * 3 * 4
    std::cout << product << '\n'; // Imprime: 24
    return 0;
}
```