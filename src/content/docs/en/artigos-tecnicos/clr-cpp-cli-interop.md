---
title: "C# and C++ in the Same Process — CLR, C++/CLI, and the Native Boundary"
description: "Calling a C++ function is easy. Knowing who owns the memory after it returns is the whole job. CLR, C++/CLI bridges, P/Invoke, marshaling, and lifetime contracts."
publishedAt: 2026-10-27
author: Dionisio
tags:
  - C++
  - C#
  - .NET
  - Interop
  - Windows
  - Architecture
cover: /assets/images/csharp-cpp-interop.png
coverAlt: Two stacked runtime panels — the CLR above, native C++ below — separated by a C++/CLI bridge seam that data and errors cross
---

<section class="ae-feature">
  <img src="/assets/images/csharp-cpp-interop.png" alt="Two stacked runtime panels — the CLR above, native C++ below — separated by a C++/CLI bridge seam that data and errors cross" loading="eager" width="1200" height="630" fetchpriority="high" decoding="async" />
  <div class="ae-feature-copy">
    <p class="ae-kicker">C++ · C# · .NET · Interoperability</p>
    <h2>Two runtimes. One object. Nobody agreed who kills it.</h2>
    <p>Interop is not the art of making two languages talk. It is the art of making two execution models agree on types, errors, memory, and object lifetime — before production finds the disagreement for you.</p>
    <div class="ae-meta"><span>CLR internals</span><span>C++/CLI</span><span>P/Invoke</span><span>Idempotency</span></div>
  </div>
</section>

You ship a Windows desktop application. The interface is C#. The calculations that actually matter run in a C++ library that has been in the company longer than most of the team.

The user clicks a button. An event is born in the managed world of .NET, crosses an intermediate layer, and lands on a C++ object that knows nothing about a garbage collector.

The function runs, returns a value, the UI repaints.

Simple — until an object is destroyed one instruction too early, a C++ exception leaves the native world through a door nobody built to carry it, or the process keeps growing after the window closes.

There is also a [Portuguese edition](/pt/artigos-tecnicos/clr-cpp-cli-interop/).

The through-line in every one of those failures is the same: **the boundary was treated as plumbing instead of architecture.** A call site is plumbing. A lifetime contract is architecture. Most interop code in the wild has the first and improvises the second.

## 1. What the CLR Actually Is

CLR — *Common Language Runtime* — is the managed execution environment behind .NET.

C# is compiled to an intermediate representation (CIL), and the runtime takes it from there — JIT at first call, tiered compilation as the method gets hot, AOT in some deployment models. The compiler's job ends before the machine code exists. That is the part people forget when they expect `async` or a `try/catch` to behave the way it does in native code.

The CLR provides:

- Memory management through a tracing garbage collector
- A type system with metadata, reflection, and verifiable IL
- Managed exception handling with stack unwinding driven by that metadata
- Assembly loading, versioning, and binding
- Cross-language integration for every language that targets the runtime

Native C++ is not in that club. Its objects follow the language's model: constructors and destructors, allocators, RAII, and explicit ownership rules the compiler enforces at compile time rather than at runtime.

The fundamental difference:

**In C#, the runtime decides when an object's memory is reclaimed. In native C++, your code decides when its resources are released — and the compiler holds you to it.**

That sentence is not a claim that C# has no cleanup (it has `IDisposable`, `using`, finalizers) or that C++ is all manual `new`/`delete` (it has `unique_ptr`). It is a claim about which system owns the decision. When you connect the two worlds, you are connecting two systems that both believe they are in charge.

## 2. The Architecture That Usually Works

Picture an engineering calculation tool. The shell is Windows Forms or WPF; the solver is an existing C++ library.

```text
┌───────────────────────────────┐
│ Desktop Application           │
│ C# / .NET                     │
│                               │
│ UI, events, presentation      │
└──────────────┬────────────────┘
               │ managed call
               ▼
┌───────────────────────────────┐
│ Interop Layer                 │
│ C++/CLI                       │
│                               │
│ Types, errors, lifetime       │
└──────────────┬────────────────┘
               │ native call
               ▼
┌───────────────────────────────┐
│ Native Engine                 │
│ C++                           │
│                               │
│ Algorithms and domain rules   │
└───────────────────────────────┘
```

The C# application never sees the C++ implementation. It sees a managed contract.

The middle layer adapts calls, converts types where required, translates failures, and owns native resources.

The value of that separation is not tidiness. It is **blast radius**. If the C++ library changes its internals next quarter — new solver, different allocation strategy — the impact stays inside the bridge, as long as the public contract held. Without the layer, every form and every view model that touched the engine becomes a place a native refactor can break.

One rule makes or breaks this design: *the bridge is not a general-purpose escape hatch.* The moment you expose a `NativeEngine*` to the C# side "just for this one case," you have moved the ownership question into the UI layer and the layer stops earning its keep.

## 3. C++/CLI Is Not C++

C++/CLI is a Microsoft extension to C++ for working with .NET managed types. It lets native and managed code coexist inside one translation unit — which is precisely why it is the most convenient bridge, and precisely why it is the easiest place to write an unmaintainable hybrid.

Two constructs show the split immediately:

```cpp
// Native object — lifetime is yours
NativeEngine* engine = new NativeEngine();

// Handle to a managed object — GC decides when it goes away
System::String^ name = gcnew System::String("Engine");
```

The `^` is a handle to a managed object, not a pointer. It is tracked by the GC, and it moves — the runtime updates it when objects relocate during compaction. Treating it like a pointer (stashing it in native memory, doing arithmetic on it) is undefined behavior that usually looks fine in debug builds.

`gcnew` allocates on the managed heap. `ref class` declares a managed reference type:

```cpp
public ref class EngineBridge
{
public:
    double Calculate(double value, double factor);
};
```

`value class` would give you a managed value type with stack-like semantics for small, copyable payloads — worth knowing, because passing a struct across the boundary by managed reference when you meant a value is a real (and silent) cost.

One detail that bites people coming from modern C++: the managed half of C++/CLI has its own restrictions. Do not assume every C++20 or C++23 feature is available inside a `ref class`. Constraints, concepts, and some template machinery behave differently or are unavailable there. Test the specific feature, do not assume it.

## 4. Building a Realistic Example

Three components, deliberately small:

1. A native C++ library.
2. A C++/CLI DLL exposing it to .NET.
3. A C# application consuming the DLL.

### 4.1. The native library

`NativeEngine.h`:

```cpp
#pragma once

#include <stdexcept>

class NativeEngine
{
public:
    double Calculate(double value, double factor) const
    {
        if (factor <= 0.0)
        {
            throw std::invalid_argument(
                "Factor must be greater than zero"
            );
        }

        return value * factor;
    }
};
```

Plain C++. No CLR, no assembly references, no UI. Compilable and testable on its own, on any platform.

That is the first architectural objective: **keep domain logic independent of whatever technology presents it.**

### 4.2. The bridge

`EngineBridge.h`:

```cpp
#pragma once

#include "NativeEngine.h"

using namespace System;

namespace Interop
{
    public ref class EngineBridge
    {
    private:
        NativeEngine* engine;

    public:
        EngineBridge()
            : engine(new NativeEngine())
        {
            // If this throws and we are already constructed-adjacent,
            // a finalizer may still run on an uninitialized field.
            // `engine` is initialized in the member list, so the value is
            // defined — but a null check in the finalizer remains mandatory.
        }

        double Calculate(double value, double factor)
        {
            if (engine == nullptr)
            {
                throw gcnew ObjectDisposedException(
                    "EngineBridge"
                );
            }

            try
            {
                return engine->Calculate(value, factor);
            }
            catch (const std::invalid_argument& ex)
            {
                throw gcnew ArgumentException(
                    gcnew String(ex.what())
                );
            }
            catch (const std::exception& ex)
            {
                throw gcnew InvalidOperationException(
                    "Native engine operation failed",
                    gcnew Exception(gcnew String(ex.what()))
                );
            }
        }

        ~EngineBridge()
        {
            this->!EngineBridge();
        }

        !EngineBridge()
        {
            delete engine;
            engine = nullptr;
        }
    };
}
```

Three things are happening here, and each one is a decision, not boilerplate.

**First: a managed class owns a native resource.** That is the structural problem in miniature. `EngineBridge` lives in the .NET world; `NativeEngine` came from `new` and will never be touched by the GC. The collector can see the reference to the bridge and knows when *the bridge* is garbage. It cannot see through `engine` to know what releasing it means — it has no idea whether releasing implies `delete`, `CloseHandle`, `fclose`, or a pool return. So you tell it, through a deterministic path.

**Second: the bridge translates errors.** `std::invalid_argument` becomes `System::ArgumentException`. Now the C# consumer can write a `catch` that means something.

In production the policy needs to be more careful than this example: log with context, separate expected failures from unexpected ones, preserve diagnostic information without leaking sensitive data into a message the user will see. And note the `catch (...)` that is deliberately *absent* here — more on that in section 9.

**Third: there is an explicit destruction policy.** In C++/CLI, `~EngineBridge()` is the destructor of a `ref class` — it is what implements `Dispose()` for .NET consumers. `!EngineBridge()` is the finalizer, the non-deterministic path the GC invokes.

The destructor calls the finalizer so the native release lives in exactly one place. Setting `engine = nullptr` afterwards makes cleanup idempotent — and you need that, because `Dispose()` followed by finalization is normal, not exceptional. **Every bridge you write will be disposed twice. Design for it or debug it.**

The optimal consumer always releases explicitly, via `using`. The GC exists as a safety net for the case where someone forgot, not as the intended release path.

### 4.3. Consuming from C#

```csharp
using System;
using Interop;

public class Program
{
    public static void Main()
    {
        using var engine = new EngineBridge();

        try
        {
            double result = engine.Calculate(100, 1.25);

            Console.WriteLine($"Result: {result}");
        }
        catch (ArgumentException ex)
        {
            Console.WriteLine($"Invalid input: {ex.Message}");
        }
    }
}
```

C# never sees a `NativeEngine*`. It sees a class that exposes `Calculate()` and participates in `IDisposable`. The `using` gives deterministic release at scope exit — including when the exception is thrown.

**That `using` is doing more than tidying up.** Without it, release happens whenever the GC gets around to it, which under high allocation pressure may be never during the process's useful lifetime. A bridge that holds a file handle, a device, or a large unmanaged buffer and relies on finalization is a resource leak with a scheduled-in-theory cleanup.

To build this: a Windows solution with the native C++ library, a C++/CLI DLL project with **CLR support** enabled, and a .NET application referencing the interop DLL. Architecture targets must match end to end — an `x86` bridge loaded by an `x64` host fails at load time with a `BadImageFormatException` that names the assembly, not the mismatch, so check `Platform Target` on all three projects first when a bridge "doesn't work."

## 5. The Real Problem: Two Memory Models

The C# side creates a bridge. The bridge creates a native object.

Who destroys it?

The GC knows the managed object. It has no automatic knowledge of the ownership semantics of an arbitrary C++ pointer.

- Lose the reference to the native resource without releasing it → **leak**.
- Release it while something else still uses the address → **lifetime bug** (use-after-free, and the symptom appears in an unrelated code path).
- Release it twice → **double free** (heap corruption now, crash later, blame assigned to the wrong module).

| Resource kind | Who owns release |
|---|---|
| Ordinary C# object | Garbage Collector |
| C++ object on the stack | RAII, destructor, scope exit |
| `std::unique_ptr<T>` | Exclusive ownership, RAII |
| `std::shared_ptr<T>` | Shared ownership, control block |
| C++/CLI bridge holding native state | Deterministic release, usually `IDisposable` |

The improvement that pays for itself in larger applications: **keep real ownership inside a native class using `std::unique_ptr`, and let the managed bridge hold only a pointer to that structure.**

The resource logic stays encapsulated in the C++ domain; C++/CLI is reduced to controlling the bridge's lifetime. It is a small difference in the diagram and a large one in maintenance, because the day someone other than you edits the native side, the ownership rules are still enforced by the C++ type system instead of by convention.

### The rule that catches most of these

Before writing any wrapper, answer this on paper: *for each native resource crossing the boundary, name the single instruction that releases it, and name every path that can reach that instruction.*

If the answer is "somewhere in the caller," or "the GC eventually," or "the destructor, unless it throws earlier," there is a defect waiting on a schedule. The three classic shapes are worth recognizing by sight:

- **Half-owned**: the bridge creates the resource but the caller is documented as "responsible for calling `Close()`." No reviewer remembers this; no compiler enforces it.
- **Double-owned**: both the bridge's finalizer and an explicit `Close()` delete the pointer, and the pointer is not nulled. Works forever on one code path, corrupts the heap on the second.
- **Shared-address**: two bridges hold the same `NativeEngine*`. Both destructors run. The second one frees memory that the allocator has already reused.

## 6. Why Not Just Call C++ with P/Invoke?

Fair question, and often the right answer.

C# has *Platform Invocation Services*. You call functions exported by native DLLs through a C-ABI-compatible signature:

```cpp
extern "C" __declspec(dllexport)
int __cdecl Sum(int a, int b)
{
    return a + b;
}
```

```csharp
using System.Runtime.InteropServices;

public static class NativeMethods
{
    [DllImport(
        "NativeMath.dll",
        CallingConvention = CallingConvention.Cdecl
    )]
    public static extern int Sum(int a, int b);
}
```

```csharp
int result = NativeMethods.Sum(10, 20);
```

No C++/CLI project, no CLR-enabled DLL, and it can be cross-platform (same `DllImport` shape on Linux/macOS with `__attribute__((visibility("default")))`). For a handful of functions, this is the correct choice and reaching for a C++/CLI project is over-engineering.

So why use a bridge at all?

Because simple native functions are not the whole complexity of a C++ library. Consider an API with classes, inheritance, stateful objects, callbacks, and types like `std::string` or `std::vector`. Those types do not form a stable ABI that P/Invoke can consume. Their layout is implementation-defined and changes with the standard library, the compiler version, and the build flags.

You *can* hide all of it behind an opaque-handle C API — `CreateEngine()`, `EngineCalculate(handle, …)`, `DestroyEngine(handle)`. This is a perfectly valid design and, for many teams, the better long-term one: it is a small, stable, language-agnostic surface that survives compiler upgrades and works from Python, Rust, or a test binary.

What it costs is a second interface you now design, implement, and maintain. C++/CLI lets you build the object-oriented bridge directly on top of classes you already have, with no new C surface.

### Which one

| Criterion | P/Invoke | C++/CLI |
|---|---|---|
| Simple C-style native API | Ideal | Possible, probably unnecessary |
| Library with many C++ classes | You must design a C surface | Adapts existing classes directly |
| Rich .NET type integration | Explicit marshaling | Direct access to managed types |
| Portability | Can be cross-platform | Windows only |
| Long-term evolution | Good with a stable ABI | Good for existing Windows/.NET |
| Lifetime complexity | Needs an explicit contract | Needs an explicit contract |

The last row is the one people skip. **Neither technology removes the ownership problem.** They offer different tools for solving it, and a bridge written by someone who has not thought about ownership is exactly as leaky as a `DllImport` written by the same person. The technology is not the safety property.

## 7. Marshaling: The Data Has to Cross Too

`int` and `double` make the example look easy. Real systems move strings, arrays, buffers, structs, and objects.

Moving those between C# and C++ involves *marshaling* — adapting representations. You may have a `System::String^` on one side and need a `std::string` on the other. C++/CLI gives you `msclr::interop::marshal_as` for that.

The utility is the easy part. The decisions are the hard part, and a real string conversion forces all of them:

- **Which encoding?** UTF-8, UTF-16, or the ANSI code page. `marshal_as<std::string>` on a `System::String^` does a narrow conversion that depends on the current locale — a decision you did not consciously make.
- **Who owns the resulting buffer?** If the native side keeps the pointer, someone has to free it, and that someone has to be the same allocator that produced it.
- **Does the data need copying at all?** For a read-only call, pinning (`pin_ptr`) avoids a copy — at the cost of defeating GC compaction for the duration. That is a real trade, not a free win.
- **How long is a pointer valid?** A pointer returned from a marshaling helper may be tied to a temporary's lifetime. Holding it past the call is a use-after-free that passes every test in debug.
- **Does it survive non-ASCII?** This is the one that ships. An application works for years with English names and then receives text with accents, a dash, or a character set the developer never tested. The bug appears as mojibake in the UI, or as a crash in a length calculation that assumed 1 byte per character.

The interoperability boundary needs an encoding policy that is written down and tested with non-ASCII input. **A single test string with accented characters, an emoji, and an RTL sample would have caught more interop bugs than any amount of code review.**

The same applies to data structures. If the C++ side produces 50,000 records and the UI receives them one call at a time, you have designed a per-record boundary crossing, and the cost of integration becomes the dominant cost. An API that returns a batch is often dramatically better than one that returns a single item, because the fixed cost of crossing (transition, marshaling of arguments, exception-handling setup) is amortized rather than paid 50,000 times.

But measure the decision. Batching adds memory pressure and a serialization surface. "Batch it" is a hypothesis, not a rule.

## 8. Performance: Is Interop the Bottleneck?

Not necessarily — and the question is usually asked in the wrong direction.

A managed-to-native call costs something: transition overhead, possible marshaling, and the fact that the JIT cannot inline or devirtualize across the boundary, so it cannot optimize the call the way it optimizes pure C#.

Two scenarios:

**Scenario one.** The user requests a calculation that takes 300 ms. You cross the boundary once. The transition cost is measured in nanoseconds. It is noise. The engine is the profile.

**Scenario two.** A rendering loop calls a native function 2 million times per second, converting a `string` to a `wchar_t*` on each call. Here the transition and the conversion are *the* workload, and no amount of engine optimization helps.

Where I would start measuring:

1. Time inside the native library (native profiler, not the managed one)
2. Time in type conversions and marshaling
3. Number of boundary crossings per operation
4. Allocations and copies attributable to the boundary
5. Perceived latency in the UI — p95 and p99, not the mean

If most of the time is inside the native library, optimizing marshaling is a distraction. If the app makes thousands of tiny calls, batching or a coarse-grained API is the fix.

**The question is not whether C++/CLI is fast. It is where the time is going — and the boundary is only a suspect until you have a measurement.**

One pattern worth calling out because it looks like an optimization and is a defect: **caching a native handle across a call to avoid "recreating it."** If the object that owns that handle can be disposed by another thread — or by the GC if the wrapper was finalized — you have traded a measured cost for an unmeasured use-after-free. Cache ownership, not handles.

## 9. Exceptions: Never Let the Boundary Decide for You

A native library throws `std::runtime_error`, `std::invalid_argument`, and whatever else its authors chose. The C# application expects the .NET exception hierarchy.

The interop contract has to state which failures are translated, how they are communicated, and what the consumer is expected to do:

- **Invalid input** → an exception the caller can handle and show to a user (`ArgumentException`).
- **Transient external failure** → possibly retryable; the type should say so (`IOException`, a custom `TransientException`).
- **Invariant violation** → a bug; log with context and let it fail loudly.
- **Unexpected failure** → preserve enough context to diagnose later, without leaking secrets into the message.

What is never acceptable:

```cpp
try
{
    return engine->Calculate(value, factor);
}
catch (...)
{
    return 0.0; // success and failure are now indistinguishable
}
```

This deletes the most valuable information in the system: whether the calculation actually happened. And zero is often a legitimate result — which means the caller cannot even detect the failure by looking at the value.

There is a second, subtler reason `catch (...)` at a boundary is dangerous: in C++/CLI, a managed exception can be caught by a native `catch (...)`. Swallowing it there discards a managed exception that the .NET code was prepared to handle, and the stack trace goes with it.

And where you expose a C ABI, **no C++ exception may escape a function that has no documented way to carry it.** Across `extern "C"`, unwinding into a caller built by a different compiler with different exception tables is undefined behavior — it may work for years, then crash on a machine with a different runtime. Wrap the body in `try`/`catch(...)` and convert to an error code. That is not defensive programming; it is the ABI's requirement.

| Native failure | .NET surface | Caller action |
|---|---|---|
| `std::invalid_argument` | `ArgumentException` | Fix the input, show a message |
| `std::out_of_range` | `ArgumentOutOfRangeException` | Clamp or reject |
| `std::bad_alloc` | `OutOfMemoryException` | Fail the operation, free caches |
| I/O failure | `IOException` | Retry policy |
| Anything else | `InvalidOperationException` + inner | Log with context, fail |
| Exception crossing `extern "C"` | *(undefined behavior)* | Must never happen |

## 10. When the Desktop App Freezes

Another common problem in hybrid applications is responsiveness, and it is usually diagnosed wrong.

The user asks to load a large model. C# calls C++, then waits for the calculation. If that call happens on the UI thread, the window goes white and Windows offers to close it.

Adding `async` to the C# method does not fix this. `async` is a mechanism for rearranging continuations; it does not create a thread. A synchronous native call inside an `async` method still blocks the thread it runs on. You have added state machine overhead and kept the freeze.

You need to decide **where the work runs**:

- For CPU-bound work: `Task.Run` (or a dedicated scheduler) moves the call off the UI thread. Now you need concurrency control, cancellation where the native API supports it, and a clear policy for the lifetime of every object involved — the native engine is now being used from a thread pool thread while the UI may want to dispose it.
- For I/O-bound work: true asynchrony requires a native API that can be awaited. A blocking `Read()` wrapped in `Task.Run` consumes a thread per call; at 200 concurrent operations that is thread-pool starvation, and the app stops responding in a way that looks like a different bug entirely.

Results must return to the UI through the framework's own mechanism — WPF's `Dispatcher.Invoke`/`await` on the synchronization context, or the Windows Forms invocation infrastructure. Touching a control from a background thread throws `InvalidOperationException` at best and corrupts the window handle at worst.

And if two calls can hit the same native instance concurrently, you must know whether the implementation is thread-safe. Most mature C++ libraries are not, and the documentation that says "not thread-safe" is easy to miss. Moving the call to another thread does not make the object safe; it makes the race intermittent — which is worse, because it passes CI.

**Concurrency policy belongs to the architecture, not to the thread that happens to call the function.**

## 11. Debugging: When the Bug Is in the Other Language

In a C#-with-native-C++ application, a crash surfaces in the front end even when the defect is in the engine. An invalid pointer, heap corruption, or a use-after-free can produce symptoms far from the cause — a wrong number in a grid, a silent no-op, a crash in code that was never edited.

Debugging has to cross the layers:

- Configure **mixed-mode debugging** in Visual Studio so you can step from C# into C++ and back.
- Build **symbols** (PDB) for every module involved, including third-party ones where available.
- Inspect **both** stacks — the managed stack and the native stack — and learn to read where they meet.
- Verify **architecture compatibility** (all `x64`, or all `x86`).
- Investigate the **lifetime** of objects that cross the integration, not just their values.
- Use native-appropriate memory diagnostics — Application Verifier, PageHeap, AddressSanitizer where it fits, CRT debug heap.
- **Correlate logs** between the UI and the processing engine with a shared correlation id. Without one, you are matching timestamps by hand.

A pattern worth recognizing on sight: the UI works for the first calculation and fails only when the user runs the same operation again. That is a lifetime signature — an object was destroyed, and something still holds a reference that lets it be accessed. "The second click closes the app" is a symptom; the investigation has to answer *who created the object, who could have destroyed it, and what was accessing it when it died.*

The second pattern: it only fails in Release. That is usually an optimizer-visible lifetime bug — the object's last use is in native code and you kept a pointer past it, which Debug does not notice because the memory is still intact.

## 12. How I Would Test This Integration

A design good enough to test is a design good enough to own. Each layer, separately:

**The native library.** Unit tests on algorithms and domain rules, with no UI and no CLR. This is the largest test surface and the cheapest to run — it should also be the largest source of confidence.

**The bridge.** Integration tests on the boundary itself:

| Scenario | Expected |
|---|---|
| Valid parameters | Correct result |
| Invalid input | The specific .NET exception type |
| Object already disposed | `ObjectDisposedException` |
| Double dispose | No double free, no crash |
| Dispose after finalizer ran | No double free |
| Unexpected engine failure | Observable error with context |
| Concurrent calls | Behavior defined by the contract |
| Repeated create/dispose | No abnormal growth in native resources |
| Non-ASCII string input | Round-trips correctly |

That "repeated create/dispose" row is the one that catches the leaks. Do it 10,000 times and watch the process's handle count or private bytes. A slow growth curve is visible in a test and invisible in a demo.

**The UI.** Tests that slow operations do not leave the app permanently blocked, that errors surface as messages rather than silent failures, and that closing the window during a long operation disposes the engine instead of racing it.

Not everything can be automated with unit tests. Some interop defects require real integration runs, memory diagnostics, and a Windows configuration matching production. And test the **installation and upgrade path** too: a hybrid application depends on correctly distributing managed assemblies, native DLLs, and runtimes — a bridge that works on the dev machine and fails on a customer's machine is usually a missing x64 redistributable or a DLL loaded from the wrong directory.

## 13. Is C++/CLI Still Worth It?

Yes, conditionally.

If a company owns a large, mature, valuable C++ library, rewriting it in C# to make the UI easier introduces risk with no product payoff. An interop layer preserves the implementation and exposes its capabilities to .NET. That is a real, defensible engineering choice, especially in engineering desktop software, industrial applications, and systems that integrate specialized native components.

Also true: C++/CLI is Windows-bound. In modern .NET, C++/CLI projects carry their own build and distribution restrictions, and they cannot be cross-compiled from Linux. Microsoft's own guidance points new development toward other options — particularly when portability and long-term platform evolution are priorities.

For new systems, consider a C ABI with P/Invoke, generated bindings (CSnakes, ClangSharp, or SWIG-style generators), or process separation — a small native service with an IPC contract. Process separation is underrated: it gives you crash isolation, independent deployment, and a language-agnostic boundary, at the cost of serialization and IPC latency. For a calculation engine that takes 300 ms, that cost is irrelevant. For a per-frame callback, it is impossible.

The best tool is not the newest one. It is the one that **preserves your contracts, controls your resources, and lets the system evolve without multiplying its failure points.** For a Windows shop with an existing C++ core, C++/CLI often still wins that comparison.

## 14. What I Look For in Code Review

Reviewing a C# ↔ C++ integration, I start with objective questions, because subjective ones ("is this clean?") produce opinions instead of defects:

- **Who owns each native resource?** Name the owner for every pointer.
- **Does release still happen when an exception is thrown mid-operation?**
- **Is access possible after `Dispose`?** Is the null check the *only* guard, and is it checked before every use?
- **Does the error contract distinguish invalid input from internal failure?**
- **Do strings and buffers have a defined encoding and lifetime?**
- **Are concurrent calls allowed?** Is that written down or assumed?
- **Can the UI block?**
- **Does the integration do excessive copies or crossings?**
- **Is it tested against the same runtime and architecture as production?**

The interesting part: almost none of those questions is specific to C++/CLI. They are software engineering questions. The technology only makes the consequences more visible — and less forgiving.

## Conclusion: The Boundary Is Part of the Architecture

Connecting C# and C++ is not hard when the problem is calling a function that takes two numbers.

The difficulty arrives with state, resources, concurrency, exceptions, and the requirement to keep evolving.

The CLR does not repeal C++'s lifetime rules. C++'s RAII does not make the garbage collector disappear. Two models have to meet in a contract that says exactly where each responsibility starts and stops — and someone has to write that contract down, because a contract that exists only in the original author's head is a bug with a delivery date.

My approach: keep domain logic in native C++, expose a small and stable managed interface, document ownership, translate errors explicitly, and **measure the cost of the integration before trying to optimize it.** Almost every performance disaster I have seen in hybrid systems was caused by an unmeasured optimization that introduced an ownership bug, not by the boundary being slow.

**A good interoperability layer is not the one that lets you call everything. It is the one that makes it clear what may be called, who is responsible for the result, and what happens when something goes wrong.**

That principle carries to any hybrid system — a traditional Windows application, a calculation engine, or a CAD tool.

## Keep Reading

- [C++/CLI and Interop — the Portuguese edition of this article](/pt/artigos-tecnicos/clr-cpp-cli-interop/)
- [RAII in C++ — Ownership as a Type, Not a Convention](/en/artigos-tecnicos/raii/) — the native half of this article's argument, in depth.
- [Smart Pointers in C++ — unique_ptr, shared_ptr and weak_ptr](/en/artigos-tecnicos/smart-pointers/) — how to keep real ownership inside the native class.
- [Parallelism vs. Concurrency](/en/artigos-tecnicos/paralelismo-vs-concorrencia/) — what "is it thread-safe" actually asks.
- [C++ in High-Frequency Trading](/en/artigos-tecnicos/cpp-hft-low-latency/) — why deterministic cleanup matters when nanoseconds are money.
- [The C++ Learning Path](/en/reference/trilha-cpp/) — the ownership module, exercises and a free modernization checklist.

## References

- [Microsoft Learn — Native and .NET Interoperability](https://learn.microsoft.com/en-us/cpp/dotnet/native-and-dotnet-interoperability?view=msvc-170)
- [Microsoft Learn — .NET Programming with C++/CLI](https://learn.microsoft.com/en-us/cpp/dotnet/dotnet-programming-with-cpp-cli-visual-cpp?view=msvc-170)
- [Microsoft Learn — How to Port C++/CLI Projects to .NET](https://learn.microsoft.com/en-us/dotnet/core/porting/cpp-cli)
- [Microsoft Learn — How to: Define and Consume Classes and Structs (C++/CLI)](https://learn.microsoft.com/en-us/cpp/dotnet/how-to-define-and-consume-classes-and-structs-cpp-cli?view=msvc-170)
- [Microsoft Learn — Overview of Marshaling in C++](https://learn.microsoft.com/en-us/cpp/dotnet/overview-of-marshaling-in-cpp?view=msvc-170)
- [Microsoft Learn — Managed Exceptions and Interop](https://learn.microsoft.com/en-us/dotnet/standard/native-interop/exceptions-interop)

Every native resource you acquire is a promise to release it exactly once. The boundary is where that promise either gets a contract or gets forgotten.
