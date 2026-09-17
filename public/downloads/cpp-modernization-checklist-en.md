# C++ modernization checklist

A small change, a clear reason, and evidence someone else can check.

Learning path: https://dionisio.dev/en/reference/trilha-cpp/

## Change context

- Project / revision:
- Owner:
- Observed problem:
- Expected outcome:
- Compiler and version:
- Standard library and version:
- Selected standard and flags:
- Affected platforms and dependencies:

## Before editing

- [ ] I reproduced the issue or documented the maintenance difficulty.
- [ ] I checked feature support in BOTH the compiler and library used in CI.
- [ ] I recorded expected behavior and relevant tests.
- [ ] I separated modernization from unrelated functional changes.

## Resources and interfaces

- [ ] Each resource has an identifiable owner and release point.
- [ ] I first checked whether values, containers, and RAII objects fit the need.
- [ ] Exclusive ownership of dynamically allocated memory uses `unique_ptr` where appropriate.
- [ ] Shared ownership has a reason; cycles have been considered.
- [ ] Pointers, references, spans, and views do not outlive the data they observe.
- [ ] Parameters make borrowing, copying, or receiving ownership clear.
- [ ] Code does not rely on an unguaranteed state of moved-from objects.
- [ ] Resource-owning classes have coherent special member operations; I prefer delegating management to RAII members.

## Readability and compatibility

- [ ] Algorithms, concepts, or ranges make intent clearer in this change.
- [ ] Template requirements match the operations actually used.
- [ ] Lazy evaluation and view lifetimes have been reviewed.
- [ ] ABI, persisted formats, and external consumers were considered where applicable.
- [ ] Documentation states the minimum C++ version required.

## Validation

- [ ] I compiled on supported project configurations and reviewed new warnings.
- [ ] I ran relevant success, failure, and resource-cleanup tests.
- [ ] I used sanitizers or static analysis where available and appropriate.
- [ ] Any performance claim preserves comparable inputs, output, and methodology.
- [ ] I recorded hardware, flags, load, sample counts, and benchmark variation.
- [ ] For latency, I examined percentiles and errors alongside the mean.
- [ ] The PR explains the reason, change, evidence, and rollback.

## Evidence for the PR

- Before:
- After:
- Commands and environment:
- Tests / results:
- Known limitations:
- Next step:

References: https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines
GCC support: https://gcc.gnu.org/projects/cxx-status.html
Clang support: https://clang.llvm.org/cxx_status.html
