---
title: "Standard Template Library (STL)"
date: 2025-05-24T23:04:00-03:00
lastmod: 2025-05-24T23:04:00-03:00
description: "Uma introdução à Standard Template Library (STL) do C++, sua história e uma lista de funções agrupadas por cabeçalho."
draft: false
type: "docs"
menu:
  docs:
    parent: "cpp"
    weight: 10
tags: ["C++", "STL", "programação", "algoritmos", "contêineres"]
---

A **Standard Template Library (STL)** é um componente essencial da biblioteca padrão do C++, fornecendo ferramentas genéricas e eficientes para manipulação de dados, algoritmos e estruturas de dados. Projetada para ser flexível e reutilizável, a STL utiliza templates para permitir operações em diferentes tipos de dados sem perda de desempenho. Este artigo apresenta uma visão geral da STL, sua história e uma lista de suas principais funções, agrupadas por cabeçalho, com links para páginas detalhadas de cada função.

## O que é a STL?

A STL é uma biblioteca que faz parte do padrão C++ desde 1998 (C++98), oferecendo:

- **Contêineres**: Estruturas de dados como `vector`, `list`, `map`, `set`, etc.
- **Algoritmos**: Funções genéricas para busca, ordenação, manipulação de intervalos, etc., como `sort`, `find` e `accumulate`.
- **Iteradores**: Objetos que permitem navegar pelos elementos dos contêineres.
- **Funções utilitárias**: Ferramentas como `make_pair`, `move` e ponteiros inteligentes (`unique_ptr`, `shared_ptr`).

A STL é projetada para ser eficiente, genérica e extensível, permitindo que programadores combinem seus componentes de maneira modular para resolver uma ampla gama de problemas.

## Breve História da STL

A STL foi originalmente desenvolvida por **Alexander Stepanov**, **Meng Lee** e **David Musser** na Hewlett-Packard (HP) no início dos anos 1990. Inspirada por conceitos de programação genérica e paradigmas funcionais, a STL foi proposta para padronizar algoritmos e estruturas de dados reutilizáveis em C++. Em 1994, a STL foi incorporada à proposta do padrão C++98, tornando-se parte oficial da linguagem. Desde então, a STL evoluiu com novas funcionalidades em C++11, C++17, C++20 e além, incluindo melhorias como `std::string_view`, `std::span` e algoritmos paralelos.

A STL revolucionou a programação em C++ ao introduzir um modelo genérico que combina eficiência com flexibilidade, influenciando outras linguagens e bibliotecas modernas.

## Funções da STL por Cabeçalho

Abaixo está uma lista das principais funções da STL, organizadas por cabeçalho. Cada função tem um link para uma página futura com detalhes específicos (a ser criada). As funções estão agrupadas por cabeçalho, pois este é o modo natural como a STL organiza seus componentes, facilitando a navegação e a consulta.

### `<algorithm>`

Este cabeçalho contém algoritmos genéricos para manipulação de intervalos, incluindo ordenação, busca e modificação.

- [**std::sort**](/stl/algorithm/sort/) - Ordena elementos em um intervalo.
- [**std::find**](/stl/algorithm/find/) - Busca um valor específico em um intervalo.
- [**std::for_each**](/stl/algorithm/for_each/) - Aplica uma função a cada elemento de um intervalo.
- [**std::transform**](/stl/algorithm/transform/) - Aplica uma operação a elementos e armazena os resultados.
- [**std::binary_search**](/stl/algorithm/binary_search/) - Verifica se um valor existe em um intervalo ordenado.
- [**std::lower_bound**](/stl/algorithm/lower_bound/) - Encontra o primeiro elemento não menor que um valor.
- [**std::upper_bound**](/stl/algorithm/upper_bound/) - Encontra o primeiro elemento maior que um valor.
- [**std::find_if**](/stl/algorithm/find_if/) - Busca o primeiro elemento que satisfaz um predicado.
- [**std::count**](/stl/algorithm/count/) - Conta elementos iguais a um valor.
- [**std::set_union**](/stl/algorithm/set_union/) - Combina dois intervalos ordenados em uma união.
- [**std::set_intersection**](/stl/algorithm/set_intersection/) - Gera a interseção de dois intervalos ordenados.
- [**std::set_difference**](/stl/algorithm/set_difference/) - Gera a diferença de dois intervalos ordenados.
- [**std::copy**](/stl/algorithm/copy/) - Copia elementos de um intervalo para outro.
- [**std::move**](/stl/algorithm/move/) - Move elementos de um intervalo para outro.
- [**std::fill**](/stl/algorithm/fill/) - Preenche um intervalo com um valor específico.
- [**std::replace**](/stl/algorithm/replace/) - Substitui elementos iguais a um valor por outro.
- [**std::partition**](/stl/algorithm/partition/) - Particiona um intervalo com base em um predicado.
- [**std::stable_partition**](/stl/algorithm/stable_partition/) - Particiona um intervalo mantendo a ordem relativa.

### `<numeric>`

Este cabeçalho fornece algoritmos numéricos para cálculos em intervalos.

- [**std::accumulate**](/stl/numeric/accumulate/) - Acumula valores de um intervalo.
- [**std::iota**](/stl/numeric/iota/) - Preenche um intervalo com valores incrementais.
- [**std::inner_product**](/stl/numeric/inner_product/) - Calcula o produto interno de dois intervalos.
- [**std::adjacent_difference**](/stl/numeric/adjacent_difference/) - Calcula diferenças entre elementos adjacentes.

### `<vector>`

Contém funções para manipulação de vetores dinâmicos.

- [**std::vector::push_back**](/stl/vector/push_back/) - Adiciona um elemento ao final do vetor.
- [**std::vector::emplace_back**](/stl/vector/emplace_back/) - Constrói um elemento diretamente no final do vetor.

### `<list>`

Contém funções para manipulação de listas duplamente encadeadas.

- [**std::list::splice**](/stl/list/splice/) - Transfere elementos de uma lista para outra.

### `<map>`

Contém funções para manipulação de mapas associativos ordenados.

- [**std::map::insert**](/stl/map/insert/) - Insere um par chave-valor em um mapa.

### `<unordered_map>`

Contém funções para manipulação de mapas associativos não ordenados.

- [**std::unordered_map::find**](/stl/unordered_map/find/) - Busca um elemento pela chave.

### `<deque>`

Contém funções para manipulação de deques (filas de duas extremidades).

- [**std::deque::push_front**](/stl/deque/push_front/) - Adiciona um elemento ao início de uma deque.

### `<set>`

Contém funções para manipulação de conjuntos ordenados.

- [**std::set::erase**](/stl/set/erase/) - Remove elementos de um conjunto.

### `<utility>`

Contém funções utilitárias para manipulação de pares e movimentação.

- [**std::make_pair**](/stl/utility/make_pair/) - Cria um `std::pair` a partir de dois valores.
- [**std::move**](/stl/utility/move/) - Converte um objeto em uma referência rvalue.
- [**std::swap**](/stl/utility/swap/) - Troca os valores de dois objetos.
- [**std::tie**](/stl/tuple/tie/) - Cria uma tupla de referências para desempacotar valores.

### `<memory>`

Contém funções para gerenciamento de memória dinâmica.

- [**std::unique_ptr**](/stl/memory/unique_ptr/) - Gerencia a posse exclusiva de um ponteiro.
- [**std::make_unique**](/stl/memory/make_unique/) - Cria um `std::unique_ptr` com um objeto construído.
- [**std::shared_ptr**](/stl/memory/shared_ptr/) - Gerencia a posse compartilhada de um ponteiro.
- [**std::make_shared**](/stl/memory/make_shared/) - Cria um `std::shared_ptr` com um objeto construído.

### `<string>`

Contém funções para manipulação de strings.

- [**std::to_string**](/stl/string/to_string/) - Converte um valor numérico em uma string.
- [**std::string::starts_with**](/stl/string/starts_with/) - Verifica se uma string começa com um prefixo.
- [**std::string::ends_with**](/stl/string/ends_with/) - Verifica se uma string termina com um sufixo.

## Próximos Passos

Cada função listada acima terá sua própria página detalhada, incluindo parâmetros, retornos, exceções, exemplos e desempenho. Consulte as páginas individuais para aprofundar seu conhecimento sobre cada função da STL.

Para contribuir com esta wiki ou sugerir melhorias, envie um comentário ou pull request no repositório do projeto em [dionisio.dev](https://dionisio.dev)!