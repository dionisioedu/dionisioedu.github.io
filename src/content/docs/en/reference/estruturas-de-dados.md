---
title: Data Structures
description: Understand arrays, linked lists, stacks, queues, maps, sets, trees, heaps, and graphs with diagrams, selection criteria, and many examples in C, C++, JavaScript, and Python.
---

Data structure is not a side detail.

It is the way you decide to organize the world inside the program.

And that changes everything.

The same business rule can become:

- simple, direct code
- or a Frankenstein full of slow lookups, patches, and duplicated state

If you want to stop solving everything with "whatever works for now," this is one of the most important reference pages in the portal.

## The right question is not "which structure is best?"

The right question is:

**which operation dominates this problem?**

Because data structures are not chosen by fashion.

You choose them based on the main pressure of the real case:

- do I need index access?
- do I need key lookup?
- do I need uniqueness?
- do I need arrival order?
- do I need priority?
- do I need to represent relationships?

Once you learn this, data stops feeling like shapeless mass.

## What a data structure actually is

A data structure is an organized way of storing values so certain operations become easier.

Every structure has strengths and weaknesses.

In other words:

```text
a structure that is great for one operation
may be poor for another
```

Classic example:

- array is great for index access
- map is great for key lookup
- queue is great for arrival order
- heap is great for priority

There is no magic structure.

There is coherent selection.

## Data structure versus algorithm

This distinction matters a lot.

### Data structure

Answers:

```text
how is the data organized?
```

### Algorithm

Answers:

```text
how do I transform this data to reach the result?
```

They work together.

Example:

- structure: `Map`
- algorithm: search, update, frequency counting

Without a good structure, the algorithm struggles.

Without a good algorithm, structure alone does not save you.

## The mental model that actually helps

Before choosing a structure, answer:

1. Which operation happens most often?
2. Does order matter?
3. Is access by index, key, priority, or relationship?
4. Will I insert and remove a lot?
5. Do I need uniqueness?
6. Will I scan everything or fetch one specific item?

That already solves most decisions.

## Fast mental table

| Main situation | Structure that usually fits |
|---|---|
| Order and index | Array / list |
| Local insert/remove with pointers | Linked list |
| Undo, history, parsing | Stack |
| Arrival order | Queue |
| Work from both ends | Deque |
| Lookup by key | Map / dictionary / hash map |
| Guarantee uniqueness | Set |
| Hierarchy | Tree |
| Frequent min/max access | Heap / priority queue |
| Relationships and paths | Graph |

Do not memorize this as a ritual.

Use it as a starting map.

## Complexity: the minimum you need to feel

You do not need to memorize a hundred tables right now.

But you do need to feel the difference between:

- direct access
- item-by-item search
- insertion at the front
- insertion in the middle
- removing from the front

Simplified table:

| Structure | Index access | Key/value lookup | Insert at end | Insert at front | Main note |
|---|---|---|---|---|---|
| Array / dynamic list | good | usually linear | good amortized | poor | great for sequence |
| Linked list | poor | linear | good with the right pointer | good | poor for index access |
| Stack | top only | not the point | push/pop are good | n/a | LIFO |
| Queue | front and back | not the point | enqueue/dequeue are good | n/a | FIFO |
| Map / hash map | n/a | usually very good | very good | n/a | key -> value |
| Set | n/a | very good for existence | very good | n/a | uniqueness |
| Heap | not for arbitrary indexing | top is very good | insertion is good | n/a | priority |
| Graph | depends on representation | depends | depends | depends | models relationships |

Now let us get into the real value: structure by structure.

## Array and dynamic list

An array is a collection of elements stored in sequence.

At a low level, the strong idea is:

```text
elements live in contiguous memory positions
```

### Mental diagram

```text
Index:    0    1    2    3
        +----+----+----+----+
Value:  | 10 | 20 | 30 | 40 |
        +----+----+----+----+
```

If the element has fixed size, accessing index `i` is very natural.

### When array/list shines

- order matters
- you iterate a lot
- index access makes sense
- append at the end solves most of the job

### When it starts to hurt

- you insert in the middle all the time
- you keep removing from the front
- you constantly search by ID inside the list

## Example in C

In C, array is a core structure.

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

### Conceptual memory

```text
base -> +----+----+----+----+
        | 10 | 20 | 30 | 40 |
        +----+----+----+----+
          ^    ^    ^    ^
        +0   +4   +8   +12   (example with 4-byte int)
```

## Example in C++ with `std::vector`

`std::vector` is the most common dynamic list in everyday C++.

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

## Example in JavaScript

```js
const numbers = [10, 20, 30];

numbers.push(40);

console.log(numbers[1]); // 20
console.log(numbers);    // [10, 20, 30, 40]
```

## Example in Python

```python
numbers = [10, 20, 30]
numbers.append(40)

print(numbers[1])  # 20
print(numbers)     # [10, 20, 30, 40]
```

## Insertion in the middle: why it costs

If you need to insert at index 1:

```text
Before:
[10, 20, 30, 40]

Insert 99 at 1

After:
[10, 99, 20, 30, 40]
```

Following elements must shift.

Diagram:

```text
Index:    0    1    2    3
Before:  10   20   30   40

Index:    0    1    2    3    4
After:   10   99   20   30   40
```

That is why arrays are not universal kings.

## Linked list

A linked list solves a different kind of pressure.

Instead of storing everything contiguously, it chains nodes.

Each node usually stores:

- value
- pointer to the next node

### Diagram

```text
+------+-------+    +------+-------+    +------+------+
| 10   | next -|--->| 20   | next -|--->| 30   | null |
+------+-------+    +------+-------+    +------+------+
```

### What it gains

- inserting or removing a known node can be cheap
- useful for pointer-based structures

### What it loses

- index access is poor
- extra pointer memory exists
- cache locality is often worse than arrays

## Simple linked list implementation in C

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

A stack follows LIFO:

```text
Last In, First Out
```

That means:

- the last item in is the first item out

### Diagram

```text
top
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

### Where stack really appears

- undo actions
- history
- expression parsing
- parentheses validation
- function calls
- iterative DFS

## Stack implementation with array in C

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

## Stack in JavaScript

In JavaScript, array already works well as a stack:

```js
const stack = [];

stack.push(10);
stack.push(20);
stack.push(30);

console.log(stack.pop()); // 30
console.log(stack.pop()); // 20
```

## Queue

A queue follows FIFO:

```text
First In, First Out
```

That means:

- the first item in is the first item out

### Diagram

```text
input -> [10] [20] [30] -> output
```

### Where queue appears

- service queues
- async processing
- pending jobs
- events
- BFS

## Queue with circular buffer in C

This matters because removing from the front of a plain array can be expensive.

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

## Queue and deque in Python

For real queue behavior in Python, `collections.deque` is usually better than a regular list.

```python
from collections import deque

queue = deque()
queue.append(10)
queue.append(20)
queue.append(30)

print(queue.popleft())  # 10
```

Deque means double-ended queue.

That means working efficiently from both ends.

```python
from collections import deque

dq = deque([10, 20, 30])
dq.appendleft(5)
dq.append(40)

print(dq)  # deque([5, 10, 20, 30, 40])
```

## Map, dictionary, hash map

This is one of the highest-value structures in real software.

Map solves:

```text
key -> value
```

Examples:

- `userId -> user`
- `email -> account`
- `word -> frequency`
- `sku -> product`

### Why it is so strong

Because a lot of day-to-day software is really about key lookup.

If you use a list for that, the pattern becomes:

```text
scan item by item
again
and again
and again
```

With a map, the intent becomes much clearer.

## The hash table idea

Under the hood, many maps use a hash table.

Mentally:

1. take the key
2. compute a hash
3. use that to decide where to store the value

Simplified diagram:

```text
"ana"  -> hash -> bucket 2
"bia"  -> hash -> bucket 5
"leo"  -> hash -> bucket 2
```

When two keys land in the same bucket, you have a collision.

Then the implementation resolves it with a strategy.

## `unordered_map` in C++

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

## `Map` in JavaScript

```js
const users = new Map();

users.set("u1", { name: "Ana" });
users.set("u2", { name: "Leo" });

console.log(users.get("u1")); // { name: "Ana" }
console.log(users.has("u3")); // false
```

## `dict` in Python

```python
scores = {
    "ana": 95,
    "bia": 88,
}

print(scores["ana"])    # 95
print("leo" in scores)  # False
```

## Frequency counting with map: a very important pattern

```python
text = "banana"
freq = {}

for letter in text:
    freq[letter] = freq.get(letter, 0) + 1

print(freq)
```

Output:

```text
{'b': 1, 'a': 3, 'n': 2}
```

This pattern appears in:

- counting
- deduplication
- grouping
- log analysis

## Set

Set is for when the main question is:

```text
has this already appeared?
```

Or:

```text
do I need to prevent repetition?
```

### Conceptual diagram

```text
Input:  [10, 20, 20, 30, 10]
Set:    {10, 20, 30}
```

### Where set shines

- removing duplicates
- preventing reprocessing
- tracking seen items
- fast membership test

## `set` in Python

```python
values = [10, 20, 20, 30, 10]
unique = set(values)

print(unique)         # {10, 20, 30}
print(20 in unique)   # True
```

## `Set` in JavaScript

```js
const values = [10, 20, 20, 30, 10];
const unique = new Set(values);

console.log(unique);         // Set(3) { 10, 20, 30 }
console.log(unique.has(20)); // true
```

## Tree

A tree appears when hierarchy exists.

Examples:

- DOM
- file system
- categories
- compiler AST
- nested menus

### Binary tree diagram

```text
        8
      /   \
     3     10
    / \      \
   1   6      14
```

### Basic concepts

- root
- node
- child
- parent
- leaf
- height

## BST: Binary Search Tree

In a BST:

- left < node
- right > node

That helps ordered searching, but performance depends on balance.

## Simple BST implementation in C++

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

## Heap and priority queue

A heap is a priority structure.

It is not just "some tree."

It is a tree with a heap rule.

### Min-heap

Each parent is smaller than or equal to its children.

### Diagram

```text
        2
      /   \
     5     8
    / \
   9  12
```

The strong point is:

```text
get the smallest
or the largest, depending on the variant
```

### Where heap appears

- scheduling
- top K
- priority queues
- stream merging
- repeated minimum-cost extraction

## Heap in Python with `heapq`

```python
import heapq

heap = []
heapq.heappush(heap, 8)
heapq.heappush(heap, 3)
heapq.heappush(heap, 5)

print(heapq.heappop(heap))  # 3
print(heapq.heappop(heap))  # 5
```

## Priority queue in C++

By default, `priority_queue` gives you the largest item first.

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

## Graph

Graph enters when the problem is about relationships.

Examples:

- social networks
- routes
- dependencies
- recommendations
- service mesh

### Simple diagram

```text
A ---- B
|      |
|      |
C ---- D
```

### Adjacency list representation

```text
A: [B, C]
B: [A, D]
C: [A, D]
D: [B, C]
```

This representation is often useful because it is clear and space-efficient in many scenarios.

## Graph in Python

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

## BFS in JavaScript

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

## How to choose the right structure in the real world

### Scenario 1: catalog by ID

If you have this:

```text
list of products
and you keep searching by id
```

You probably want a map.

### Scenario 2: ordered feed

If the main job is sequential traversal and rendering:

You probably want an array/list.

### Scenario 3: navigation history

You want to go back to the previous item.

You probably want a stack.

### Scenario 4: job queue

You want arrival-order processing.

You probably want a queue.

### Scenario 5: duplicate prevention

You want to know whether an item was already seen.

You probably want a set.

### Scenario 6: earliest deadline first

You always want the most urgent item next.

You probably want a heap / priority queue.

### Scenario 7: module dependencies

You need to model connections.

You probably want a graph.

## Signs the structure is wrong

- you keep doing linear search on the same collection
- every file recreates the same index manually
- your code uses lists for everything
- you duplicated the same data in multiple collections without a strategy
- access rules are hidden behind `find`, `filter`, `some` all the time

## Common mistakes

- choosing a structure because the name sounds advanced
- using a map when a list would be clearer
- using a list for key lookup at high volume
- forgetting the cost of removing from the front
- confusing "it works" with "it is well modeled"
- spreading raw structure manipulation across the system

## Encapsulation still matters

Even with a good structure, do not spread raw manipulation across the project.

Better:

- `addOrder(order)`
- `findOrderById(id)`
- `markOrderProcessed(id)`

Worse:

- every file touching the same array, map, and set directly

Good structure + clear API = much more sustainable software.

## High-value exercises

1. implement a stack with array
2. implement a queue with circular buffer
3. count word frequency with map
4. remove duplicates with set
5. build a simple linked list
6. implement a basic BST
7. use a heap for the top 3 smallest values
8. model a graph with adjacency list

For each exercise, answer:

1. which operation does this structure favor?
2. what does it do badly?
3. why did I choose it instead of a plain list?
4. how would I explain this choice in an interview or review?

## Strong data-structure checklist

- Do you know when array beats linked list?
- Do you understand why stack and queue exist even though arrays exist?
- Do you know when map is more appropriate than list?
- Do you know when set prevents bugs and simplifies logic?
- Do you understand the basic idea of tree, heap, and graph?
- Can you justify your choice based on the dominant operation?

If yes, your modeling foundation is already leaving tutorial level.

## Next actions

- If the reasoning base still feels shaky, review [Programming Logic](/en/reference/logica-de-programacao/)
- If you want to think more about solution quality and cost, continue to [Algorithms](/en/reference/algoritmos/)
- If you want to strengthen low-level representation, revisit [Data Types](/en/reference/tipos-de-dados/)
