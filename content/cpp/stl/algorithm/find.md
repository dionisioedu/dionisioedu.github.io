---
title: "std::find"
date: 2025-05-24T23:04:00-03:00
lastmod: 2025-05-24T23:04:00-03:00
description: "Detalhes sobre a função std::find da STL."
draft: false
hide_title: true
type: "docs"
menu:
  docs:
    parent: "stl"
    weight: 20
tags: ["C++", "STL", "algoritmo", "busca"]
---

Busca o primeiro elemento igual a um valor específico em um intervalo `[first, last)`.
- **Cabeçalho**: ```<algorithm>```
- **Assinatura**:
```cpp
find(InputIt first, InputIt last, const T& value);
```
- **Parâmetros**:
  - **first**, **last** - Iteradores que definem o intervalo de busca.
  - **value** - Valor a ser procurado.
- **Retorno**: Iterador para o primeiro elemento igual a value ou last se não encontrado.
- **Exceções**: Nenhuma, a menos que operações de iteração lancem.
- **Versão**: `C++98`
- **Performance**: O(N)
- **Exemplo**:
```cpp
#include <algorithm>
#include <vector>
int main() {
    std::vector<int> vec = {1, 2, 3, 4};
    auto it = std::find(vec.begin(), vec.end(), 3); // Aponta para 3
    if (it != vec.end()) std::cout << *it << '\n'; // Imprime: 3
    return 0;
}
```