---
title: "std::upper_bound"
date: 2025-05-25T01:03:00-03:00
lastmod: 2025-05-25T01:03:00-03:00
description: "Detalhes sobre a função std::upper_bound da STL."
draft: false
hide_title: true
type: "docs"
menu:
  docs:
    parent: "stl"
    weight: 20
tags: ["C++", "STL", "algoritmo", "busca"]
---

Encontra o primeiro elemento maior que um valor em um intervalo ordenado `[first, last)` usando busca binária.
- **Cabeçalho**: `<algorithm>`
- **Assinatura**:
```cpp
upper_bound(ForwardIt first, ForwardIt last, const T& value);
upper_bound(ForwardIt first, ForwardIt last, const T& value, Compare comp);
```
- **Parâmetros**:
  - **first, last** - Iteradores que definem o intervalo ordenado de busca.
  - **value** - Valor de referência para a busca.
  - **comp** - Função de comparação que retorna true se o primeiro elemento for menor que o segundo (padrão: std::less).
- **Retorno**: Iterador para o primeiro elemento maior que value ou last se não encontrado.
- **Exceções**: Nenhuma, a menos que a função de comparação comp lance.
- **Versão**: `C++98`
- **Performance**: O(log N), onde N é o número de elementos no intervalo.
- **Exemplo**:
```cpp
#include <algorithm>
#include <vector>
#include <iostream>
int main() {
    std::vector<int> vec = {1, 2, 4, 4, 5};
    auto it = std::upper_bound(vec.begin(), vec.end(), 2); // Aponta para o primeiro 4
    if (it != vec.end()) std::cout << *it << '\n'; // Imprime: 4
    // Com comparação personalizada
    auto comp = [](int a, int b) { return a > b; };
    std::vector<int> vec_desc = {5, 4, 4, 2, 1};
    it = std::upper_bound(vec_desc.begin(), vec_desc.end(), 4, comp); // Aponta para o primeiro 2
    if (it != vec_desc.end()) std::cout << *it << '\n'; // Imprime: 2
    return 0;
}
```
