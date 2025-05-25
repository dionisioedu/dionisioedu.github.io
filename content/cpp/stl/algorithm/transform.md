---
title: "std::transform"
date: 2025-05-25T00:48:00-03:00
lastmod: 2025-05-25T00:48:00-03:00
description: "Detalhes sobre a função std::transform da STL."
draft: false
hide_title: true
type: "docs"
menu:
  docs:
    parent: "stl"
    weight: 20
tags: ["C++", "STL", "algoritmo", "transformação"]
---

Aplica uma operação unária ou binária a cada elemento de um intervalo `[first, last)` e armazena os resultados em um intervalo de saída.
- **Cabeçalho**: `<algorithm>`
- **Assinatura**:
```cpp
transform(InputIt first, InputIt last, OutputIt result, UnaryOperation op);
transform(InputIt1 first1, InputIt1 last1, InputIt2 first2, OutputIt result, BinaryOperation op);
```
- **Parâmetros**:
  - **first, last** - Iteradores que definem o intervalo de entrada para a versão unária.
  - **first1, last1** - Iteradores que definem o primeiro intervalo de entrada para a versão binária.
  - **first2** - Iterador para o início do segundo intervalo de entrada (versão binária).
  - **result** - Iterador para o início do intervalo de saída.
  - **op** - Operação unária ou binária a ser aplicada aos elementos.
- **Retorno**: Iterador para o fim do intervalo de saída.
- **Exceções**: Depende da operação op fornecida; a própria transform não lança exceções, a menos que op o faça.
- **Versão**: `C++98`
- **Performance**: O(N), onde N é o número de elementos no intervalo.
- **Exemplo**:
```cpp
#include <algorithm>
#include <vector>
#include <iostream>
int main() {
    // Versão unária
    std::vector<int> vec = {1, 2, 3, 4};
    std::vector<int> result(4);
    std::transform(vec.begin(), vec.end(), result.begin(), [](int x) { return x * 2; });
    for (int x : result) std::cout << x << " "; // Imprime: 2 4 6 8

    // Versão binária
    std::vector<int> vec2 = {10, 20, 30, 40};
    std::transform(vec.begin(), vec.end(), vec2.begin(), result.begin(), std::plus<int>{});
    for (int x : result) std::cout << x << " "; // Imprime: 11 22 33 44
    return 0;
}
```
