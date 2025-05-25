---
title: "std::binary_search"
date: 2025-05-25T00:53:00-03:00
lastmod: 2025-05-25T00:53:00-03:00
description: "Detalhes sobre a função std::binary_search da STL."
draft: false
hide_title: true
type: "docs"
menu:
  docs:
    parent: "stl"
    weight: 20
tags: ["C++", "STL", "algoritmo", "busca"]
---

Verifica se um valor existe em um intervalo ordenado `[first, last)` usando busca binária.
- **Cabeçalho**: `<algorithm>`
- **Assinatura**:
```cpp
binary_search(ForwardIt first, ForwardIt last, const T& value);
binary_search(ForwardIt first, ForwardIt last, const T& value, Compare comp);
```
- **Parâmetros**:
  - **first, last** - Iteradores que definem o intervalo ordenado de busca.
  - **value** - Valor a ser procurado.
  - **comp** - Função de comparação que retorna true se o primeiro elemento for menor que o segundo (padrão: std::less).
- **Retorno**: bool indicando se o valor foi encontrado no intervalo.
- **Exceções**: Nenhuma, a menos que a função de comparação comp lance.
- **Versão**: `C++98`
- **Performance**: O(log N), onde N é o número de elementos no intervalo.
- **Exemplo**:
```cpp
#include <algorithm>
#include <vector>
#include <iostream>
int main() {
    std::vector<int> vec = {1, 2, 3, 4, 5};
    bool found = std::binary_search(vec.begin(), vec.end(), 3); // true
    std::cout << std::boolalpha << found << '\n'; // Imprime: true
    // Com comparação personalizada
    auto comp = [](int a, int b) { return a > b; };
    std::vector<int> vec_desc = {5, 4, 3, 2, 1};
    found = std::binary_search(vec_desc.begin(), vec_desc.end(), 3, comp); // true
    std::cout << found << '\n'; // Imprime: true
    return 0;
}
```
