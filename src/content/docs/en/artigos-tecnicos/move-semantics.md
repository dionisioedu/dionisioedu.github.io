---
title: "Move Semantics in C++ — std::move Doesn't Move Anything"
description: "\"std::move\" is a cast, not an action. What rvalue references actually bind to, why moved-from is \"valid but unspecified,\" and where the copy you thought you eliminated silently stays."
publishedAt: 2026-10-07
author: Dionisio
tags:
  - C++
  - Move Semantics
  - Performance
  - Ownership
  - Best Practices
cover: /assets/images/move-semantics.png
coverAlt: An lvalue being cast to an xvalue and its buffer pointer transferred to a new object, leaving the source empty
---

<section class="ae-feature">
  <img src="/assets/images/move-semantics.png" alt="An lvalue being cast to an xvalue and its buffer pointer transferred to a new object, leaving the source empty" loading="eager" width="1200" height="630" fetchpriority="high" decoding="async" />
  <div class="ae-feature-copy">
    <p class="ae-kicker">C++ · Move Semantics · Performance</p>
    <h2><code>std::move</code> does not move anything</h2>
    <p>It is a cast. It produces an rvalue reference and then gets out of the way. Whether a byte is actually moved is decided later, by overload resolution — which is exactly where most people stop reading and start guessing.</p>
    <div class="ae-meta"><span>C++11 → C++20</span><span>Value categories</span><span>RVO</span></div>
  </div>
</section>

There is a sentence that ends more C++ arguments than any other: "I used `std::move`, so there's no copy." It sounds like a fact. It is a wish.

`std::move` has one job, and it is not the job the name advertises. It casts its argument to an rvalue reference — nothing more. No memory is touched. No buffer is transferred. No constructor runs. If you find that disappointing, you are beginning to understand the topic.

Move semantics is the single feature that changed what "pass by value" costs, that made `unique_ptr` possible, that turned a `std::vector` copy into a pointer steal. It is also the feature where the gap between what you *think* the compiler does and what it *actually* does has the most expensive consequences. This article is about closing that gap.

There is also a [Portuguese edition](/pt/artigos-tecnicos/move-semantics/).

## What std::move Actually Is

Open the standard library and you find this:

```cpp
template <class T>
constexpr std::remove_reference_t<T>&& move(T&& t) noexcept {
    return static_cast<std::remove_reference_t<T>&&>(t);
}
```

That is the whole function. It is `constexpr`, it is `noexcept`, and it generates no code at all. **`std::move` is a named cast with a marketing department.** The [cppreference entry on `std::move`](https://en.cppreference.com/w/cpp/utility/move) says the same thing more politely: it "produces an xvalue expression that identifies its argument."

So when you write this:

```cpp
std::string a = "hello, this is a fairly long string that owns a heap buffer";
std::string b = std::move(a);
```

the move does not happen on the `std::move` line. It happens on the `=` — specifically, it happens *if* `std::string` has a move constructor and *if* overload resolution picks it over the copy constructor. `std::move` does not perform the transfer; it makes the transfer *eligible*. The type does the rest.

This is the first place people lose the plot. `std::move` is not a verb. It is an adjective. It marks the argument "okay to cannibalize," and then a constructor, or an assignment, or a container method decides whether to take you up on it.

## Value Categories, the Three-Word Version

You can write production C++ for years without saying "xvalue" out loud. But move semantics is written in value categories, so here are the three you need:

- **lvalue** — has a name, has an address, can appear on the left of `=`. `a` in the snippet above. "I am a thing you can refer to again."
- **prvalue** — a pure temporary. `std::string{"temp"}`. "I am a value, not a place."
- **xvalue** — an "expiring" lvalue. The result of `std::move(a)`. "I still name a thing, but you may take its guts."

An **rvalue** is a prvalue or an xvalue. An rvalue reference (`T&&`) binds to rvalues. A move constructor takes `T&&`. Overload resolution prefers `T&&` over `const T&` when the argument is an rvalue — that preference *is* move semantics. Everything else is bookkeeping.

The rule that trips people up most: **a variable whose type is `T&&` is itself an lvalue.** The name has an address; it is a thing you can refer to again. That is why a move constructor must write `std::move(arg.member)` and not just `arg.member`:

```cpp
// Simple move constructor
A(A&& arg) : member(std::move(arg.member)) // "arg.member" is an lvalue
{}

// Simple move assignment operator
A& operator=(A&& other) {
    member = std::move(other.member);
    return *this;
}
```

Forget the inner `std::move` and you get a copy. The compiler will not warn you. The code will be correct and slower than you claimed it was, which is the worst kind of correct.

## The Demo Everyone Should Run Once

Here is the fact that ends the argument. Instrument a type, count the operations, and watch.

```cpp
#include <iostream>
#include <utility>
#include <vector>

struct Tracker {
    std::string name;
    explicit Tracker(std::string n) : name(std::move(n)) {}
    Tracker(const Tracker& o) : name(o.name) { std::cout << "  COPY " << name << '\n'; }
    Tracker(Tracker&& o) noexcept : name(std::move(o.name))
    { std::cout << "  MOVE " << name << '\n'; }
};

int main() {
    std::vector<Tracker> v;
    v.reserve(1);

    Tracker local("local");
    std::cout << "push_back(local):\n";
    v.push_back(local);                  // lvalue -> COPY

    std::cout << "push_back(std::move(local)):\n";
    v.push_back(std::move(local));       // xvalue -> MOVE
}
```

Output:

```
push_back(local):
  COPY local
push_back(std::move(local)):
  MOVE local
```

The first call copies. The second moves. Same function, same object, one cast apart. **That is the entire value proposition, and you just watched it do nothing** — until overload resolution decided it would do something. This is also the mental model that makes the rest of the article obvious instead of surprising.

## Where the Copy You Eliminated Actually Stays

Six ways the "I used `std::move`" claim quietly fails. Each one has bitten a real codebase.

**1. The type has no move operations.** A user-defined type with a declared destructor, copy constructor, or copy assignment operator generates **no** implicit move constructor — it is *not* generated, and `std::move` will happily fall back to the copy. You wrote `std::move`; you got a copy. This is the [Rule of Five](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-five) trap: declare one of the special members and you must consider all five.

```cpp
struct NoMove {
    std::string data;
    ~NoMove() {}                 // user-declared destructor
    // ...no move ctor/assign are implicitly declared...
};

NoMove a;
NoMove b = std::move(a);         // calls the COPY constructor. Yes, really.
```

Declare the destructor and the compiler stops offering you moves. Add `NoMove(NoMove&&) = default;` and `NoMove& operator=(NoMove&&) = default;` if you want them back.

**2. The argument is `const`.** `std::move` on a `const` object produces a `const T&&`. No move constructor takes a `const T&&` — moving requires mutating the source. Overload resolution falls back to the copy constructor, every time. `const std::string&&` binds, and then you copy.

```cpp
const std::string name = "immutable forever";
auto copy = std::move(name);     // const T&& -> copy constructor. Silently.
```

Some compilers now emit a `-Wpessimizing-move`-adjacent diagnostic for this; do not rely on it. **A `const` rvalue is a contradiction.** `std::move` cannot fix a `const` object, because moving *is* a mutation.

**3. You moved a member but not the rest.** A move constructor that moves three of four members leaves the fourth copied. It compiles, it looks moved, and one field costs you an allocation. This is why `= default` matters when the compiler can generate a correct move for you.

**4. The move constructor is not `noexcept`, and a container gave up on it.** `std::vector` reallocation offers the strong exception guarantee. It can only get it with a `noexcept` move, because if a move threw mid-reallocation there is no way back. If your move can throw, **`std::vector` copies instead of moves** — and it does so silently, on every growth. Mark moves `noexcept` or lose them exactly where they matter most.

```cpp
// This move can throw, so vector will copy on reallocation.
Widget(Widget&& other) : data_(std::move(other.data_)) { /* ...may throw... */ }

// This one vector trusts. Mark it.
Widget(Widget&& other) noexcept : data_(std::move(other.data_)) {}
```

**5. It was actually a return, and copy elision already did the job.** Since C++17, returning a prvalue — `return Widget{...};` — is **guaranteed** copy elision; there is no move and no copy, it is constructed directly in the caller's storage. And returning a named local is NRVO, which the compiler does with or without `std::move`. Writing `return std::move(local);` can *defeat* NRVO and force a real move. It is the one place `std::move` is actively harmful. (Classic [C++17 guaranteed copy elision](https://en.cppreference.com/w/cpp/language/copy_elision).)

```cpp
Widget make_bad() {
    Widget w;
    return std::move(w);   // pessimizing move: blocks NRVO
}

Widget make_good() {
    Widget w;
    return w;              // NRVO, or the implicit move of a named local
}
```

**6. The signature takes by value but you moved into a parameter that was never used as a move target.** "Sink parameters" — `void store(std::string s)` with callers writing `store(std::move(name))` — work, and they move. But a by-value parameter that then gets *copied* into a member instead of moved loses the whole point. Move it the last time you touch it, nowhere else.

## `std::move` for Signatures, `std::forward` for Templates

A rule that survives contact with real code:

- **`std::move` in a function body** when you want to transfer ownership of something you own.
- **`std::move` in a constructor's member-init list** when you are taking ownership of a parameter.
- **`std::forward<T>(t)` in a template**, never `std::move`.

The difference is **forwarding references**. `T&&` where `T` is a deduced template parameter is not an rvalue reference — it is a forwarding reference, and it binds to both lvalues and rvalues. `std::forward` preserves the original value category; `std::move` destroys it. Use `std::move` on a forwarding reference and you will turn a caller's lvalue into a stolen object. That is how `std::vector::emplace_back` becomes a footgun you wrote yourself.

```cpp
// WRONG: a forwarding reference that always moves.
template <class T>
void bad_forward(T&& value) {
    consume(std::move(value));   // steals from lvalue callers too
}

// RIGHT: preserve what the caller gave you.
template <class T>
void good_forward(T&& value) {
    consume(std::forward<T>(value));
}
```

## The Cost, Honestly

Moves are not free, and pretending otherwise is how you end up confused at the profiler.

| Operation | What it does |
| --- | --- |
| `std::move(x)` | Zero. Compiles to nothing. A cast. |
| Move of a `std::string` | Steals the heap buffer pointer. **O(1)**, no allocation. |
| Move of a `std::vector` | Steals the buffer pointer. **O(1)**, no allocation. |
| Move of a `std::array<T, N>` | **O(N)** — it is a value, it has no indirection to steal. |
| Move of a type with only small members | Roughly the cost of a copy, or close enough not to matter. |

Two consequences worth internalizing:

- **Moves shine on types with a heap handle and a pointer to steal.** For a `std::array<int, 4>`, a "move" is four int copies. The abstraction does not create speed out of nothing; it moves the *ownership* of the thing that was expensive.
- **A moved-from object is not gone.** It is "valid but unspecified." You may destroy it, assign to it, or call any operation without preconditions — `clear()`, `empty()`. You may not call anything with a precondition, and you may not assume anything about its value.

## Moved-From Is "Valid But Unspecified" — Not "Empty"

This is the sentence people skip and later debug for two hours.

```cpp
std::vector<std::string> v;
std::string str = "example";
v.push_back(std::move(str));   // str is now valid but unspecified

str.back();                    // UNDEFINED if size()==0; back() has a precondition
if (!str.empty())
    str.back();                // OK: empty() has no precondition, and we checked
str.clear();                   // OK: clear() has no preconditions
```

`std::string`'s moved-from state happens to be empty on every common implementation, and it is **not guaranteed to be**. If `std::move` moves your `std::string`, do not then read `str.size()` and branch on it. Assign to it, reuse it as a sink, or let it die. The contract is deliberately narrow: [the standard guarantees the invariants hold, nothing more](https://en.cppreference.com/w/cpp/utility/move). Write code against the contract, not against libstdc++'s current behaviour.

Self-move is its own small trap. `v = std::move(v);` is legal and leaves `v` in a valid but unspecified state. It is not a no-op. Do not write it, and do not "optimize" by assuming it does nothing.

## What to Reach For Instead of Hand-Writing Moves

Most code should not declare a move constructor at all. The Rule of Zero still wins:

- **Let the compiler generate the moves.** A class with only members that are themselves movable needs no move operations. Write `= default` only when you have a reason to suppress or force one.
- **Follow the Rule of Five when you must own a raw resource.** Declare one special member and the others do not appear. Declare all five and get the semantics you meant.
- **Use `std::exchange` for the moved-from reset.** It assigns the new value and returns the old, in one expression — the canonical idiom for writing a correct move:
  ```cpp
  Widget(Widget&& other) noexcept
      : handle_(std::exchange(other.handle_, nullptr)) {}
  ```
- **`std::move_if_noexcept`** exists for the container-internal case where the strong guarantee hinges on `noexcept`. You will rarely call it; you should know it is why `noexcept` matters.

## The Review Checklist

Five questions that catch nearly every move-semantics defect I have seen in production:

1. **Is the move actually a move?** Does the type have a `noexcept` move constructor, and is the argument a non-`const` rvalue? If either is false, you copied.
2. **Are there `std::move` calls on `const` objects?** Every one of them is a copy wearing a disguise.
3. **Are all moves `noexcept`?** If not, is the object ever stored in a `std::vector`? Then it is being copied on reallocation, silently.
4. **Is there a `return std::move(local);`?** Remove it. You are fighting guaranteed copy elision.
5. **Is `std::move` used on a forwarding reference?** It should be `std::forward<T>`, or you are stealing from lvalue callers.

Note what none of these questions are about: performance micro-tuning. They are all about *whether the move happened at all*. That is where the real cost lives — not in a move that is 3 nanocycles slower, but in a copy you believed was a move, running a million times an hour.

## Closing: The Cast That Isn't an Action

Move semantics is one idea with a bad publicist. The idea: a value's lifetime can end early, and the compiler will pick a constructor that consumes it instead of copying it. The bad publicist: a function called `std::move` that does not move.

Once you internalize that `std::move` is a *cast to an xvalue* and that overload resolution is what actually decides, the rest stops being trivia and becomes a way of reading code — you ask "which constructor runs here?" instead of "is this fast?" The two questions have the same answer.

And the habit worth keeping: **when you claim a move, prove it.** Instrument the type, count the operations, read the assembly if you want. "I used `std::move`" is not evidence. It never was. `std::move` is a promise you make to the overload set, and the overload set keeps its own promises.

## Keep Reading

- [RAII in C++](/en/artigos-tecnicos/raii/) — the ownership model move semantics quietly depends on, and the special-member rules that make moves appear or vanish.
- [Smart Pointers in C++](/en/artigos-tecnicos/smart-pointers/) — where `std::move` is the mechanism that makes `unique_ptr` a first-class owner.
- [C++ by Version](/en/artigos-tecnicos/cpp-versoes-features/) — where rvalue references, `noexcept`, and guaranteed copy elision entered the standard.
- [Practical C++ learning path](/en/reference/trilha-cpp/) — move semantics as step three, with the exercise and a free modernization checklist.

`std::move` does not move anything. Understanding why is the whole lesson.
