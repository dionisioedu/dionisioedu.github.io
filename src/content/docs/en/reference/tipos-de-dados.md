---
title: Data Types
description: Learn how to represent data correctly to write safer, clearer, and more efficient code.
---

Data types are the foundation of programming. They tell the computer **what kind of information** you are storing, how that information should be interpreted, and which operations are valid.

If you get this wrong, everything else becomes bug fixing and patching.

## What data types are

A data type defines:

- the **set of possible values**;
- the **valid operations**;
- the **memory representation**.

Simple examples:

- integer: `-2`, `0`, `42`
- decimal: `3.14`, `0.5`
- string: `"Hello"`
- boolean: `true` or `false`

## Primitive types you should master first

### Integers

Use when there is no fractional part: number of users, age, retry count.

### Floating point / decimals

Use when fractions are needed: prices, distances, temperatures.

### String

Use for names, messages, textual IDs, emails.

### Boolean

Use for binary states: active/inactive, logged-in/logged-out, valid/invalid.

## Type conversion (casting)

Converting between types is common, but dangerous without validation.

Common mistakes:

- parsing invalid text into numbers;
- losing precision converting decimals to integers;
- comparing incompatible types without normalization.

Practical rule: **validate first, convert second**.

## Weak vs strong typing

- Strong typing: fewer runtime surprises, earlier feedback.
- Weak typing: more flexibility, but higher discipline required.

Neither style removes bugs by itself. Good engineering comes from:

- good modeling;
- input validation;
- tests.

## Practical habits that improve fast

- Use clear variable names: `userAge` communicates more than `x`.
- Do not store numbers as strings without reason.
- Centralize validation in utility functions.
- Prefer explicit types for critical business fields (money, permissions, IDs).

## Practice tasks

1. Build a simple form with name, age, and email.
2. Validate age as a positive integer.
3. Convert text input into the correct internal types.
4. Return clear error messages when type validation fails.

## Quick checklist

- Do you know when to use integer vs decimal?
- Do you validate before casting?
- Do you avoid comparing incompatible types?
- Do your chosen types reflect business intent?

If yes, your foundation is already stronger than most beginners.
