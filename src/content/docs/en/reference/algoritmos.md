---
title: Algorithms
description: Understand how to build correct and efficient solutions with search, sorting, BFS, DFS, Dijkstra, sliding windows, two pointers, and many working examples in C, C++, JavaScript, and Python.
---

An algorithm is the way you transform a problem into a sequence of steps that actually reaches the result.

There is an important detail here:

professional programming is not "make it run somehow."

It is making it run in a way that is:

- correct
- explainable
- testable
- viable as input grows

If data structures are how you organize the world, algorithms are how you move through it.

## The truth many people learn too late

A lot of people think algorithms are about:

- LeetCode
- interviews
- "artificial problems"
- academic exercises

That is a shallow view.

Algorithms show up constantly in real software:

- finding items
- sorting feeds
- filtering results
- counting frequency
- traversing UI trees
- finding routes
- prioritizing work
- walking dependencies

Once you really understand algorithms, you stop programming by improvisation.

## What an algorithm actually is

An algorithm is a finite, clear, executable process used to solve a problem.

Notice the key words:

- **finite**: it must terminate
- **clear**: it cannot be ambiguous
- **executable**: a machine can follow it
- **solve a problem**: looking smart is not enough

In short:

```text
input -> transformation -> output
```

But a strong algorithm is not only "a set of steps."

It also respects:

- correctness
- cost
- clarity
- robustness

## Correctness comes before performance

This point is fundamental.

Many people want to jump straight into Big-O, optimization, and "elegant solutions."

But:

**a fast wrong answer is still wrong.**

The healthy order is:

1. understand the problem
2. build a correct solution
3. validate simple and edge cases
4. only then improve cost

## How to think before implementing

Before opening the editor, answer:

1. what is the input?
2. what is the output?
3. what constraints exist?
4. what is already sorted, grouped, or structured?
5. what is the smallest example that proves the idea?
6. what can break?

If you skip this, you usually fall into two traps:

- writing a lot of code without direction
- optimizing the wrong solution

## The problem-solving model

Almost every algorithm problem can be approached like this:

```text
Understand the statement
        |
        v
Build a manual example
        |
        v
Find the pattern
        |
        v
Write pseudocode
        |
        v
Implement
        |
        v
Test and refine
```

This flow looks simple, but it saves a lot of pain.

## Dry run: execute by hand before trusting it

Example:

```text
Problem: find the largest value in a list

List: [4, 9, 2, 7]
```

Idea:

```text
1. assume the first value is the largest
2. compare with the next values
3. if a larger one appears, update
```

Dry run:

```text
Start:
largest = 4

Compare with 9:
9 > 4 ? yes
largest = 9

Compare with 2:
2 > 9 ? no
largest stays 9

Compare with 7:
7 > 9 ? no
largest stays 9
```

If you cannot execute it manually, you still do not understand the solution.

## Complexity: the minimum you need to feel

You do not need to memorize everything yet.

But you do need to feel the difference between:

- `O(1)`: constant cost
- `O(log n)`: slow growth
- `O(n)`: grows with the input
- `O(n log n)`: common in strong algorithms
- `O(n²)`: starts hurting fast

### Fast mental table

| Complexity | Practical intuition |
|---|---|
| `O(1)` | direct access, ideal lookup |
| `O(log n)` | cut the problem into parts |
| `O(n)` | one pass over the collection |
| `O(n log n)` | healthy pattern for general sorting |
| `O(n²)` | too much comparison over too much comparison |

Practical rule:

- if you have nested loops over the same input, pay attention
- if you make one pass and use an intelligent helper structure, things usually improve a lot

## Important algorithm families

Before concrete examples, it helps to see the main families.

### Brute force

Try everything or compare everything.

Good when:

- the input is small
- you want to validate correctness first

### Divide and conquer

Break the problem into smaller pieces.

Examples:

- binary search
- merge sort
- quicksort

### Greedy

Make the best local choice at each step.

Sometimes it is perfect.

Sometimes it fails badly.

### Dynamic programming

Store partial results so you do not recompute work.

### Traversal

Walk through structures like trees and graphs.

Examples:

- DFS
- BFS

### Shortest path

Find an optimal route under some cost rule.

Classic example:

- Dijkstra

## Linear search

Linear search is the simplest search algorithm.

Idea:

```text
scan element by element
if you find it, stop
if you finish, it is not there
```

### When to use it

- small collection
- unsorted data
- simplicity matters more than sophistication

### Diagram

```text
List: [4, 8, 15, 16, 23, 42]
Target: 16

4  -> no
8  -> no
15 -> no
16 -> found
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

## Binary search

Binary search is already a different level of reasoning.

It only works when the collection is sorted.

That precondition is everything.

### Idea

Instead of checking item by item, you compare against the middle and discard half the space.

### Diagram

```text
List: [2, 4, 6, 8, 10, 12, 14]
Target: 10

Middle = 8
10 > 8 -> discard left half

Left: [10, 12, 14]
Middle = 12
10 < 12 -> discard right half

Left: [10]
Found
```

### Pseudocode

```text
left = 0
right = size - 1

while left <= right
    mid = (left + right) / 2

    if arr[mid] == target
        found
    else if target < arr[mid]
        right = mid - 1
    else
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

### Classic mistake

Using binary search on unsorted data.

That does not just make it "less efficient."

It breaks the logic.

## Sorting: why it matters so much

Sorting is not just about making data "look nicer."

Sorting changes:

- search
- display
- grouping
- deduplication
- analysis

When data is sorted, many problems become easier to solve.

## Bubble sort

Bubble sort is not the king of production.

But it is excellent for learning:

- comparison
- swapping
- repeated passes

### Idea

Compare neighbors and swap when out of order.

### Diagram

```text
[5, 3, 8, 4]

5 and 3 -> swap -> [3, 5, 8, 4]
5 and 8 -> ok   -> [3, 5, 8, 4]
8 and 4 -> swap -> [3, 5, 4, 8]
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

### When to remember it

- study
- teaching
- tiny inputs

But in general, it loses to better sorting algorithms.

## Insertion sort

Insertion sort is great for teaching the idea of "keep part of the array sorted."

### Idea

You walk through the array and insert each element into the correct position inside the already sorted part.

### Diagram

```text
[5, 3, 8, 4]

Sorted part: [5]
Insert 3 -> [3, 5]
Insert 8 -> [3, 5, 8]
Insert 4 -> [3, 4, 5, 8]
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

### Where it still matters

- small arrays
- nearly sorted data
- sorting education

## Merge sort

Now we move into a truly strong algorithm.

Merge sort uses divide and conquer.

### Idea

1. split the array into smaller parts
2. sort the parts
3. merge the already sorted parts

### Diagram

```text
[8, 3, 5, 4]
   /       \
[8, 3]    [5, 4]
 /   \     /   \
[8] [3]  [5]  [4]

Merge:
[3, 8] and [4, 5]

Result:
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

### Why it matters

- strong general complexity
- elegant recursion and merging logic
- excellent to understand divide and conquer

## Quicksort

Quicksort also uses divide and conquer, but in a different way.

### Idea

1. choose a pivot
2. split smaller and larger values around it
3. recursively sort the sides

### Diagram

```text
[8, 3, 5, 4]
pivot = 5

smaller: [3, 4]
pivot:   [5]
larger:  [8]

result:
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

### Important note

Quicksort is highly relevant, but pivot choice matters.

A bad pivot can degrade performance badly.

## BFS: breadth-first search

BFS traverses by levels.

It uses a queue.

### Where it appears

- shortest path in unweighted graphs
- layer-by-layer distance
- breadth traversal

### Diagram

```text
    A
   / \
  B   C
 / \   \
D   E   F

BFS from A:
A -> B -> C -> D -> E -> F
```

### Graph representation

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

## DFS: depth-first search

DFS goes deep before coming back.

It can be implemented:

- with recursion
- with an explicit stack

### Diagram

Using the same graph:

```text
    A
   / \
  B   C
 / \   \
D   E   F

One possible DFS:
A -> B -> D -> E -> C -> F
```

### Recursive DFS in Python

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

### Iterative DFS in C++

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

### When to use BFS or DFS

Use BFS when:

- you want level-order exploration
- you want shortest path in an unweighted graph

Use DFS when:

- you want to go deep first
- you want path exploration
- you want cycle or component traversal

## Dijkstra

Dijkstra is one of the most important algorithms for shortest path with positive weights.

### Problem it solves

```text
What is the minimum-cost path from A to all other nodes?
```

### Important requirement

Weights must be non-negative.

### Example weighted graph

```text
A --1--> B
A --4--> C
B --2--> C
B --5--> D
C --1--> D
```

### Intuition

1. start with zero distance at the source
2. assume infinity for the rest
3. always expand the node with the smallest known distance
4. relax the edges

### Distance diagram

```text
Start:
A = 0
B = inf
C = inf
D = inf

After processing A:
B = 1
C = 4

After processing B:
C = min(4, 1 + 2) = 3
D = 1 + 5 = 6

After processing C:
D = min(6, 3 + 1) = 4
```

### Python with `heapq`

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

### C++ with `priority_queue`

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

This pattern is simple and very valuable.

You use two indices moving through the collection.

### Where it appears

- sorted arrays
- duplicate removal
- pair sums
- interval problems

### Example: find two numbers that sum to 10

Sorted input:

```text
[1, 2, 3, 4, 6, 8]
```

Diagram:

```text
left = 1
right = 8
1 + 8 = 9  -> move left
2 + 8 = 10 -> found
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

Sliding window is a very strong pattern for contiguous sequences.

You keep a "window" and update it instead of recalculating everything from scratch.

### Example: maximum sum subarray of size 3

```text
[2, 1, 5, 1, 3, 2]
```

### Idea

```text
Initial window: [2, 1, 5] -> sum 8
Move:
[1, 5, 1] -> sum 7
Move:
[5, 1, 3] -> sum 9
Move:
[1, 3, 2] -> sum 6
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

## Frequency counting with hash maps

This deserves explicit attention because it appears everywhere.

Examples:

```text
find the first repeated character
count words
group occurrences
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

## How to recognize the right algorithm or pattern

### Signs of linear search

- data is unsorted
- collection is small
- you only need existence

### Signs of binary search

- data is sorted
- you need faster lookup
- you can discard half the space

### Signs of BFS

- level exploration
- minimum distance without weights

### Signs of DFS

- depth exploration
- tree, graph, dependency, cycle

### Signs of Dijkstra

- positively weighted graph
- minimum accumulated cost

### Signs of sliding window

- contiguous subarray or substring
- moving range

### Signs of two pointers

- sorted collection
- both ends matter

## Classic mistakes

- optimizing too early
- forgetting the algorithm precondition
- using binary search without sorting
- using BFS when the problem has weighted cost
- using Dijkstra with negative weights
- implementing sorting without testing duplicates
- trusting it because "it worked on the happy path"

## How to study algorithms without freezing

Follow this order:

1. understand the problem
2. solve it manually
3. write pseudocode
4. implement
5. do a dry run
6. test empty input
7. test minimum input
8. test edge cases
9. only then think about optimization

It looks repetitive.

That is exactly why it works.

## Training sequence that actually gets results

### Stage 1

- linear search
- max and min
- frequency counting

### Stage 2

- binary search
- bubble sort
- insertion sort

### Stage 3

- merge sort
- quicksort
- two pointers
- sliding window

### Stage 4

- BFS
- DFS
- Dijkstra

## Strong algorithm checklist

- Do you understand input, output, and constraints?
- Can you do a dry run?
- Do you know when an algorithm has a required precondition?
- Can you explain the cost at a high level?
- Do you know why the solution is correct?
- Do you know when you need BFS, DFS, or Dijkstra?

If the answer is "yes" to most of this, your algorithmic thinking is entering serious territory.

## Next actions

- Strengthen modeling with [Data Structures](/en/reference/estruturas-de-dados/)
- If the reasoning foundation still feels shaky, review [Programming Logic](/en/reference/logica-de-programacao/)
- Then connect it to real software in [Projects](/en/projects/)
