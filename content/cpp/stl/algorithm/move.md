---
title: "std::move (algoritmo)"
date: 2025-05-25T01:25:00-03:00
lastmod: 2025-05-25T01:25:00-03:00
description: "Detalhes sobre a função std::move (algoritmo) da STL."
draft: false
hide_title: true
type: "docs"
menu:
  docs:
    parent: "stl"
    weight: 20
tags: ["C++", "STL", "algoritmo", "movimentação"]
---

Move elementos de um intervalo `[first, last)` para outro intervalo começando em result, transferindo a posse dos elementos.
- **Cabeçalho**: `<algorithm>`
- **Assinatura**:
```cpp
move(InputIt first, InputIt last, OutputIt result);
```
- **Parâmetros**:
  - **first**, **last** - Iteradores que definem o intervalo de entrada.
  - **result** - Iterador para o início do intervalo de saída.
- **Retorno**: Iterador para o fim do intervalo de saída.
- **Exceções**: Nenhuma, a menos que operações de movimentação lancem.
- **Versão**: `C++11`
- **Performance**: O(N), onde N é o número de elementos no intervalo.
- **Exemplo**:
```cpp
#include <algorithm>
#include <vector>
#include <string>
#include <iostream>
int main() {
    std::vector<std::string> src = {"a", "b", "c"};
    std::vector<std::string> dst(3);
    auto it = std::move(src.begin(), src.end(), dst.begin());
    for (auto i = dst.begin(); i != it; ++i) std::cout << *i << " "; // Imprime: a b c
    // src agora está em estado válido, mas indefinido
    return 0;
}
```
