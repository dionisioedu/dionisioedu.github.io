---
layout: post
title: "As 30 Principais Funções da STL para Profissionais C++"
date: 2025-05-24
categories: [C++, Programação, STL]
tags: [C++, STL, programação, algoritmos, contêineres]
author: Edu Dionisio
description: Um guia detalhado com as 30 funções mais importantes da STL para programadores C++, incluindo exemplos, parâmetros, retornos, exceções e versões disponíveis.
---

A **Standard Template Library (STL)** é um pilar fundamental da programação em C++, oferecendo ferramentas poderosas para manipulação de dados, algoritmos e estruturas eficientes. Neste artigo, apresentamos as 30 funções mais relevantes da STL para profissionais C++, com explicações detalhadas, exemplos práticos e informações sobre a versão do C++ em que cada função está disponível. As funções são organizadas por categorias (algoritmos, contêineres, utilitários, etc.) para facilitar a compreensão.

---

## 1. Algoritmos Gerais

### **std::sort**
Ordena os elementos no intervalo (first, last) usando o operador < ou uma função de comparação personalizada. Utiliza introsort, uma combinação de quicksort, heapsort e insertion sort para garantir eficiência.
- **Cabeçalho**: ```<algorithm>```
- **Assinatura**:
```
sort(RandomIt first, RandomIt last);
sort(RandomIt first, RandomIt last, Compare comp);
```
- **Parâmetros**:
  - **first**, **last** - Um par de iteradores que definem o range que vai ser ordenado.
  - **comp** - Função de comparação que retorna **true** se o primeiro elemento for *menor* do que o segundo.
- **Retorno**: Nenhum (`void`).
- **Exceções**: Pode lançar exceções de cópia, movimentação ou da função de comparação.
- **Versão**: C++ 98
- **Performance**: O(N log N)
- **Exemplo**:
```cpp
#include <vector>
#include <algorithm>
int main() {
    std::vector<int> vec = {5, 2, 9, 1, 5};
    std::sort(vec.begin(), vec.end()); // Ordena: {1, 2, 5, 5, 9}
    return 0;

    // Com comparação personalizada
    auto comp = [](int a, int b) { return a > b; };
    std::sort(vec.begin(), vec.end(), comp); // ordem decrescente
}
```
---
### **std::find**
Busca o primeiro elemento igual a um valor específico em um intervalo [first, last).
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
- **Versão**: C++98
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

