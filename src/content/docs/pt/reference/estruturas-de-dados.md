---
title: Estruturas de Dados
description: Entenda arrays, listas ligadas, pilhas, filas, mapas, sets, árvores, heaps e grafos com diagramas, critérios de escolha e muitos exemplos em C, C++, JavaScript e Python.
---

Estrutura de dados não é detalhe.

Estrutura de dados é o jeito que você decide organizar o mundo dentro do programa.

E isso muda tudo.

A mesma regra de negócio pode virar:

- código simples e direto
- ou um Frankenstein cheio de busca lenta, remendo e estado duplicado

Se você quer parar de resolver tudo "do jeito que deu", esta página é uma das mais importantes da referência.

## A pergunta certa não é "qual estrutura é melhor?"

A pergunta certa é:

**qual operação manda nesse problema?**

Porque estrutura de dados não se escolhe por moda.

Você escolhe pela pressão principal do caso real:

- preciso buscar por índice?
- preciso achar por chave?
- preciso garantir unicidade?
- preciso respeitar ordem de chegada?
- preciso prioridade?
- preciso representar conexões?

Quem aprende isso para de tratar dado como massa sem forma.

## O que uma estrutura de dados realmente é

Estrutura de dados é uma forma organizada de armazenar valores para facilitar certas operações.

Toda estrutura tem forças e fraquezas.

Ou seja:

```text
estrutura boa para uma operação
pode ser estrutura ruim para outra
```

Exemplo clássico:

- array é ótimo para acesso por índice
- mapa é ótimo para busca por chave
- fila é ótima para ordem de chegada
- heap é ótima para prioridade

Não existe solução mágica.

Existe escolha coerente.

## Estrutura de dados versus algoritmo

Essa distinção é importante.

### Estrutura de dados

Responde:

```text
como os dados ficam organizados?
```

### Algoritmo

Responde:

```text
como eu transformo esses dados para chegar ao resultado?
```

Eles trabalham juntos.

Exemplo:

- estrutura: `Map`
- algoritmo: buscar, atualizar, contar frequência

Sem estrutura boa, algoritmo sofre.

Sem algoritmo bom, estrutura sozinha não salva.

## O modelo mental que realmente ajuda

Antes de escolher estrutura, responde estas perguntas:

1. Qual operação acontece mais?
2. A ordem importa?
3. O acesso é por índice, chave, prioridade ou conexão?
4. Vou inserir e remover muito?
5. Preciso evitar duplicidade?
6. Preciso percorrer tudo ou achar um item específico?

Isso já resolve a maior parte da escolha.

## Tabela mental rápida

| Situação principal | Estrutura que costuma encaixar |
|---|---|
| Ordem e índice | Array / lista |
| Inserção e remoção local com ponteiros | Lista ligada |
| Desfazer, histórico, parsing | Stack |
| Ordem de chegada | Queue |
| Processar nas duas pontas | Deque |
| Buscar por chave | Map / dicionário / hash map |
| Garantir unicidade | Set |
| Hierarquia | Árvore |
| Maior ou menor com frequência | Heap / priority queue |
| Relações e caminhos | Grafo |

Não decora isso como mantra.

Usa como mapa inicial.

## Complexidade: o mínimo que você precisa sentir

Você não precisa decorar cem tabelas agora.

Mas precisa sentir a diferença entre:

- acessar direto
- buscar item por item
- inserir no começo
- inserir no meio
- remover da frente

Tabela simplificada:

| Estrutura | Acesso por índice | Busca por chave/valor | Inserção no fim | Inserção no começo | Observação |
|---|---|---|---|---|---|
| Array / lista dinâmica | bom | normalmente linear | bom amortizado | ruim | ótima para sequência |
| Lista ligada | ruim | linear | bom se tiver ponteiro certo | bom | ruim para índice |
| Stack | topo apenas | não é foco | push/pop bons | n/a | LIFO |
| Queue | frente e fim | não é foco | enqueue/dequeue bons | n/a | FIFO |
| Map / hash map | n/a | normalmente muito bom | muito bom | n/a | chave -> valor |
| Set | n/a | muito bom para existência | muito bom | n/a | unicidade |
| Heap | não é para índice arbitrário | topo muito bom | inserção boa | n/a | prioridade |
| Grafo | depende da representação | depende | depende | depende | modela relações |

Agora vamos para o que interessa de verdade: estrutura por estrutura.

## Array e lista dinâmica

Array é uma coleção de elementos armazenados em sequência.

Em baixo nível, a ideia forte é:

```text
os elementos ficam em posições contíguas na memória
```

### Diagrama mental

```text
Índice:   0    1    2    3
        +----+----+----+----+
Valor:  | 10 | 20 | 30 | 40 |
        +----+----+----+----+
```

Se o elemento tem tamanho fixo, acessar o índice `i` é muito natural.

### Quando array/lista brilha

- a ordem importa
- você percorre muito
- acesso por índice faz sentido
- append no fim resolve grande parte do problema

### Quando começa a doer

- você precisa inserir no meio o tempo todo
- você remove da frente o tempo todo
- você vive procurando por ID dentro da lista

## Exemplo em C

Em C, array é estrutura base.

```c
#include <stdio.h>

int main(void) {
    int numbers[4] = {10, 20, 30, 40};

    printf("%d\n", numbers[0]); // 10
    printf("%d\n", numbers[2]); // 30

    for (int i = 0; i < 4; i++) {
        printf("%d ", numbers[i]);
    }

    return 0;
}
```

### Memória conceitual

```text
base -> +----+----+----+----+
        | 10 | 20 | 30 | 40 |
        +----+----+----+----+
          ^    ^    ^    ^
        +0   +4   +8   +12   (exemplo com int de 4 bytes)
```

## Exemplo em C++ com `std::vector`

`std::vector` é a lista dinâmica mais comum no dia a dia em C++.

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers = {10, 20, 30};

    numbers.push_back(40);

    for (int value : numbers) {
        std::cout << value << ' ';
    }
}
```

## Exemplo em JavaScript

```js
const numbers = [10, 20, 30];

numbers.push(40);

console.log(numbers[1]); // 20
console.log(numbers);    // [10, 20, 30, 40]
```

## Exemplo em Python

```python
numbers = [10, 20, 30]
numbers.append(40)

print(numbers[1])  # 20
print(numbers)     # [10, 20, 30, 40]
```

## Inserção no meio: por que custa

Se você precisa inserir no índice 1:

```text
Antes:
[10, 20, 30, 40]

Inserir 99 em 1

Depois:
[10, 99, 20, 30, 40]
```

Os elementos seguintes precisam ser deslocados.

Diagrama:

```text
Índice:   0    1    2    3
Antes:   10   20   30   40

Índice:   0    1    2    3    4
Depois:  10   99   20   30   40
```

Isso explica por que array não é rei universal.

## Lista ligada

Lista ligada resolve outro tipo de dor.

Em vez de guardar tudo contíguo, você encadeia nós.

Cada nó costuma guardar:

- valor
- ponteiro para o próximo

### Diagrama

```text
+------+-------+    +------+-------+    +------+------+
| 10   | next -|--->| 20   | next -|--->| 30   | null |
+------+-------+    +------+-------+    +------+------+
```

### O que ela ganha

- inserir ou remover um nó conhecido pode ser barato
- boa para estruturas montadas por encadeamento

### O que ela perde

- acesso por índice é ruim
- usa ponteiros extras
- cache locality costuma ser pior que array

## Implementação simples de lista ligada em C

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value;
    struct Node* next;
} Node;

Node* create_node(int value) {
    Node* node = (Node*)malloc(sizeof(Node));
    node->value = value;
    node->next = NULL;
    return node;
}

void append(Node** head, int value) {
    Node* new_node = create_node(value);

    if (*head == NULL) {
        *head = new_node;
        return;
    }

    Node* current = *head;
    while (current->next != NULL) {
        current = current->next;
    }

    current->next = new_node;
}

void print_list(Node* head) {
    Node* current = head;
    while (current != NULL) {
        printf("%d -> ", current->value);
        current = current->next;
    }
    printf("NULL\n");
}

int main(void) {
    Node* head = NULL;

    append(&head, 10);
    append(&head, 20);
    append(&head, 30);

    print_list(head);
    return 0;
}
```

## Stack

Stack segue LIFO:

```text
Last In, First Out
```

Ou seja:

- o último que entra é o primeiro que sai

### Diagrama

```text
topo
 |
 v
+----+
| 30 |
+----+
| 20 |
+----+
| 10 |
+----+
```

### Onde stack aparece de verdade

- desfazer ação
- histórico
- parsing de expressões
- validação de parênteses
- chamada de funções
- DFS iterativo

## Implementação de stack com array em C

```c
#include <stdbool.h>
#include <stdio.h>

#define MAX 5

typedef struct {
    int items[MAX];
    int top;
} Stack;

void init_stack(Stack* s) {
    s->top = -1;
}

bool is_empty(Stack* s) {
    return s->top == -1;
}

bool is_full(Stack* s) {
    return s->top == MAX - 1;
}

bool push(Stack* s, int value) {
    if (is_full(s)) {
        return false;
    }

    s->items[++s->top] = value;
    return true;
}

bool pop(Stack* s, int* removed) {
    if (is_empty(s)) {
        return false;
    }

    *removed = s->items[s->top--];
    return true;
}

int main(void) {
    Stack s;
    int removed;

    init_stack(&s);
    push(&s, 10);
    push(&s, 20);
    push(&s, 30);

    pop(&s, &removed);
    printf("%d\n", removed); // 30
    return 0;
}
```

## Stack em JavaScript

Em JavaScript, array já resolve bem stack:

```js
const stack = [];

stack.push(10);
stack.push(20);
stack.push(30);

console.log(stack.pop()); // 30
console.log(stack.pop()); // 20
```

## Queue

Queue segue FIFO:

```text
First In, First Out
```

Ou seja:

- o primeiro que entra é o primeiro que sai

### Diagrama

```text
entrada -> [10] [20] [30] -> saida
```

### Onde queue aparece

- fila de atendimento
- processamento assíncrono
- jobs pendentes
- eventos
- BFS

## Queue com buffer circular em C

Isso é importante porque `shift` de array ou remoção da frente pode custar caro.

```c
#include <stdbool.h>
#include <stdio.h>

#define MAX 5

typedef struct {
    int items[MAX];
    int front;
    int rear;
    int size;
} Queue;

void init_queue(Queue* q) {
    q->front = 0;
    q->rear = 0;
    q->size = 0;
}

bool enqueue(Queue* q, int value) {
    if (q->size == MAX) {
        return false;
    }

    q->items[q->rear] = value;
    q->rear = (q->rear + 1) % MAX;
    q->size++;
    return true;
}

bool dequeue(Queue* q, int* removed) {
    if (q->size == 0) {
        return false;
    }

    *removed = q->items[q->front];
    q->front = (q->front + 1) % MAX;
    q->size--;
    return true;
}

int main(void) {
    Queue q;
    int removed;

    init_queue(&q);
    enqueue(&q, 10);
    enqueue(&q, 20);
    enqueue(&q, 30);

    dequeue(&q, &removed);
    printf("%d\n", removed); // 10
    return 0;
}
```

## Queue e deque em Python

Para fila real em Python, `collections.deque` costuma ser melhor que lista comum.

```python
from collections import deque

queue = deque()
queue.append(10)
queue.append(20)
queue.append(30)

print(queue.popleft())  # 10
```

Deque significa double-ended queue.

Ou seja, você trabalha bem nas duas pontas.

```python
from collections import deque

dq = deque([10, 20, 30])
dq.appendleft(5)
dq.append(40)

print(dq)  # deque([5, 10, 20, 30, 40])
```

## Map, dicionário, hash map

Aqui entra uma das estruturas mais valiosas do mundo real.

Map resolve:

```text
chave -> valor
```

Exemplos:

- `idUsuario -> usuario`
- `email -> conta`
- `palavra -> frequencia`
- `sku -> produto`

### Por que ele é tão forte

Porque muita aplicação do dia a dia é lookup por chave.

Se você usa lista para isso, fica assim:

```text
procura item por item
de novo
e de novo
e de novo
```

Com map, a intenção fica muito mais clara.

## Ideia de hash table

Por baixo, muitos maps usam tabela hash.

Mentalmente:

1. pega a chave
2. calcula um hash
3. usa isso para decidir onde armazenar

Diagrama simplificado:

```text
"ana"  -> hash -> bucket 2
"bia"  -> hash -> bucket 5
"leo"  -> hash -> bucket 2
```

Quando duas chaves caem no mesmo bucket, existe colisão.

E aí a implementação resolve isso com alguma estratégia.

## `unordered_map` em C++

```cpp
#include <iostream>
#include <string>
#include <unordered_map>

int main() {
    std::unordered_map<std::string, int> scores;

    scores["ana"] = 95;
    scores["bia"] = 88;

    std::cout << scores["ana"] << '\n'; // 95
}
```

## `Map` em JavaScript

```js
const users = new Map();

users.set("u1", { name: "Ana" });
users.set("u2", { name: "Leo" });

console.log(users.get("u1")); // { name: "Ana" }
console.log(users.has("u3")); // false
```

## `dict` em Python

```python
scores = {
    "ana": 95,
    "bia": 88,
}

print(scores["ana"])     # 95
print("leo" in scores)   # False
```

## Frequência com map: padrão muito importante

```python
text = "banana"
freq = {}

for letter in text:
    freq[letter] = freq.get(letter, 0) + 1

print(freq)
```

Saída:

```text
{'b': 1, 'a': 3, 'n': 2}
```

Isso aparece em:

- contagem
- deduplicação
- agrupamento
- análise de logs

## Set

Set é para quando a pergunta principal é:

```text
isso já existe?
```

Ou:

```text
preciso impedir repetição
```

### Diagrama conceitual

```text
Entrada:  [10, 20, 20, 30, 10]
Set:      {10, 20, 30}
```

### Onde set brilha

- remover duplicados
- impedir reprocessamento
- rastrear itens vistos
- membership test rápido

## `set` em Python

```python
values = [10, 20, 20, 30, 10]
unique = set(values)

print(unique)  # {10, 20, 30}
print(20 in unique)  # True
```

## `Set` em JavaScript

```js
const values = [10, 20, 20, 30, 10];
const unique = new Set(values);

console.log(unique);        // Set(3) { 10, 20, 30 }
console.log(unique.has(20)); // true
```

## Árvore

Árvore aparece quando existe hierarquia.

Exemplos:

- DOM
- sistema de arquivos
- categorias
- AST de compilador
- menu com níveis

### Diagrama de árvore binária

```text
        8
      /   \
     3     10
    / \      \
   1   6      14
```

### Conceitos básicos

- raiz
- nó
- filho
- pai
- folha
- altura

## BST: Binary Search Tree

Em uma BST:

- esquerda < nó
- direita > nó

Isso ajuda busca ordenada, mas o desempenho depende do balanceamento.

## Implementação simples de BST em C++

```cpp
#include <iostream>

struct Node {
    int value;
    Node* left;
    Node* right;

    Node(int v) : value(v), left(nullptr), right(nullptr) {}
};

Node* insert(Node* root, int value) {
    if (root == nullptr) {
        return new Node(value);
    }

    if (value < root->value) {
        root->left = insert(root->left, value);
    } else {
        root->right = insert(root->right, value);
    }

    return root;
}

void inorder(Node* root) {
    if (root == nullptr) {
        return;
    }

    inorder(root->left);
    std::cout << root->value << ' ';
    inorder(root->right);
}

int main() {
    Node* root = nullptr;
    root = insert(root, 8);
    root = insert(root, 3);
    root = insert(root, 10);
    root = insert(root, 1);
    root = insert(root, 6);

    inorder(root); // 1 3 6 8 10
}
```

## Heap e priority queue

Heap é estrutura para prioridade.

Não é "árvore qualquer".

É árvore com regra de heap.

### Min-heap

Cada pai é menor ou igual aos filhos.

### Diagrama

```text
        2
      /   \
     5     8
    / \
   9  12
```

O ponto forte é:

```text
pegar rapidamente o menor
ou o maior, dependendo da variante
```

### Onde heap aparece

- escalonamento
- top K
- filas de prioridade
- merge de streams
- menor custo repetido

## Heap em Python com `heapq`

```python
import heapq

heap = []
heapq.heappush(heap, 8)
heapq.heappush(heap, 3)
heapq.heappush(heap, 5)

print(heapq.heappop(heap))  # 3
print(heapq.heappop(heap))  # 5
```

## Priority queue em C++

Por padrão, `priority_queue` entrega o maior no topo.

```cpp
#include <iostream>
#include <queue>

int main() {
    std::priority_queue<int> pq;

    pq.push(8);
    pq.push(3);
    pq.push(10);

    std::cout << pq.top() << '\n'; // 10
}
```

## Grafo

Grafo entra quando o problema é relação.

Exemplos:

- rede social
- rotas
- dependências
- recomendação
- malha de serviços

### Diagrama simples

```text
A ---- B
|      |
|      |
C ---- D
```

### Representação por lista de adjacência

```text
A: [B, C]
B: [A, D]
C: [A, D]
D: [B, C]
```

Essa representação costuma ser muito útil porque é clara e economiza espaço em vários cenários.

## Grafo em Python

```python
graph = {
    "A": ["B", "C"],
    "B": ["A", "D"],
    "C": ["A", "D"],
    "D": ["B", "C"],
}

for neighbor in graph["A"]:
    print(neighbor)
```

## BFS em JavaScript

```js
const graph = {
  A: ["B", "C"],
  B: ["D"],
  C: ["D"],
  D: [],
};

function bfs(start) {
  const queue = [start];
  const visited = new Set([start]);

  while (queue.length > 0) {
    const node = queue.shift();
    console.log(node);

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}

bfs("A");
```

## Como escolher a estrutura certa no mundo real

### Cenário 1: catálogo por ID

Se você faz isso:

```text
lista de produtos
e toda hora procura por id
```

Provavelmente quer map.

### Cenário 2: feed em ordem

Se o importante é percorrer em sequência e renderizar:

Provavelmente quer array/lista.

### Cenário 3: histórico de navegação

Você quer voltar para o anterior.

Provavelmente quer stack.

### Cenário 4: fila de jobs

Você quer processar na ordem de chegada.

Provavelmente quer queue.

### Cenário 5: impedir duplicidade

Você quer saber se já viu um item.

Provavelmente quer set.

### Cenário 6: menor prazo primeiro

Você quer sempre puxar o item mais urgente.

Provavelmente quer heap / priority queue.

### Cenário 7: dependência entre módulos

Você quer modelar conexões.

Provavelmente quer grafo.

## Sinais de que a estrutura está errada

- você vive fazendo busca linear na mesma coleção
- todo arquivo recria o mesmo índice manualmente
- seu código usa lista para tudo
- você duplicou os dados em duas ou três coleções sem estratégia
- a regra de acesso está escondida em `find`, `filter`, `some` o tempo todo

## Erros comuns

- escolher estrutura pelo nome bonito
- usar map quando lista resolveria melhor
- usar lista para lookup por chave em volume alto
- esquecer o custo de remover da frente
- confundir "funcionou" com "está bem modelado"
- espalhar manipulação da estrutura pelo sistema inteiro

## Encapsular ainda importa

Mesmo com estrutura boa, não espalha manipulação crua pelo projeto.

Melhor:

- `addOrder(order)`
- `findOrderById(id)`
- `markOrderProcessed(id)`

Pior:

- cada arquivo mexendo direto no mesmo array, map e set

Estrutura boa + API clara = projeto muito mais sustentável.

## Exercícios de alto valor

1. implementar stack com array
2. implementar queue com buffer circular
3. contar frequência de palavras com map
4. remover duplicados com set
5. construir lista ligada simples
6. implementar BST básica
7. usar heap para top 3 menores valores
8. modelar um grafo com lista de adjacência

Para cada exercício, responde:

1. qual operação essa estrutura favorece?
2. o que ela faz mal?
3. por que escolhi isso em vez de lista comum?
4. como eu explicaria essa escolha numa entrevista ou review?

## Checklist forte de estruturas de dados

- Você sabe quando array ganha de lista ligada?
- Você entende por que stack e queue existem mesmo podendo usar array?
- Você sabe quando map é mais adequado que lista?
- Você sabe quando set evita bug e simplifica lógica?
- Você entende a ideia básica de árvore, heap e grafo?
- Você consegue justificar escolha pela operação dominante?

Se sim, sua base de modelagem já está saindo do nível tutorial.

## Próximas ações

- Se a base de raciocínio ainda trava, revise [Lógica de Programação](/pt/reference/logica-de-programacao/)
- Se você quer pensar em solução e custo, siga para [Algoritmos](/pt/reference/algoritmos/)
- Se quiser reforçar representação em baixo nível, revise [Tipos de Dados](/pt/reference/tipos-de-dados/)
