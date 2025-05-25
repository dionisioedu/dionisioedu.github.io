---
title: "std::inner_product"
date: 2025-05-25T01:37:00-03:00
lastmod: 2025-05-25T01:37:00-03:00
description: "Detalhes sobre a função std::inner_product da STL."
draft: false
hide_title: true
type: "docs"
menu:
  docs:
    parent: "stl"
    weight: 20
tags: ["C++", "STL", "numérico", "produto interno"]
---

Calcula o produto interno de dois intervalos `[first1, last1)` e `[first2, first2 + (last1 - first1))`, com operações binárias personalizáveis, acumulando a partir de um valor inicial.
- **Cabeçalho**: `<numeric>`
- **Assinatura**:
```cpp
inner_product(InputIt1 first1, InputIt1 last1, InputIt2 first2, T init);
inner_product(InputIt1 first1, InputIt1 last1, InputIt2 first2, T init, BinaryOp1 op1, BinaryOp2 op2);
```
- **Parâmetros**:
  - **first1**, **last1** - Iteradores que definem o primeiro intervalo `[first1, last1)` de entrada.
  - **first2** - Iterador para o início do segundo intervalo.
  - **init** - Valor inicial da acumulação.
  - **op1** - Operação binária para acumulação (padrão: std::plus).
  - **op2** - Operação binária para multiplicação (padrão: std::multiplies).
- **Retorno**: Resultado do produto interno.
- **Exceções**: Depende das operações op1 e op2; a função em si não lança, a menos que op1 ou op2 o façam.
- **Versão**: `C++98`
- **Performance**: O(N), onde N é o número de elementos no intervalo.
- **Exemplo**:
```cpp
#include <numeric>
#include <vector>
#include <iostream>
int main() {
    std::vector<int> v1 = {1, 2, 3};
    std::vector<int> v2 = {4, 5, 6};
    int result = std::inner_product(v1.begin(), v1.end(), v2.begin(), 0); // 1*4 + 2*5 + 3*6
    std::cout << result << '\n'; // Imprime: 32
    return 0;
}
```