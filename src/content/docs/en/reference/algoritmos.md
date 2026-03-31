---
title: Algorithms
description: Learn how to solve problems correctly, clearly, and efficiently without falling into unnecessary complexity.
---

An algorithm is a finite sequence of steps used to solve a problem.

But in real engineering, “solving somehow” is not enough.

You want a solution that is:

- correct
- understandable
- testable
- viable as input grows

## What separates a strong algorithm from a weak one

A strong algorithm:

- returns the right answer
- terminates in finite time
- is readable and reviewable
- scales reasonably

A weak one usually does one of these:

- breaks on edge cases
- only works on the happy path
- becomes too slow as data grows
- is so confusing no one wants to touch it

## Correctness first. Performance second.

Many people want to jump into Big-O too early.

But before optimization, you need to make sure the solution:

- actually solves the problem
- covers important cases
- is based on a sound idea

Practical rule:

**a correct simple solution beats a clever wrong one**

## How to think before implementing

Before opening the editor, answer:

1. what is the input?
2. what is the output?
3. what constraints exist?
4. what is the simplest valid case?
5. what can go wrong?

That process saves a lot of useless typing.

## Complexity: what you need to feel early

You do not need to memorize every formula yet.

But you need to feel the difference between:

- `O(1)`: constant cost
- `O(log n)`: slow growth
- `O(n)`: linear growth
- `O(n²)`: growth that starts hurting fast

Mental model:

- comparing every item with every item often explodes
- making a single pass over the collection is usually healthy

In real systems, this is what separates:

- “works in demo”
- from “survives production”

## Classic strategy families

### Brute force

Try possibilities until you find the answer.

Good when:

- the problem is small
- you want to validate the idea
- you need a first correct version

Bad when:

- the search space blows up

### Divide and conquer

Break the problem into smaller parts, solve them, combine the result.

Classic examples:

- merge sort
- binary search

### Greedy

Make the best local choice at each step.

This works beautifully in some problems.
In others, it gives the wrong answer with a lot of confidence.

### Dynamic programming

Store partial results so you do not recompute the same work.

It shines when there is:

- repeated substructure
- reusable optimal subproblems

## Recommended problem-solving process

1. understand the statement without rushing
2. work through 2 or 3 manual examples
3. write pseudocode
4. implement the simple version
5. test edge cases
6. only then think about optimization

This flow looks slower at first.

In practice, it saves time.

## A direct example

Problem:

“Find duplicates in a list.”

### Solution 1

Compare every item with every item.

- simple
- correct
- poor cost: `O(n²)`

### Solution 2

Walk once through the list while storing seen values in a `Set`.

- simple
- correct
- much better cost: close to `O(n)`

That comparison is the heart of algorithmic thinking.

## Common mistakes

- optimizing too early
- ignoring empty input
- ignoring null cases
- not proving to yourself why the solution works
- overcomplicating a problem that needed a direct answer

## When optimization is actually worth it

Think seriously about optimization when:

- input can grow a lot
- the operation runs frequently
- cost has already become a real bottleneck
- there is a clear performance requirement

If there is no real bottleneck, the best decision is often to keep the solution simple.

## High-value exercises

1. linear search
2. binary search
3. find max and min
4. remove duplicates
5. count frequency of elements
6. insertion sort or selection sort

For every exercise, ask:

- is it correct?
- is it clear?
- can I explain it?
- can I improve it?

## Quick checklist

- Do you separate correctness from optimization?
- Do you think about input, output, and constraints?
- Do you test simple and edge cases?
- Can you explain why your solution works?

If yes, your algorithmic thinking is getting genuinely stronger.

## Next actions

- Consolidate with [Data Structures & Algorithms](/en/reference/dsa/)
- Then apply the thinking in [Projects](/en/projects/)
