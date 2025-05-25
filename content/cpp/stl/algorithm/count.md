---
title: "std::count"
date: 2025-05-25T01:11:00-03:00
lastmod: 2025-05-25T01:11:00-03:00
description: "Detalhes sobre a função std::count da STL."
draft: false
hide_title: true
type: "docs"
menu:
  docs:
    parent: "stl"
    weight: 20
tags: ["C++", "STL", "algoritmo", "contagem"]
---

Conta o número de elementos em um intervalo `[first, last)` que são iguais a um valor especificado.
- **Cabeçalho**: `<algorithm>`
- **Assinatura**:
```cpp
count(InputIt first, InputIt last, const T& value);
```
- **Parâmetros**:
  - **first, last** - Iteradores que definem o intervalo de busca.
  - **value** - Valor a ser contado.
- **Retorno**: Número de elementos iguais a value no intervalo (tipo std::iterator_traits<InputIt>::difference_type).
- **Exceções**: Nenhuma, a menos que operações de comparação lancem.
- **Versão**: `C++98`
- **Performance**: O(N), onde N é o número de elementos no intervalo.
- **Exemplo**:
```cpp
#include <algorithm>
#include <vector>
#include <iostream>
int main() {
    std::vector<int> vec = {1, 2, 2, 3, 2, 4};
    auto result = std::count(vec.begin(), vec.end(), 2); // Conta ocorrências de 2
    std::cout << result << '\n'; // Imprime: 3
    return 0;
}
```
