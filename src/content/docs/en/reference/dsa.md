---
title: Data Structures & Algorithms
description: 'A practical DS&A guide focused on clarity: what to study, when to use it, and how it shows up in real code and interviews.'
---

DS&A is not just “interview content.”

DS&A is what stops you from solving problems in pure improvisation.

When you understand data structures and algorithms, you start seeing more clearly:

- how to organize information
- how to reduce processing cost
- how to avoid awkward solutions
- how to explain why one piece of code is better than another

So let us go straight to the point.

## What DS&A actually means

### Data structure

It is the way you organize information.

Question it answers:

**how should I store this correctly?**

Examples:

- list for sequence
- map for key-value access
- queue for arrival order
- heap for priority
- graph for relationships

### Algorithm

It is the step-by-step process that transforms data and solves a problem.

Question it answers:

**how do I get from the current state to the right result?**

Examples:

- searching
- sorting
- counting
- traversing
- finding the shortest path

### Complexity

It is the cost of the solution.

Questions it answers:

- how does runtime grow?
- how much memory does this consume?
- will this scale or break early?

## Why this matters in the real world

A lot of people think DS&A only matters for LeetCode.

Not true.

DS&A shows up in real code all the time:

- sorted feeds
- caching
- job queues
- autocomplete
- rankings
- deduplication
- search
- routing
- pagination
- rate limiting

When you choose the wrong structure, the system may still work.

But it works with more memory, more CPU, and more pain.

## Quick mental map

If your question is “what direction should I follow?”, think like this:

| Situation | Structure or idea that usually appears |
|---|---|
| I need to preserve order | List / array |
| I need fast key lookup | Map / hash table |
| I need uniqueness | Set |
| I need arrival order | Queue |
| I need undo or backtracking context | Stack |
| I need the min or max repeatedly | Heap |
| I need to represent relationships | Graph |
| I need range queries | Fenwick / Segment Tree |

Do not memorize this as a magic table.

Use it as a starting map.

## The structures you really need to master first

### Array / list

This is the most common structure in day-to-day development.

Use it when:

- order matters
- you iterate a lot
- index access helps

Be careful:

- frequent middle insertions are expensive
- searching by value may cost `O(n)`

### Map / hash table

This is one of the highest ROI structures in real-world software.

Use it when:

- you need lookup by key
- you want frequency counting
- you want to index data quickly

Classic examples:

- `email -> user`
- `id -> order`
- `word -> count`

### Set

Perfect for existence checks and uniqueness.

Use it when:

- you need to know if something already appeared
- duplicates are a problem

Examples:

- validating repeated items
- filtering users already processed

### Stack

Stack is LIFO: last in, first out.

Use it when:

- you need undo behavior
- you need nested context control
- you work with parsing or DFS

### Queue

Queue is FIFO: first in, first out.

Use it when:

- you need arrival-order processing
- you work with jobs, events, or BFS

### Heap

Heap solves a lot of priority problems.

Use it when:

- you need top K
- you constantly need the smallest or largest item
- you are handling scheduling or ranking

### Graph

Graphs appear when entities have relationships.

Use them when the problem involves:

- paths
- dependencies
- connections
- recommendations
- networks

## Algorithms that show up the most

### Linear search

Good enough when:

- the input is small
- simplicity is worth more than optimization

### Binary search

It enters the scene when data is sorted and you want cheaper lookup.

Core idea:

- cut the search space in half every step

### Sorting

You do not need to memorize 15 sorting algorithms.

But you do need to understand:

- why sorting has a cost
- when the language built-in is enough
- when stability matters

In practice:

- the language `sort` usually does the job
- what matters is understanding the impact of sorting repeatedly

### BFS and DFS

These two are game changers when you start dealing with trees and graphs.

Use BFS when:

- you want level-by-level exploration
- you need shortest path in an unweighted graph

Use DFS when:

- you want depth exploration
- you need cycle detection
- you need dependency traversal

### Dijkstra

This is the classic shortest-path algorithm for positive weights.

It appears in:

- maps
- routing
- minimum-cost paths
- priority-driven traversal

### Two pointers

A simple pattern, but a powerful one.

It appears in:

- removing duplicates
- comparing ends
- window and pair problems

### Sliding window

Excellent for strings, arrays, and subarrays.

Use it when:

- there is a window that expands and shrinks
- you want max, min, sum, or frequency in a contiguous segment

### Dynamic programming

Many people freeze here because they try to memorize formulas.

Wrong move.

DP starts when the problem has:

- repeated subproblems
- dependency between states

The real question is:

**what changes from one state to the next?**

## Complexity without fearmongering

Big-O matters, but it does not need to become a religion.

Think like this:

- `O(1)`: constant cost
- `O(log n)`: grows slowly
- `O(n)`: grows with input size
- `O(n log n)`: common in good sorting algorithms
- `O(n²)`: starts hurting fast

Practical rule:

- first make it correct
- then measure
- then optimize what actually hurts

But if you already see an unnecessary `O(n²)` on large data, cut it early. Do not wait for a fire.

## Patterns that show up most in interviews

If you want high study ROI, focus on these:

1. frequency counting with maps
2. two pointers
3. sliding window
4. stack
5. queue / BFS
6. trees with DFS
7. heap / top K
8. basic dynamic programming

That core already covers a lot of classic problems.

## How to study DS&A without freezing

### Stage 1

Learn the structure and the use case.

Questions:

- what does this structure do?
- which operation is strong?
- which operation is weak?
- when does it simplify the solution?

### Stage 2

Solve small problems.

Examples:

- detect duplicates
- count frequency
- reverse a string
- validate parentheses
- find max sum

### Stage 3

Explain your solution out loud.

If you cannot explain:

- the structure you chose
- the cost
- why you did not use another approach

then you have not consolidated it yet.

### Stage 4

Review patterns, not only isolated problems.

Developers grow faster in DS&A when they learn to recognize problem families.

## A 12-week plan

### Weeks 1 and 2

- arrays
- strings
- hash maps
- sets

Goal:

- stop solving everything with brute force

### Weeks 3 and 4

- stack
- queue
- deque
- two pointers
- sliding window

Goal:

- get faster on sequence problems

### Weeks 5 and 6

- linked lists
- binary trees
- BSTs
- DFS
- BFS

Goal:

- learn traversal and hierarchical structure thinking

### Weeks 7 and 8

- heap
- priority queue
- top K
- priority-based merge

Goal:

- understand ranking, smart queues, and efficient selection

### Weeks 9 and 10

- graphs
- Dijkstra
- Union-Find

Goal:

- learn connectivity, path, and grouping

### Weeks 11 and 12

- recursion
- backtracking
- basic dynamic programming
- review

Goal:

- close the first real DS&A cycle with more depth

## Classic mistakes when studying DS&A

- memorizing answers without understanding the pattern
- jumping into hard problems too early
- ignoring cost analysis
- using sophisticated structures for simple problems
- never reviewing your mistakes

## How DS&A improves your work code

Even outside interviews, DS&A makes you better at:

- data modeling
- solution clarity
- performance
- debugging
- technical argumentation

You stop saying “I think this works” and start saying:

- “this structure simplifies key-based access”
- “this approach removes a full extra pass”
- “this bottleneck grows with input size”

That changes the level of the conversation.

## Next actions

- If your fundamentals are still weak, go back to [Data Structures](/en/reference/estruturas-de-dados/)
- If you freeze before coding, review [Programming Logic](/en/reference/logica-de-programacao/)
- If your goal is career growth, pair this with [Resume That Stands Out](/en/reference/curriculo-que-se-destaca/)
