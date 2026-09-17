# Checklist de modernização de C++

Uma mudança pequena, uma justificativa clara, uma evidência verificável.

Trilha: https://dionisio.dev/pt/reference/trilha-cpp/

## Contexto da mudança

- Projeto / revisão:
- Responsável:
- Problema observado:
- Resultado esperado:
- Compilador e versão:
- Biblioteca padrão e versão:
- Padrão selecionado e flags:
- Plataformas e dependências afetadas:

## Antes de editar

- [ ] Reproduzi o problema ou documentei a dificuldade de manutenção.
- [ ] Conferi o suporte da feature no compilador E na biblioteca usados pelo CI.
- [ ] Registrei o comportamento esperado e os testes relevantes.
- [ ] Separei a modernização de mudanças funcionais não relacionadas.

## Recursos e interfaces

- [ ] Cada recurso tem um dono e um momento de liberação identificáveis.
- [ ] Verifiquei primeiro se valores, containers e objetos RAII resolvem a necessidade.
- [ ] Posse exclusiva de memória dinâmica usa `unique_ptr` quando apropriado.
- [ ] Posse compartilhada tem uma justificativa; ciclos foram considerados.
- [ ] Ponteiros, referências, spans e views não sobrevivem aos dados observados.
- [ ] Parâmetros deixam claro se emprestam, copiam ou recebem posse.
- [ ] O código não depende de um estado não garantido de objetos após move.
- [ ] Classes com recursos próprios têm operações especiais coerentes; prefiro delegar a gestão a membros RAII.

## Legibilidade e compatibilidade

- [ ] Algoritmos, concepts ou ranges tornam a intenção mais clara nesta mudança.
- [ ] Os requisitos dos templates correspondem às operações realmente usadas.
- [ ] Avaliação adiada e tempo de vida de views foram revisados.
- [ ] ABI, formatos persistidos e consumidores externos foram avaliados, quando aplicável.
- [ ] A documentação informa a menor versão de C++ necessária.

## Validação

- [ ] Compilei nas combinações suportadas pelo projeto e revisei novos warnings.
- [ ] Rodei testes de sucesso, falha e limpeza de recursos relevantes.
- [ ] Usei sanitizers ou análise estática quando disponíveis e adequados.
- [ ] Se aleguei ganho de desempenho, preservei entradas, saída e método comparáveis.
- [ ] Registrei hardware, flags, carga, amostras e variação do benchmark.
- [ ] Para latência, examinei percentis e erros além da média.
- [ ] O PR explica o motivo, a alteração, a evidência e como reverter.

## Evidência para o PR

- Antes:
- Depois:
- Comandos e ambiente:
- Testes / resultados:
- Limitações conhecidas:
- Próximo passo:

Referências: https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines
Suporte GCC: https://gcc.gnu.org/projects/cxx-status.html
Suporte Clang: https://clang.llvm.org/cxx_status.html
