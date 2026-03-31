---
title: Data Structures
description: Learn how to organize data the right way so your code becomes clearer, faster, and much easier to maintain.
---

A data structure is the way you organize information so the program can work with it.

And yes, that changes the whole result.

The same business rule can become:

- clean and fast code
- or a mess full of slow lookups, duplication, and patches

## The most common beginner mistake

Using lists for everything.

Lists solve many things? Absolutely.

Do they solve everything well? Not even close.

When the structure is wrong, you start seeing symptoms like:

- linear search everywhere
- repeated logic
- too many conditionals compensating for bad modeling
- performance dropping with no obvious reason

## What you need to understand first

### Array / List

Good when:

- order matters
- you iterate often
- index access makes sense

Bad when:

- you need constant key-based lookup
- you insert/remove in the middle all the time

### Stack

LIFO model: last in, first out.

Use when the flow looks like:

- undo actions
- navigation history
- parsing
- nested calls

### Queue

FIFO model: first in, first out.

Use when the flow looks like:

- processing queue
- pending jobs
- messages
- async handling

### Map / Dictionary / HashMap

Use when you want:

- fast lookup by ID
- key → value relationships
- to stop scanning a list over and over

Example:

- `userId -> userObject`

### Set

Use when the core requirement is:

- uniqueness
- fast “already exists?” checks

Examples:

- unique emails
- tags without repetition
- already-processed IDs

## How to choose without overthinking

Answer these:

1. Is the main access by index, key, order, or priority?
2. Will I search more than I iterate?
3. Do I need uniqueness?
4. Does order matter?
5. Will I process sequentially?

That already solves most decisions.

## Fast mental map

- want ordered iteration? list
- want key-based lookup? map
- want uniqueness? set
- want queued processing? queue
- want undo / backtracking? stack

That is the core instinct.

## Real example: order system

Inside the same system, you may use:

- `Array` to render orders in the UI
- `Map` to fetch order by ID quickly
- `Queue` to process pending orders
- `Set` to prevent duplicate event handling

Important point:

serious systems often use multiple structures at once.

## Complexity: what you must at least feel

You do not need to memorize every number right now.

But you must feel the difference between:

- scanning a list item by item
- going straight to a key

As the data grows, that changes:

- response time
- processing cost
- code clarity

## Signs the structure is wrong

- you keep doing `find`, `filter`, or `some` on the same collection
- every function has to search for the same thing again
- you create parallel lists to compensate
- you need too many comments to explain data relationships

## Common mistakes

- using a list for ID lookup
- duplicating state across many structures without a strategy
- hiding business rules inside raw structure manipulation
- exposing structure operations instead of domain behavior

## Encapsulation is the real upgrade

Choosing a structure is not enough.

You also need to avoid spreading direct manipulation across the whole project.

Better:

- `addOrder(order)`
- `findOrderById(id)`
- `markOrderAsProcessed(id)`

Worse:

- every file touching the same list, map, and set directly

## High-value exercises

1. Build a task manager with list and priority handling.
2. Use a `Map` for lookup by ID.
3. Use a `Set` for unique tags.
4. Use a `Queue` for pending execution.
5. Explain out loud why each structure was chosen.

## Quick checklist

- Do you understand list vs stack vs queue?
- Do you know when map beats list?
- Do you see how set prevents bugs?
- Can you justify your structure choices?

If yes, you are already thinking more like an engineer and less like someone just making things run.

## Next actions

- Move to [Programming Logic](/en/reference/logica-de-programacao/)
- Then connect everything in [Algorithms](/en/reference/algoritmos/)
