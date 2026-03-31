---
title: Data Types
description: Understand bits, bytes, memory representation, casting, characters, numbers, and types in C, C++, JavaScript, and Python.
---

Data type is not a detail.

Data type is a contract.

It defines:

- what a value means
- how much space it takes
- which operations make sense
- what kind of bug can grow from it

When you understand data types well, you stop programming only on the surface and start understanding how the machine actually sees what you wrote.

And that changes everything.

## Before talking about types: everything becomes bits

At the end of the day, memory does not know what `int`, `float`, `char`, or `bool` means.

It only stores bits.

A bit is the smallest unit of digital information:

- `0`
- `1`

Eight bits make one byte.

```text
1 bit   = 0 or 1
8 bits  = 1 byte
1024 bytes = 1 KB
1024 KB    = 1 MB
```

Example of one byte:

```text
01000001
```

That same byte can be interpreted in multiple ways:

- as decimal number `65`
- as hexadecimal `0x41`
- as ASCII character `'A'`

Notice the core idea:

**the bits are the same; meaning changes based on type and context.**

## Data representation: memory does not “see” semantics

Look at this 1-byte block:

```text
Bits:  01000001
Dec:   65
Hex:   0x41
ASCII: 'A'
```

Memory does not know whether this is a letter or a number.

That is decided by:

- the type
- the instruction being used
- the way the value is read

That is why characters have interchangeable numeric values.

In ASCII:

- `'A'` = `65`
- `'B'` = `66`
- `'a'` = `97`
- `'0'` = `48`

For the full table, see [ASCII Table](/en/reference/tabela-ascii/).

## Mental diagram: same data, different interpretations

```text
Address: 0x1000

+--------+
| 01000001 |
+--------+

If read as unsigned char -> 65
If read as ASCII char    -> 'A'
If read as raw binary    -> 01000001
```

This is one of the most important ideas in all of computing.

## Integers

Integers represent values with no fractional part.

Classic examples:

- age
- quantity
- retries
- stock
- position

## Integer sizes in the main languages

### C

In C, the exact size depends on the platform and compiler, but the standard guarantees minimum sizes.

```c
char        // at least 8 bits
short       // at least 16 bits
int         // at least 16 bits
long        // at least 32 bits
long long   // at least 64 bits
```

### C++

In C++, the base idea is similar to C:

```cpp
char
short
int
long
long long
```

But C++ gives you safer casting tools and modern library utilities.

### JavaScript

JavaScript is very different.

Most regular numbers are `Number`, which uses 64-bit IEEE 754 floating point.

That means:

- small integers usually work well
- decimals exist
- very large integers lose precision

```js
console.log(typeof 10);     // "number"
console.log(typeof 10.5);   // "number"
```

For truly large integers:

```js
const id = 9007199254740993n;
console.log(typeof id); // "bigint"
```

### Python

Python abstracts more.

`int` in Python grows as needed.

```python
x = 10
y = 10**100

print(type(x))  # <class 'int'>
print(type(y))  # <class 'int'>
```

That is great for ergonomics, but it does not mean zero cost.

Huge integers consume more memory and more processing.

## Signed and unsigned integers

In languages like C and C++, this matters a lot.

### Signed

Allows negative and positive numbers.

### Unsigned

Allows only zero and positive values.

Example with 8 bits:

```text
unsigned 8 bits: 0 to 255
signed 8 bits:  -128 to 127
```

## How negative values are stored: two's complement

The most common way to represent negative integers is two's complement.

Example with 8 bits:

```text
  5  = 00000101
 -5  = 11111011
```

How to build `-5` in two's complement:

```text
5 in binary:            00000101
invert the bits:        11111010
add 1:                  11111011
```

This matters because overflow, casting, and binary arithmetic depend on this representation.

## Real example in C

```c
#include <stdio.h>

int main(void) {
    signed char a = -5;
    unsigned char b = 250;

    printf("a = %d\n", a);
    printf("b = %u\n", b);
    return 0;
}
```

## Overflow: when the value does not fit

A type has limits.

If you try to store a value beyond those limits, something breaks.

Conceptual example with `unsigned char`:

```text
Maximum: 255

255 + 1 = 0   // wraparound in unsigned arithmetic
```

Example in C:

```c
#include <stdio.h>

int main(void) {
    unsigned char x = 255;
    x = x + 1;
    printf("%u\n", x); // usually 0
    return 0;
}
```

With `signed` integers, overflow can be even more dangerous because undefined behavior enters the picture in C and C++.

## Decimal to binary: integer part

If you want to manually convert a decimal integer to binary, divide by 2 and collect the remainders.

Example with `13`:

```text
13 / 2 = 6  remainder 1
 6 / 2 = 3  remainder 0
 3 / 2 = 1  remainder 1
 1 / 2 = 0  remainder 1

Reading bottom to top:
13 = 1101
```

## Decimal fraction to binary

For fractions, multiply by 2 and observe the integer part.

Example with `0.625`:

```text
0.625 * 2 = 1.25   -> 1
0.25  * 2 = 0.5    -> 0
0.5   * 2 = 1.0    -> 1

0.625 = 0.101 in binary
```

So:

```text
10.625 = 1010.101
```

## Floating-point numbers

This is where many people get hit without realizing it.

Floating-point does not represent “any decimal exactly.”

It represents binary approximations.

That is why cases like this exist:

```js
console.log(0.1 + 0.2); // 0.30000000000000004
```

```python
print(0.1 + 0.2)  # 0.30000000000000004
```

```cpp
#include <iostream>

int main() {
    std::cout << (0.1 + 0.2) << '\n';
}
```

## How a float is split in memory

In IEEE 754, a 32-bit `float` is usually organized like this:

```text
31          23          0
+-----------+-----------+
| sign | exponent | mantissa |
+-----------+-----------+

1 bit   8 bits      23 bits
```

For a 64-bit `double`:

```text
63           52                    0
+------------+---------------------+
| sign | exponent | mantissa      |
+------------+---------------------+

1 bit   11 bits     52 bits
```

This explains why:

- float comparisons can fail
- precision is limited
- using float for money is a trap

## Example of dangerous comparison

```python
a = 0.1 + 0.2
b = 0.3

print(a == b)  # False
```

Better approach:

```python
import math

print(math.isclose(0.1 + 0.2, 0.3))  # True
```

In C++:

```cpp
#include <cmath>
#include <iostream>

int main() {
    double a = 0.1 + 0.2;
    double b = 0.3;
    std::cout << std::boolalpha << (std::fabs(a - b) < 1e-9) << '\n';
}
```

## Money: use a proper decimal strategy or integer minor units

Practical rule:

- `$10.99` as `1099` cents
- or a proper decimal type in your chosen stack

JavaScript example using cents:

```js
const priceInCents = 1099;
const quantity = 3;

const total = priceInCents * quantity;
console.log(total); // 3297
console.log((total / 100).toFixed(2)); // "32.97"
```

Python example:

```python
price_cents = 1099
quantity = 3

total_cents = price_cents * quantity
print(total_cents)         # 3297
print(total_cents / 100)   # 32.97
```

## Characters: letters are also numbers

This matters a lot.

A character is not magic. It is also represented numerically.

In ASCII:

- `'A'` = `65`
- `'B'` = `66`
- `'Z'` = `90`
- `'a'` = `97`
- `'0'` = `48`

Visual example:

```text
'A'
Decimal: 65
Hex:     0x41
Bin:     01000001
```

You mentioned “A = 52”, but the correct ASCII value is `65`.

`52` in ASCII is the character `'4'`.

## Code: character to number and number to character

### C

```c
#include <stdio.h>

int main(void) {
    char c = 'A';
    printf("%c\n", c);   // A
    printf("%d\n", c);   // 65
    return 0;
}
```

### C++

```cpp
#include <iostream>

int main() {
    char c = 'A';
    std::cout << c << '\n';
    std::cout << static_cast<int>(c) << '\n';
}
```

### JavaScript

```js
const c = 'A';

console.log(c.charCodeAt(0));         // 65
console.log(String.fromCharCode(65)); // A
```

### Python

```python
print(ord('A'))   # 65
print(chr(65))    # A
```

## ASCII versus Unicode

ASCII covers the classic 128 codes.

Great for understanding the foundation.

But modern software usually needs Unicode, because:

- accents exist
- emojis exist
- many writing systems exist

ASCII is the starting point.

Unicode is the real world.

Even so, understanding ASCII is still extremely valuable because it helps you understand:

- character comparison
- basic ordering
- parsing
- byte manipulation
- text serialization

## Strings: text is not just “a bunch of letters”

A string is a sequence of characters.

But the implementation varies a lot by language.

### C

In C, a string is an array of `char` terminated by a null byte `'\0'`.

```c
#include <stdio.h>

int main(void) {
    char name[] = "Edu";

    printf("%c\n", name[0]); // E
    printf("%c\n", name[1]); // d
    printf("%c\n", name[2]); // u
    printf("%d\n", name[3]); // 0 -> '\0'
    return 0;
}
```

Diagram:

```text
name = "Edu"

+-----+-----+-----+------+
| 'E' | 'd' | 'u' | '\0' |
+-----+-----+-----+------+
```

### C++

In C++, you may use `char[]`, `const char*`, or `std::string`.

```cpp
#include <iostream>
#include <string>

int main() {
    std::string name = "Edu";
    std::cout << name.size() << '\n'; // 3
}
```

### JavaScript

Strings in JavaScript are immutable.

```js
const name = "Edu";

console.log(name[0]);      // E
console.log(name.length);  // 3
```

### Python

Strings in Python are also immutable.

```python
name = "Edu"

print(name[0])     # E
print(len(name))   # 3
```

## Booleans

Boolean models binary state.

```text
true / false
1 / 0
on / off
active / inactive
```

In C:

```c
#include <stdbool.h>
#include <stdio.h>

int main(void) {
    bool active = true;
    printf("%d\n", active); // 1
    return 0;
}
```

In JavaScript:

```js
const active = true;
console.log(typeof active); // boolean
```

In Python:

```python
active = True
print(type(active))  # <class 'bool'>
```

## Null, None, undefined, and friends

This is where a lot of confusion lives.

### C

Plain C often works with null pointers:

```c
int *ptr = NULL;
```

### C++

Modern C++ uses `nullptr`:

```cpp
int* ptr = nullptr;
```

### JavaScript

JavaScript has both `null` and `undefined`.

```js
let a = null;
let b;

console.log(a); // null
console.log(b); // undefined
```

### Python

Python uses `None`.

```python
value = None
```

Mental rule:

- absence of value is not the same as zero
- absence of value is not an empty string
- absence of value is not `false`

## Casting and conversion

Now we get to a critical part.

Casting is the act of converting one type into another.

It can be:

- implicit
- explicit
- safe
- dangerous

## Implicit casting

The language converts for you.

Sometimes it helps.

Sometimes it plants a bomb.

### Example in C

```c
int a = 10;
double b = a; // implicit conversion from int to double
```

### Example in JavaScript

```js
console.log("5" + 1); // "51"
console.log("5" - 1); // 4
```

That happens because JavaScript performs implicit coercion.

Powerful.

Also a bug factory if used carelessly.

## Explicit casting

You make the conversion intention obvious.

### C

```c
#include <stdio.h>

int main(void) {
    double x = 3.99;
    int y = (int)x;
    printf("%d\n", y); // 3
    return 0;
}
```

### C++

Prefer `static_cast` over C-style casts when possible:

```cpp
#include <iostream>

int main() {
    double x = 3.99;
    int y = static_cast<int>(x);
    std::cout << y << '\n'; // 3
}
```

### JavaScript

```js
console.log(Number("42"));       // 42
console.log(parseInt("42", 10)); // 42
console.log(parseFloat("3.14")); // 3.14
```

### Python

```python
print(int("42"))      # 42
print(float("3.14"))  # 3.14
print(str(42))        # "42"
```

## Dangerous conversions

### Losing the fractional part

```cpp
double price = 19.99;
int truncated = static_cast<int>(price); // 19
```

### Narrowing overflow

```c
#include <stdio.h>

int main(void) {
    int x = 300;
    unsigned char y = (unsigned char)x;
    printf("%u\n", y); // may become 44
    return 0;
}
```

Because:

```text
300 % 256 = 44
```

### Invalid string to number

```python
value = "abc"
# int(value) -> ValueError
```

```js
console.log(Number("abc")); // NaN
```

## `NaN`: a number that is not a number

In JavaScript:

```js
const value = Number("abc");

console.log(value);               // NaN
console.log(Number.isNaN(value)); // true
```

That kind of case must be handled before business logic continues.

## Hexadecimal and memory reading

Hex shows up all the time because it maps very well to bytes.

Each hexadecimal digit represents 4 bits.

```text
Binary:       11111111
Hexadecimal:  FF
Decimal:      255
```

Conversion:

```text
1111 1111
 F    F
```

Another example:

```text
0100 0001
 4    1

0x41 = 65 = 'A'
```

## Endianness: byte order

When a value occupies more than 1 byte, the storage order matters.

Example with `0x12345678`:

### Big-endian

```text
+------+------+------+------+
| 12   | 34   | 56   | 78   |
+------+------+------+------+
```

### Little-endian

```text
+------+------+------+------+
| 78   | 56   | 34   | 12   |
+------+------+------+------+
```

This appears in:

- serialization
- networks
- binary file reading
- interoperability between systems

## Type size in practice

Example in C:

```c
#include <stdio.h>

int main(void) {
    printf("char: %zu\n", sizeof(char));
    printf("short: %zu\n", sizeof(short));
    printf("int: %zu\n", sizeof(int));
    printf("long: %zu\n", sizeof(long));
    printf("long long: %zu\n", sizeof(long long));
    printf("float: %zu\n", sizeof(float));
    printf("double: %zu\n", sizeof(double));
    return 0;
}
```

Example in C++:

```cpp
#include <iostream>

int main() {
    std::cout << sizeof(char) << '\n';
    std::cout << sizeof(int) << '\n';
    std::cout << sizeof(double) << '\n';
}
```

## How to model real data

Before choosing a type, ask:

1. Is this quantity, identity, text, state, date, or money?
2. Will I calculate with it?
3. Is there a known limit?
4. Do I need exact precision?
5. Can the value be missing?
6. Does this come from user input, API, or file?

Those questions prevent a lot of messy code.

## Examples of correct modeling

### User

```text
name         -> string
age          -> integer
active       -> boolean
createdAt    -> date/time
```

### Order

```text
orderId       -> string or domain integer
amountCents   -> integer
paid          -> boolean
status        -> enum or validated string
```

### Product

```text
sku           -> string
stock         -> integer
priceCents    -> integer
```

## Mini lab of examples

### C: character and integer share the same numeric base

```c
#include <stdio.h>

int main(void) {
    char c = 'A';
    int code = c;

    printf("char: %c\n", c);
    printf("code: %d\n", code);
    return 0;
}
```

### C++: explicit truncation

```cpp
#include <iostream>

int main() {
    double ratio = 9.87;
    int whole = static_cast<int>(ratio);

    std::cout << ratio << '\n';
    std::cout << whole << '\n';
}
```

### JavaScript: tricky coercion

```js
console.log("10" + 2);   // "102"
console.log("10" - 2);   // 8
console.log(true + 1);   // 2
console.log(false + 1);  // 1
```

### Python: safe conversion with handling

```python
raw = "42"

try:
    value = int(raw)
    print(value + 8)
except ValueError:
    print("invalid input")
```

## Classic beginner mistakes

- using strings for everything
- comparing `"10"` with `10`
- using `float` for money
- thinking `char` has no numeric value
- converting without validation
- mixing missing value with zero
- ignoring the limits of a type

## Signs your modeling is weak

- the same field changes type across layers
- you keep converting values repeatedly
- the system is full of defensive conditionals with no clarity
- bugs show up in sorting, filtering, calculation, and serialization

## Exercises that are actually worth doing

1. Convert `13` to binary by hand.
2. Convert `0.625` to binary by hand.
3. Show in code that `'A'` equals `65`.
4. Model an order using cents instead of float.
5. Perform safe string-to-integer parsing in C, C++, JavaScript, and Python.
6. Compare `0.1 + 0.2` with `0.3` and explain the result.

## Strong data-type checklist

- Do you understand bits, bytes, and binary representation?
- Do you know the difference between integer, float, char, string, and bool?
- Do you know that a character is also a number?
- Do you understand the basics of two's complement?
- Do you know why float fails for money?
- Do you know when explicit cast is appropriate?
- Do you validate invalid input before converting?

If you check these boxes, your foundation already moves past “tutorial level” and into real engineering.

## Next actions

- Open the [ASCII Table](/en/reference/tabela-ascii/) now
- Then continue to [Data Structures](/en/reference/estruturas-de-dados/)
- If you want stronger reasoning, move on to [Programming Logic](/en/reference/logica-de-programacao/)
