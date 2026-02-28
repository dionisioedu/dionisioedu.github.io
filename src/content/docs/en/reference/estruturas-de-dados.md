---
title: Data Structures
description: Learn how to organize data correctly to reduce complexity and improve performance.
---

A data structure is the **shape** you choose to store and manipulate information.

The same business rule can be elegant or painful depending on this choice.

## Why this matters

Wrong structure choices often create:

- slow lookups;
- hard-to-read code;
- duplicated logic;
- bugs from confusing updates.

Right choices give clarity and speed.

## Core structures to study first

### Array / List

Great for ordered collections, index access, and simple iteration.

### Stack

LIFO model (last in, first out). Useful for undo, navigation history, parsing.

### Queue

FIFO model (first in, first out). Useful for async jobs and task processing.

### Map / Dictionary / HashMap

Key-based access. Excellent for fast lookup (`id -> object`).

### Set

Collection with unique values only. Great for uniqueness and membership checks.

## How to pick the right one

Ask these questions:

1. Is the primary access by index, key, order, or priority?
2. Do I need insertion order?
3. Is this read-heavy, write-heavy, or balanced?
4. Do values need to be unique?

The answers usually point to the correct structure.

## Common beginner mistakes

- using lists for everything;
- ignoring linear search cost;
- duplicating the same data in many places without sync strategy;
- exposing raw structure operations instead of clear domain functions.

## Practical mental model

In an orders system:

- `Queue` for pending order processing;
- `Map` for fast ID lookup;
- `Set` to prevent duplicate processing;
- `Array` for ordered UI rendering.

Each structure solves a different problem in the same workflow.

## Practice tasks

1. Build a task manager with priorities.
2. Use a `Map` for task lookup by ID.
3. Use a `Set` to prevent duplicate tags.
4. Add a queue for pending execution.

## Quick checklist

- Do you understand list vs stack vs queue?
- Do you know when to use map over list?
- Do you account for lookup/update cost?
- Does your structure match real business behavior?

If yes, you are already thinking like an engineer, not just writing code.
