---
title: "std::set_intersection"
date: 2025-05-25T01:17:00-03:00
lastmod: 2025-05-25T01:17:00-03:00
description: "Detalhes sobre a função std::set_intersection da STL."
draft: false
hide_title: true
type: "docs"
menu:
  docs:
    parent: "stl"
    weight: 20
tags: ["C++", "STL", "algoritmo", "conjuntos"]
---

Gera a interseção de dois intervalos ordenados `[first1, last1)` e `[first2, last2)` em um intervalo de saída, contendo apenas os elementos presentes em ambos os intervalos.
- **Cabeçalho**: `<algorithm>`
- **Assinatura**:
```cpp
set_intersection(InputIt1 first1, InputIt1 last1, InputIt2 first2, InputIt2 last2, OutputIt result);
set_intersection(InputIt1 first1, InputIt1 last1, InputIt2 first2, InputIt2 last2, OutputIt result, Compare comp);
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
    std::vector<int> v1 = {1, 2, 3, 4};
    std::vector<int> v2 = {2, 3, 5};
    std::vector<int> result(3); // Tamanho suficiente para a interseção
    auto it = std::set_intersection(v1.begin(), v1.end(), v2.begin(), v2.end(), result.begin());
    for (auto i = result.begin(); i != it; ++i) std::cout << *i << " "; // Imprime: 2 3
    // Com comparação personalizada
    auto comp = [](int a, int b) { return a > b; };
    std::vector<int> v1_desc = {4, 3, 2, 1}, v2_desc = {5, 3, 2};
    it = std::set_intersection(v1_desc.begin(), v1_desc.end(), v2_desc.begin(), v2_desc.end(), result.begin(), comp);
    for (auto i = result.begin(); i != it; ++i) std::cout << *i << " "; // Imprime: 3 2
    return 0;
}
```
