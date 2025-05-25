---
title: "std::adjacent_difference"
date: 2025-05-25T01:38:00-03:00
lastmod: 2025-05-25T01:38:00-03:00
description: "Detalhes sobre a função std::adjacent_difference da STL."
draft: false
hide_title: true
type: "docs"
menu:
  docs:
    parent: "stl"
    weight: 20
tags: ["C++", "STL", "numérico", "diferença"]
---

Calcula a diferença entre elementos adjacentes em um intervalo `[first, last)` e armazena os resultados em um intervalo de saída começando em result.
- **Cabeçalho**: `<numeric>`
- **Assinatura**:
```cpp
adjacent_difference(InputIt first, InputIt last, OutputIt result);
adjacent_difference(InputIt first, InputIt last, OutputIt result, BinaryOperation op);
```
- **Parâmetros**:
  - **first**, **last** - Iteradores que definem o intervalo `[first, last)` de entrada.
  - **result** - Iterador para o início do intervalo de saída.
  - **op** - Operação binária para calcular a diferença (padrão: subtração).
- **Retorno**: Iterador para o fim do intervalo de saída.
- **Exceções**: Depende da operação op; a função em si não lança, a menos que op o faça.
- **Versão**: `C++98`
- **Performance**: O(N), onde N é o número de elementos no intervalo.
- **Exemplo**:
```cpp
#include <numeric>
#include <vector>
#include <iostream>
int main() {
    std::vector<int> vec = {1, 4, 6, 8};
    std::vector<int> result(4);
    auto it = std::adjacent_difference(vec.begin(), vec.end(), result.begin());
    for (auto i = result.begin(); i != it; ++i) std::cout << *i << " "; // Imprime: 1 3 2 2
    return 0;
}
```