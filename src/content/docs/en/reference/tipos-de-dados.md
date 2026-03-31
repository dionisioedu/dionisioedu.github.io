---
title: Data Types
description: Understand how to represent information correctly so your code stays safer, clearer, and less fragile.
---

Data type is not a detail. Data type is meaning.

If you choose the wrong type, the software may still run. It just runs crooked.

This is where many classic bugs begin:

- price stored with the wrong precision
- age treated as text
- confusing status fields
- broken comparisons
- inconsistent validation

## What a data type really is

A data type defines:

- which values make sense
- which operations are valid
- how the value is interpreted
- which kinds of errors are likely

Simple examples:

- `42` may be an integer
- `"42"` is text
- `42.0` may be decimal
- `true` is a logical state

Looks simple. But many business rules break exactly because systems mix these ideas.

## What you should master first

### Integer

Use when there is no fractional part.

Examples:

- number of users
- retry count
- age
- rank position

### Decimal

Use when fractions matter.

Examples:

- weight
- temperature
- distance

But careful: not every decimal choice is good for money.

### String

Use for textual information.

Examples:

- name
- email
- masked document ID
- alphanumeric identifier

### Boolean

Use for binary states.

Examples:

- active or inactive
- paid or unpaid
- valid or invalid

### Null / absence of value

You also need to understand when the system is saying:

- “I do not know yet”
- “it was not informed”
- “it does not exist”

Many beginners treat absence as empty string, zero, or `false`. That is where the mess starts.

## Classic mistake: “it looks like a number, so it is a number”

This matters a lot:

- `"10"` is not `10`
- `"true"` is not `true`
- `"3.14"` is not `3.14`

When data comes from forms, APIs, or storage, validation and conversion are almost always required.

Practical rule:

**validate first, convert second**

## Money deserves special care

If you store prices as a generic floating-point value and just keep calculating, precision issues will eventually bite you.

In real systems, common approaches are:

- a proper decimal type
- integer cents

Mental model:

- `$10.99` can be stored as `1099` cents

That alone avoids many financial bugs.

## Date and time are traps too

Date is not “just a nice string.”

If you save everything as loose text, later you suffer when trying to:

- sort
- filter
- compare
- deal with timezone

Use a proper date/time type whenever possible. If serialization is needed, choose a consistent format.

## ID is not necessarily a number

This is an important mindset shift:

- phone number is not a mathematical number
- ZIP code is not a mathematical number
- document identifier is not a mathematical number
- order code may look numeric, but still be an identifier

If you are not going to calculate with it, it may not belong in a numeric type.

## How to choose the right type

Before creating a variable, field, or database column, ask:

1. Is this quantity, state, text, date, or identity?
2. Will I calculate with it or only store and display it?
3. Can it be absent?
4. Does precision matter?
5. Does exact comparison matter?

Those questions already improve most type choices.

## Practical modeling examples

### User

- `name`: string
- `age`: integer
- `email`: string
- `active`: boolean

### Order

- `orderId`: string or integer, depending on domain rules
- `totalAmount`: proper decimal or cents
- `paid`: boolean
- `createdAt`: date/time

### Product

- `sku`: string
- `stock`: integer
- `price`: proper decimal

## Common beginner mistakes

- using strings for everything
- comparing number and text
- converting without validation
- using `0` to mean “not informed”
- using `false` to hide missing data
- ignoring precision in money calculations

## Signs your modeling is weak

- you keep converting the same field again and again
- business rules are full of weird conditionals
- the same value changes format in different layers
- bugs keep showing up in forms, filters, and ordering

## High-value exercises

1. Model a user registration with name, age, email, and active state.
2. Model an order with amount, date, and payment status.
3. Receive data as text and convert it safely.
4. Reject invalid input without crashing the flow.

## Quick checklist

- Do you know when to use integer vs decimal?
- Do you understand that IDs are not always numbers?
- Do you treat absence of value carefully?
- Do you know money needs serious modeling?
- Do you validate before conversion?

If yes, your base is already much stronger than the average beginner’s.

## Next actions

- Continue to [Data Structures](/en/reference/estruturas-de-dados/)
- Then consolidate with [Programming Logic](/en/reference/logica-de-programacao/)
