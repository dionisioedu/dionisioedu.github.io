---
title: Algoritmos
description: Entenda como construir soluções corretas e eficientes com busca, ordenação, BFS, DFS, Dijkstra, janelas deslizantes, dois ponteiros e muitos exemplos funcionais em C, C++, JavaScript e Python.
---

Algoritmo é o jeito que você transforma um problema em uma sequência de passos que realmente chega ao resultado.

Só que aqui tem um detalhe importante:

programação profissional não é "fazer de algum jeito até rodar".

É fazer de um jeito que seja:

- correto
- explicável
- testável
- viável quando a entrada cresce

Se estrutura de dados é como você organiza o mundo, algoritmo é como você anda por ele.

## A verdade que muita gente aprende tarde

Muita pessoa acha que algoritmo é:

- LeetCode
- entrevista
- “problema artificial”
- assunto de faculdade

Não viaja nessa.

Algoritmo aparece toda hora em software real:

- buscar item
- ordenar feed
- filtrar resultado
- contar frequência
- percorrer árvore de interface
- encontrar caminho
- priorizar tarefas
- navegar dependências

Quando você entende algoritmo de verdade, para de programar no improviso.

## O que um algoritmo realmente é

Algoritmo é um processo finito, claro e executável para resolver um problema.

Repara nos termos:

- **finito**: precisa terminar
- **claro**: não pode ser ambíguo
- **executável**: a máquina consegue seguir
- **resolver um problema**: não basta parecer bonito

Em resumo:

```text
entrada -> transformacao -> saida
```

Mas um algoritmo bom não é só “um passo a passo”.

Ele também respeita:

- corretude
- custo
- clareza
- robustez

## Corretude vem antes de performance

Esse ponto é fundamental.

Muita gente quer pular direto para Big-O, otimização e “solução elegante”.

Só que:

**uma solução rápida e errada continua errada.**

A ordem saudável é:

1. entender o problema
2. construir solução correta
3. validar caso simples e caso de borda
4. só depois melhorar custo

## Como pensar antes de implementar

Antes de abrir o editor, responde:

1. qual é a entrada?
2. qual é a saída?
3. quais restrições existem?
4. o que já está ordenado, agrupado ou estruturado?
5. qual é o menor exemplo que prova a ideia?
6. o que pode quebrar?

Se você pula isso, costuma cair em duas armadilhas:

- escrever muito código sem direção
- otimizar a solução errada

## O modelo mental de resolução

Quase todo problema algorítmico pode ser atacado assim:

```text
Entender o enunciado
        |
        v
Fazer exemplo manual
        |
        v
Encontrar padrao
        |
        v
Escrever pseudocodigo
        |
        v
Implementar
        |
        v
Testar e ajustar
```

Esse fluxo parece simples, mas salva demais.

## Dry run: execute na mão antes de confiar

Exemplo:

```text
Problema: encontrar o maior valor de uma lista

Lista: [4, 9, 2, 7]
```

Ideia:

```text
1. assumir que o primeiro eh o maior
2. comparar com os proximos
3. se achar maior, atualizar
```

Dry run:

```text
Inicio:
maior = 4

Compara com 9:
9 > 4 ? sim
maior = 9

Compara com 2:
2 > 9 ? nao
maior continua 9

Compara com 7:
7 > 9 ? nao
maior continua 9
```

Se você não consegue executar manualmente, ainda não entendeu a solução.

## Complexidade: o mínimo que você precisa sentir

Você não precisa decorar tudo agora.

Mas precisa sentir a diferença entre:

- `O(1)`: custo constante
- `O(log n)`: cresce devagar
- `O(n)`: cresce junto com a entrada
- `O(n log n)`: muito comum em algoritmos bons
- `O(n²)`: começa a doer rápido

### Tabela mental rápida

| Complexidade | Intuição prática |
|---|---|
| `O(1)` | acesso direto, lookup ideal |
| `O(log n)` | corta o problema em partes |
| `O(n)` | passa uma vez pela coleção |
| `O(n log n)` | padrão saudável para ordenação geral |
| `O(n²)` | compara muita coisa com muita coisa |

Regra prática:

- se você tem loop dentro de loop sobre a mesma entrada, acende o alerta
- se você passa uma vez e usa estrutura auxiliar inteligente, normalmente melhora bastante

## Famílias importantes de algoritmos

Antes de ir para exemplos concretos, vale enxergar as famílias mais comuns.

### Força bruta

Tenta tudo ou compara tudo.

Boa quando:

- a entrada é pequena
- você quer validar a corretude primeiro

### Dividir para conquistar

Quebra o problema em partes menores.

Exemplos:

- binary search
- merge sort
- quicksort

### Guloso

Toma a melhor decisão local a cada passo.

Às vezes é perfeito.

Às vezes erra feio.

### Programação dinâmica

Guarda resultados parciais para evitar recalcular.

### Travessia

Percorre estruturas como árvores e grafos.

Exemplos:

- DFS
- BFS

### Menor caminho

Busca caminho ótimo sob alguma regra de custo.

Exemplo clássico:

- Dijkstra

## Busca linear

Busca linear é o algoritmo mais simples de busca.

Ideia:

```text
percorre elemento por elemento
se encontrar, para
se terminar, nao existe
```

### Quando usar

- coleção pequena
- dados não ordenados
- simplicidade vale mais que sofisticação

### Diagrama

```text
Lista: [4, 8, 15, 16, 23, 42]
Alvo: 16

4  -> nao
8  -> nao
15 -> nao
16 -> encontrou
```

### C

```c
#include <stdbool.h>
#include <stdio.h>

bool linear_search(int arr[], int size, int target) {
    for (int i = 0; i < size; i++) {
        if (arr[i] == target) {
            return true;
        }
    }

    return false;
}

int main(void) {
    int values[] = {4, 8, 15, 16, 23, 42};
    int size = sizeof(values) / sizeof(values[0]);

    printf("%d\n", linear_search(values, size, 16)); // 1
    printf("%d\n", linear_search(values, size, 99)); // 0
    return 0;
}
```

### JavaScript

```js
function linearSearch(values, target) {
  for (const value of values) {
    if (value === target) {
      return true;
    }
  }

  return false;
}

console.log(linearSearch([4, 8, 15, 16, 23, 42], 16)); // true
console.log(linearSearch([4, 8, 15, 16, 23, 42], 99)); // false
```

### Python

```python
def linear_search(values, target):
    for value in values:
        if value == target:
            return True
    return False


print(linear_search([4, 8, 15, 16, 23, 42], 16))  # True
print(linear_search([4, 8, 15, 16, 23, 42], 99))  # False
```

## Busca binária

Busca binária já é outro nível de raciocínio.

Ela só funciona quando a coleção está ordenada.

Essa pré-condição é tudo.

### Ideia

Em vez de procurar item por item, você compara com o meio e descarta metade.

### Diagrama

```text
Lista: [2, 4, 6, 8, 10, 12, 14]
Alvo: 10

Meio = 8
10 > 8 -> descarta metade da esquerda

Sobra: [10, 12, 14]
Meio = 12
10 < 12 -> descarta metade da direita

Sobra: [10]
Encontrou
```

### Pseudocódigo

```text
left = 0
right = tamanho - 1

enquanto left <= right
    mid = (left + right) / 2

    se arr[mid] == alvo
        encontrou
    senao se alvo < arr[mid]
        right = mid - 1
    senao
        left = mid + 1
```

### C++

```cpp
#include <iostream>
#include <vector>

int binary_search(const std::vector<int>& values, int target) {
    int left = 0;
    int right = static_cast<int>(values.size()) - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (values[mid] == target) {
            return mid;
        }

        if (target < values[mid]) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    return -1;
}

int main() {
    std::vector<int> values = {2, 4, 6, 8, 10, 12, 14};

    std::cout << binary_search(values, 10) << '\n'; // 4
    std::cout << binary_search(values, 7) << '\n';  // -1
}
```

### Python

```python
def binary_search(values, target):
    left = 0
    right = len(values) - 1

    while left <= right:
        mid = left + (right - left) // 2

        if values[mid] == target:
            return mid

        if target < values[mid]:
            right = mid - 1
        else:
            left = mid + 1

    return -1


print(binary_search([2, 4, 6, 8, 10, 12, 14], 10))  # 4
print(binary_search([2, 4, 6, 8, 10, 12, 14], 7))   # -1
```

### Erro clássico

Usar busca binária em dado não ordenado.

Isso não “fica menos eficiente”.

Isso simplesmente quebra a lógica do algoritmo.

## Ordenação: por que importa tanto

Ordenar não é só deixar “bonitinho”.

Ordenação muda:

- busca
- exibição
- agrupamento
- deduplicação
- análise

Quando você ordena, vários problemas ficam mais fáceis de resolver.

## Bubble sort

Bubble sort não é o rei da produção.

Mas é ótimo para aprender:

- comparação
- troca
- múltiplas passadas

### Ideia

Compara vizinhos e troca se estiver fora de ordem.

### Diagrama

```text
[5, 3, 8, 4]

5 e 3 -> troca -> [3, 5, 8, 4]
5 e 8 -> ok    -> [3, 5, 8, 4]
8 e 4 -> troca -> [3, 5, 4, 8]
```

### C

```c
#include <stdio.h>

void bubble_sort(int arr[], int size) {
    for (int i = 0; i < size - 1; i++) {
        for (int j = 0; j < size - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

int main(void) {
    int arr[] = {5, 3, 8, 4};
    int size = sizeof(arr) / sizeof(arr[0]);

    bubble_sort(arr, size);

    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }

    return 0;
}
```

### Quando lembrar dele

- estudo
- ensino
- conjuntos pequenos

Mas em geral ele perde para algoritmos melhores.

## Insertion sort

Insertion sort é muito bom para ensinar ideia de “manter parte da lista ordenada”.

### Ideia

Você percorre a lista e vai inserindo cada elemento na posição correta da parte já ordenada.

### Diagrama

```text
[5, 3, 8, 4]

Parte ordenada: [5]
Insere 3 -> [3, 5]
Insere 8 -> [3, 5, 8]
Insere 4 -> [3, 4, 5, 8]
```

### C++

```cpp
#include <iostream>
#include <vector>

void insertion_sort(std::vector<int>& values) {
    for (int i = 1; i < static_cast<int>(values.size()); i++) {
        int key = values[i];
        int j = i - 1;

        while (j >= 0 && values[j] > key) {
            values[j + 1] = values[j];
            j--;
        }

        values[j + 1] = key;
    }
}

int main() {
    std::vector<int> values = {5, 3, 8, 4};
    insertion_sort(values);

    for (int value : values) {
        std::cout << value << ' ';
    }
}
```

### Onde ele ainda é relevante

- listas pequenas
- dados quase ordenados
- ensino de ordenação

## Merge sort

Agora entramos em algoritmo realmente forte.

Merge sort usa dividir para conquistar.

### Ideia

1. divide a lista em partes menores
2. ordena as partes
3. faz merge das partes já ordenadas

### Diagrama

```text
[8, 3, 5, 4]
   /       \
[8, 3]    [5, 4]
 /   \     /   \
[8] [3]  [5]  [4]

Merge:
[3, 8] e [4, 5]

Resultado:
[3, 4, 5, 8]
```

### Python

```python
def merge(left, right):
    result = []
    i = 0
    j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])
    return result


def merge_sort(values):
    if len(values) <= 1:
        return values

    mid = len(values) // 2
    left = merge_sort(values[:mid])
    right = merge_sort(values[mid:])

    return merge(left, right)


print(merge_sort([8, 3, 5, 4]))
```

### Por que ele é importante

- boa complexidade geral
- lógica elegante de recursão e merge
- excelente para entender dividir para conquistar

## Quicksort

Quicksort também usa dividir para conquistar, mas de outro jeito.

### Ideia

1. escolhe um pivô
2. separa menores e maiores em torno dele
3. ordena recursivamente os lados

### Diagrama

```text
[8, 3, 5, 4]
pivo = 5

menores: [3, 4]
pivo:    [5]
maiores: [8]

resultado:
[3, 4, 5, 8]
```

### JavaScript

```js
function quickSort(values) {
  if (values.length <= 1) {
    return values;
  }

  const pivot = values[values.length - 1];
  const left = [];
  const right = [];

  for (let i = 0; i < values.length - 1; i += 1) {
    if (values[i] < pivot) {
      left.push(values[i]);
    } else {
      right.push(values[i]);
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}

console.log(quickSort([8, 3, 5, 4]));
```

### Observação importante

Quicksort é muito relevante, mas a escolha do pivô importa.

Pivot ruim demais pode degradar o desempenho.

## BFS: busca em largura

BFS percorre por níveis.

Ela usa fila.

### Onde aparece

- caminho mínimo em grafo não ponderado
- distância por camadas
- varredura nível a nível

### Diagrama

```text
    A
   / \
  B   C
 / \   \
D   E   F

BFS a partir de A:
A -> B -> C -> D -> E -> F
```

### Representação do grafo

```text
A: [B, C]
B: [D, E]
C: [F]
D: []
E: []
F: []
```

### Python

```python
from collections import deque


def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    order = []

    while queue:
        node = queue.popleft()
        order.append(node)

        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return order


graph = {
    "A": ["B", "C"],
    "B": ["D", "E"],
    "C": ["F"],
    "D": [],
    "E": [],
    "F": [],
}

print(bfs(graph, "A"))  # ['A', 'B', 'C', 'D', 'E', 'F']
```

### JavaScript

```js
function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];

  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return order;
}

const graph = {
  A: ["B", "C"],
  B: ["D", "E"],
  C: ["F"],
  D: [],
  E: [],
  F: [],
};

console.log(bfs(graph, "A"));
```

## DFS: busca em profundidade

DFS vai fundo antes de voltar.

Ela pode ser feita:

- com recursão
- com stack explícita

### Diagrama

Usando o mesmo grafo:

```text
    A
   / \
  B   C
 / \   \
D   E   F

Uma DFS possivel:
A -> B -> D -> E -> C -> F
```

### DFS recursiva em Python

```python
def dfs(graph, start, visited=None, order=None):
    if visited is None:
        visited = set()
    if order is None:
        order = []

    visited.add(start)
    order.append(start)

    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited, order)

    return order


graph = {
    "A": ["B", "C"],
    "B": ["D", "E"],
    "C": ["F"],
    "D": [],
    "E": [],
    "F": [],
}

print(dfs(graph, "A"))
```

### DFS iterativa em C++

```cpp
#include <iostream>
#include <stack>
#include <unordered_map>
#include <unordered_set>
#include <vector>

void dfs_iterative(
    const std::unordered_map<char, std::vector<char>>& graph,
    char start
) {
    std::stack<char> st;
    std::unordered_set<char> visited;

    st.push(start);

    while (!st.empty()) {
        char node = st.top();
        st.pop();

        if (visited.count(node)) {
            continue;
        }

        visited.insert(node);
        std::cout << node << ' ';

        const auto& neighbors = graph.at(node);
        for (auto it = neighbors.rbegin(); it != neighbors.rend(); ++it) {
            if (!visited.count(*it)) {
                st.push(*it);
            }
        }
    }
}

int main() {
    std::unordered_map<char, std::vector<char>> graph = {
        {'A', {'B', 'C'}},
        {'B', {'D', 'E'}},
        {'C', {'F'}},
        {'D', {}},
        {'E', {}},
        {'F', {}}
    };

    dfs_iterative(graph, 'A');
}
```

### Quando usar BFS ou DFS

Use BFS quando:

- quer explorar por camadas
- quer menor caminho em grafo sem peso

Use DFS quando:

- quer ir fundo primeiro
- quer explorar caminhos
- quer detectar ciclos ou componentes

## Dijkstra

Dijkstra é um dos algoritmos mais importantes para menor caminho com pesos positivos.

### Problema que ele resolve

```text
Qual o caminho de menor custo do ponto A ate os outros pontos?
```

### Requisito importante

Os pesos precisam ser não negativos.

### Exemplo de grafo ponderado

```text
A --1--> B
A --4--> C
B --2--> C
B --5--> D
C --1--> D
```

### Intuição

1. começa com distância zero no ponto inicial
2. assume infinito para o resto
3. sempre expande o nó com menor distância conhecida
4. relaxa as arestas

### Diagrama de distâncias

```text
Inicio:
A = 0
B = inf
C = inf
D = inf

Depois de processar A:
B = 1
C = 4

Depois de processar B:
C = min(4, 1 + 2) = 3
D = 1 + 5 = 6

Depois de processar C:
D = min(6, 3 + 1) = 4
```

### Python com `heapq`

```python
import heapq


def dijkstra(graph, start):
    distances = {node: float("inf") for node in graph}
    distances[start] = 0

    heap = [(0, start)]

    while heap:
        current_distance, node = heapq.heappop(heap)

        if current_distance > distances[node]:
            continue

        for neighbor, weight in graph[node]:
            new_distance = current_distance + weight

            if new_distance < distances[neighbor]:
                distances[neighbor] = new_distance
                heapq.heappush(heap, (new_distance, neighbor))

    return distances


graph = {
    "A": [("B", 1), ("C", 4)],
    "B": [("C", 2), ("D", 5)],
    "C": [("D", 1)],
    "D": [],
}

print(dijkstra(graph, "A"))
```

### C++ com `priority_queue`

```cpp
#include <iostream>
#include <limits>
#include <queue>
#include <unordered_map>
#include <utility>
#include <vector>

using Edge = std::pair<char, int>;

std::unordered_map<char, int> dijkstra(
    const std::unordered_map<char, std::vector<Edge>>& graph,
    char start
) {
    std::unordered_map<char, int> dist;

    for (const auto& [node, _] : graph) {
        dist[node] = std::numeric_limits<int>::max();
    }

    dist[start] = 0;

    using State = std::pair<int, char>;
    std::priority_queue<State, std::vector<State>, std::greater<State>> pq;
    pq.push({0, start});

    while (!pq.empty()) {
        auto [currentDistance, node] = pq.top();
        pq.pop();

        if (currentDistance > dist[node]) {
            continue;
        }

        for (const auto& [neighbor, weight] : graph.at(node)) {
            int newDistance = currentDistance + weight;

            if (newDistance < dist[neighbor]) {
                dist[neighbor] = newDistance;
                pq.push({newDistance, neighbor});
            }
        }
    }

    return dist;
}

int main() {
    std::unordered_map<char, std::vector<Edge>> graph = {
        {'A', {{'B', 1}, {'C', 4}}},
        {'B', {{'C', 2}, {'D', 5}}},
        {'C', {{'D', 1}}},
        {'D', {}}
    };

    auto distances = dijkstra(graph, 'A');

    for (const auto& [node, distance] : distances) {
        std::cout << node << ": " << distance << '\n';
    }
}
```

## Two pointers

Esse padrão é simples e valioso.

Você usa dois índices que se movem pela coleção.

### Onde aparece

- array ordenado
- remoção de duplicados
- soma de pares
- problema de intervalos

### Exemplo: achar dois números que somam 10

Dado ordenado:

```text
[1, 2, 3, 4, 6, 8]
```

Diagrama:

```text
left = 1
right = 8
1 + 8 = 9  -> move left
2 + 8 = 10 -> encontrou
```

### Python

```python
def two_sum_sorted(values, target):
    left = 0
    right = len(values) - 1

    while left < right:
        current = values[left] + values[right]

        if current == target:
            return left, right

        if current < target:
            left += 1
        else:
            right -= 1

    return None


print(two_sum_sorted([1, 2, 3, 4, 6, 8], 10))
```

## Sliding window

Sliding window é um padrão muito forte para sequência contínua.

Você mantém uma “janela” e ajusta o tamanho dela em vez de recalcular tudo do zero.

### Exemplo: maior soma de subarray de tamanho 3

```text
[2, 1, 5, 1, 3, 2]
```

### Ideia

```text
Janela inicial: [2, 1, 5] -> soma 8
Anda uma posicao:
[1, 5, 1] -> soma 7
Anda:
[5, 1, 3] -> soma 9
Anda:
[1, 3, 2] -> soma 6
```

### JavaScript

```js
function maxSumSubarray(values, k) {
  if (values.length < k) {
    return null;
  }

  let windowSum = 0;

  for (let i = 0; i < k; i += 1) {
    windowSum += values[i];
  }

  let maxSum = windowSum;

  for (let i = k; i < values.length; i += 1) {
    windowSum += values[i] - values[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}

console.log(maxSumSubarray([2, 1, 5, 1, 3, 2], 3)); // 9
```

## Frequency counting com hash map

Isso merece destaque porque aparece demais.

Exemplo:

```text
achar primeiro caractere repetido
contar palavras
agrupar ocorrencias
```

### Python

```python
def first_repeated_char(text):
    seen = {}

    for char in text:
        seen[char] = seen.get(char, 0) + 1
        if seen[char] == 2:
            return char

    return None


print(first_repeated_char("abca"))  # a
```

## Como reconhecer o algoritmo ou padrão certo

### Sinais de busca linear

- dado não ordenado
- coleção pequena
- só preciso verificar existência

### Sinais de busca binária

- dado ordenado
- preciso achar rápido
- posso descartar metade

### Sinais de BFS

- explorar níveis
- distância mínima sem peso

### Sinais de DFS

- explorar profundidade
- árvore, grafo, dependência, ciclo

### Sinais de Dijkstra

- grafo com peso positivo
- menor custo acumulado

### Sinais de sliding window

- subarray ou substring contínua
- janela que anda

### Sinais de two pointers

- coleção ordenada
- duas extremidades importam

## Erros clássicos

- otimizar cedo demais
- esquecer pré-condição do algoritmo
- usar binary search sem ordenar
- usar BFS quando o problema pede custo com peso
- usar Dijkstra com peso negativo
- implementar ordenação sem testar duplicados
- confiar porque “rodou no caso feliz”

## Como estudar algoritmo sem travar

Segue esta ordem:

1. entenda o enunciado
2. resolva manualmente
3. escreva pseudocódigo
4. implemente
5. faça dry run
6. teste caso vazio
7. teste caso mínimo
8. teste caso de borda
9. só depois pense em otimização

Isso parece repetitivo.

É justamente por isso que funciona.

## Sequência de treino que dá resultado

### Etapa 1

- busca linear
- maior e menor valor
- contagem de frequência

### Etapa 2

- busca binária
- bubble sort
- insertion sort

### Etapa 3

- merge sort
- quicksort
- two pointers
- sliding window

### Etapa 4

- BFS
- DFS
- Dijkstra

## Checklist forte de algoritmos

- Você entende entrada, saída e restrição?
- Você consegue fazer dry run?
- Você sabe quando um algoritmo exige pré-condição?
- Você consegue explicar o custo em alto nível?
- Você sabe por que a solução está correta?
- Você sabe quando precisa de BFS, DFS ou Dijkstra?

Se a resposta for “sim” para a maior parte disso, seu raciocínio algorítmico já está entrando em nível sério.

## Próximas ações

- Reforce a modelagem em [Estruturas de Dados](/pt/reference/estruturas-de-dados/)
- Se a base de raciocínio ainda trava, revise [Lógica de Programação](/pt/reference/logica-de-programacao/)
- Depois conecte isso a código real em [Projetos](/pt/projects/)
