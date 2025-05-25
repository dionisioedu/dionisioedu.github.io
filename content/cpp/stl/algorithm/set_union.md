---
title: "std::set_union"
date: 2025-05-25T01:18:00-03:00
lastmod: 2025-05-25T01:18:00-03:00
description: "Detalhes sobre a função std::set_union da STL."
draft: false
hide_title: true
type: "docs"
menu:
  docs:
    parent: "stl"
    weight: 20
tags: ["C++", "STL", "algoritmo", "conjuntos"]
---

Combina dois intervalos ordenados `[first1, last1)` e `[first2, last2)` em um intervalo de saída contendo a união dos elementos, sem duplicatas.
- **Cabeçalho**: `<algorithm>`
- **Assinatura**:
```cpp
set_union(InputIt1 first1, InputIt1 last1, InputIt2 first2, InputIt2 last2, OutputIt result);
set_union(InputIt1 first1, InputIt1 last1, InputIt2 first2, InputIt2 last2, OutputIt result, Compare comp);
```
- **Parâmetros**:
  - **first1**, **last1** - Iteradores que definem o primeiro intervalo ordenado.
  - **first2**, **last2** - Iteradores que definem o segundo intervalo ordenado.
  - **result** - Iterador para o início do intervalo de saída.
  - **comp** - Função de comparação que retorna true se o primeiro elemento for *menor* que o segundo (padrão: std::less).
- **Retorno**: Iterador para o fim do intervalo de saída.
- **Exceções**: Nenhuma, a menos que operações de cópia ou a função de comparação comp lancem.
- **Versão**: `C++98`
- **Performance**: O(N1 + N2), onde N1 e N2 são os tamanhos dos intervalos de entrada.
- **Exemplo**:
```cpp
#include <algorithm>
#include <vector>
#include <iostream>
int main() {
    std::vector<int> v1 = {1, 3, 5};
    std::vector<int> v2 = {2, 3, 4};
    std::vector<int> result(6); // Tamanho suficiente para a união
    auto it = std::set_union(v1.begin(), v1.end(), v2.begin(), v2.end(), result.begin());
    for (auto i = result.begin(); i != it; ++i) std::cout << *i << " "; // Imprime: 1 2 3 4 5
    // Com comparação personalizada
    auto comp = [](int a, int b) { return a > b; };
    std::vector<int> v1_desc = {5, 3, 1}, v2_desc = {4, 3, 2};
    it = std::set_union(v1_desc.begin(), v1_desc.end(), v2_desc.begin(), v2_desc.end(), result.begin(), comp);
    for (auto i = result.begin(); i != it; ++i) std::cout << *i << " "; // Imprime: 5 4 3 2 1
    return 0;
}
```
