---
title: "Corrotinas e Programação Assíncrona em C++ Moderno"
description: "Entenda co_await, o estado de uma coroutine e a diferença para std::async. Exemplos em C++20 com Asio, tratamento de erros, lifetime e cancelamento."
publishedAt: 2026-09-26
author: Dionisio
tags:
  - C++
  - Concorrência
  - Programação Assíncrona
  - Engenharia de Software
cover: /assets/images/cpp-coroutines.webp
coverAlt: Uma coroutine suspende em co_await, libera a thread para outro trabalho e retoma após a conclusão da operação
---

<section class="ae-feature">
  <img src="/assets/images/cpp-coroutines.webp" alt="Uma coroutine suspende em co_await, libera a thread para outro trabalho e retoma após a conclusão da operação" width="1200" height="630" loading="eager" fetchpriority="high" decoding="async" />
  <div class="ae-feature-copy">
    <p class="ae-kicker">C++20 · Corrotinas · Assincronismo</p>
    <h2>O código espera. A thread precisa esperar junto?</h2>
    <p>Corrotinas permitem suspender uma função e continuar depois. A parte importante é entender quem cuida dessa continuação.</p>
    <div class="ae-meta"><span>Exemplos executáveis</span><span>Asio</span><span>Do fluxo ao lifetime</span></div>
  </div>
</section>

Seu serviço recebe uma requisição, consulta outro serviço e grava o resultado. O fluxo de negócio cabe em três linhas. A implementação cresce quando cada etapa precisa de um callback, um objeto de estado e um caminho de erro separado.

Corrotinas ajudam a escrever esse fluxo de forma linear, sem obrigar a thread a ficar parada durante cada espera. Mas `co_await` não transforma qualquer função em uma operação não bloqueante. E código com aparência sequencial ainda pode ter problemas de concorrência.

Vamos separar linguagem, biblioteca e execução, construir um exemplo completo e discutir os cuidados necessários antes de colocar esse modelo em produção. Os exemplos usam C++20; o principal usa **Asio standalone 1.30.2**, uma versão fixada para reprodução. Há uma [versão em inglês](/en/artigos-tecnicos/corrotinas-programacao-assincrona-cpp/).

## 1. O que é uma corrotina em C++?

Uma função comum entra, executa e retorna. Uma **corrotina** pode suspender sua execução e retomá-la depois, preservando o estado necessário. Em C++20, os operadores associados a esse mecanismo são:

| Construção | Papel |
| --- | --- |
| `co_await` | Aguardar um objeto que participa do protocolo de suspensão e retomada |
| `co_return` | Concluir a corrotina e entregar seu resultado ao mecanismo definido pelo tipo de retorno |
| `co_yield` | Produzir um valor através do protocolo da corrotina, comum em geradores |

O compilador mantém um **coroutine frame**: estado que pode sobreviver à chamada inicial. Ele inclui a posição de retomada e os objetos que precisam atravessar uma suspensão. Pode haver alocação dinâmica; certas alocações podem ser eliminadas pelo compilador. Não suponha custo zero. A documentação de [corrotinas no LLVM](https://llvm.org/docs/Coroutines.html) mostra como um compilador representa esse estado e pode otimizar sua alocação.

Corrotinas de C++ são *stackless*: preservam seu próprio estado, sem capturar arbitrariamente toda a pilha de chamadas. Se uma função comum chamada por elas bloquear, a thread continua bloqueada.

O tipo de retorno participa do contrato por meio de `promise_type`: define aspectos como resultado, exceções e suspensão inicial/final. Essa *promise* não é necessariamente um `std::promise`. Para usar corrotinas numa aplicação, normalmente você escolhe um tipo fornecido pela biblioteca, em vez de implementar esse mecanismo de baixo nível.

## 2. Corrotina não é thread, nem runtime de I/O

Uma corrotina descreve um fluxo que pode ser suspenso. Ela não cria automaticamente threads, conexões ou um event loop. Um **executor** define o contexto de execução; a biblioteca coordena operações e continuações.

Retome a distinção do artigo sobre [paralelismo e concorrência](/pt/artigos-tecnicos/paralelismo-vs-concorrencia/): duas corrotinas podem estar em andamento numa única thread. Isso permite sobrepor esperas, sem executar duas computações simultaneamente nessa thread.

```text
Thread:       A inicia → A suspende → B inicia → B suspende → outras tarefas
Operação A:             [........ espera ........] → pronta
Thread:                                                   A retoma
```

O desenho representa uma possibilidade, não uma ordem universal. Dependendo do executor, uma continuação pode até executar em outra thread. O contrato da biblioteca importa tanto quanto a sintaxe.

O protocolo de `co_await` consulta `await_ready()`, usa `await_suspend()` quando necessário e obtém o resultado por `await_resume()`. A operação pode estar pronta e não suspender. Existem ainda regras de transformação do objeto aguardado; veja [expr.await](https://eel.is/c++draft/expr.await). Por isso, não deduza “troca de thread” apenas ao encontrar um `co_await`.

## 3. Antes das corrotinas: o que `std::async` entrega?

`std::async` existe desde C++11 e retorna um `std::future`. Com a política explícita `std::launch::async`, a função é executada como em uma nova thread:

```cpp
// C++20 — future_example.cpp
#include <cassert>
#include <future>
#include <iostream>

int main() {
    auto answer = std::async(std::launch::async, [] {
        return 6 * 7;
    });

    // Independent work could happen here.
    const int value = answer.get();
    assert(value == 42);
    std::cout << value << '\n';
}
```

`get()` espera se o resultado ainda não estiver pronto e propaga uma exceção armazenada. Sem a política explícita, a implementação pode escolher execução adiada. A destruição de um future associado a `std::async` também pode esperar pela tarefa, conforme as condições do estado compartilhado. Esses detalhes estão no [contrato de `std::async`](https://eel.is/c++draft/futures.async).

Esse modelo pode servir para trabalho isolado, mas não oferece automaticamente um pool limitado de trabalhadores. Criar milhares de tarefas com essa política não equivale a um servidor de I/O escalável. E um `std::future` não se torna diretamente aguardável com `co_await` apenas por existir: isso exige uma integração que forneça o protocolo apropriado.

## 4. Exemplo completo: duas esperas, uma thread

Vamos usar timers para mostrar o comportamento sem depender de uma API externa, conexão de rede ou credenciais. Este é um exemplo de **espera assíncrona**, não um benchmark de processamento.

Asio standalone usa `asio::`. Boost.Asio oferece uma API relacionada em `boost::asio::`, mas a configuração de dependências é diferente. Aqui, use os headers do [Asio 1.30.2](https://github.com/chriskohlhoff/asio/tree/asio-1-30-2).

```cpp
// C++20 + standalone Asio 1.30.2 — coroutine_timers.cpp
#include <utility>
#include <asio.hpp>
#include <cassert>
#include <chrono>
#include <exception>
#include <iostream>
#include <string>

using namespace std::chrono_literals;

asio::awaitable<void> wait_and_report(
    std::string name, std::chrono::milliseconds delay) {
    const auto executor = co_await asio::this_coro::executor;
    asio::steady_timer timer(executor);
    timer.expires_after(delay);

    std::cout << name << " started\n";
    co_await timer.async_wait(asio::use_awaitable);
    std::cout << name << " completed\n";
    co_return;
}

int main() {
    asio::io_context context;
    int completed = 0;
    bool failed = false;

    auto on_complete = [&](std::exception_ptr error) {
        ++completed;
        if (!error) return;
        failed = true;
        try {
            std::rethrow_exception(error);
        } catch (const std::exception& e) {
            std::cerr << e.what() << '\n';
        } catch (...) {
            std::cerr << "Unknown coroutine error\n";
        }
    };

    asio::co_spawn(context, wait_and_report("A", 100ms), on_complete);
    asio::co_spawn(context, wait_and_report("B", 200ms), on_complete);
    context.run();

    assert(completed == 2);
    return failed ? 1 : 0;
}
```

### Quem faz o quê?

- `awaitable<void>` é o tipo de corrotina oferecido pelo Asio.
- `co_spawn` inicia cada fluxo no executor escolhido e conecta sua conclusão ao handler.
- `use_awaitable` integra a operação ao `co_await`; erros são convertidos em exceções nesse modo.
- `on_complete` recebe eventuais exceções que escapam da corrotina. Ele é uma lambda comum, não uma coroutine lambda.

Esses contratos estão na [documentação de corrotinas do Asio](https://think-async.com/Asio/asio-1.30.2/doc/asio/overview/composition/cpp20_coroutines.html).

`async_wait` registra a espera sem manter a thread executando o timer. A [documentação do timer](https://think-async.com/Asio/asio-1.30.2/doc/asio/reference/basic_waitable_timer/async_wait.html) especifica a conclusão por expiração ou cancelamento. Enquanto uma corrotina está suspensa, o event loop pode atender outro trabalho.

Há uma única chamada a [`context.run()`](https://think-async.com/Asio/asio-1.30.2/doc/asio/reference/io_context/run.html), na thread principal. Ela processa eventos e pode esperar quando não há trabalho pronto; não torna o restante de `main()` magicamente não bloqueante. Os handlers deste programa executam nessa mesma thread, por isso os contadores não precisam de atomics.

Em uma execução típica, você verá `A started`, `B started` e depois as conclusões. Não use a ordem exata nem 200 ms como garantia: agendamento e carga afetam o instante de atendimento. O ponto é que não precisamos terminar a espera de A antes de iniciar a de B.

### Como compilar

Para o primeiro exemplo, basta uma biblioteca padrão com suporte a futures. Para o segundo, configure o include do Asio. Exemplo em Linux com GCC e os headers disponíveis em `ASIO_INCLUDE`:

```bash
g++ -std=c++20 -O2 -Wall -Wextra -pedantic -pthread future_example.cpp -o future_example
g++ -std=c++20 -O2 -Wall -Wextra -pedantic -pthread -DASIO_STANDALONE -I"$ASIO_INCLUDE" coroutine_timers.cpp -o coroutine_timers
./future_example
./coroutine_timers
```

`ASIO_INCLUDE` deve apontar para a pasta que contém `asio.hpp`. Os dois exemplos foram compilados e executados no Windows com GCC 13.1 (MinGW). Para o exemplo Asio, este foi o comando validado em PowerShell:

```powershell
g++ -std=c++20 -O2 -Wall -Wextra -pedantic -pthread -mthreads -DASIO_STANDALONE -D_WIN32_WINNT=0x0601 -I "$env:ASIO_INCLUDE" coroutine_timers.cpp -o coroutine_timers.exe -lws2_32 -lmswsock
.\coroutine_timers.exe
```

Nessa toolchain, `-mthreads` permite que o Asio detecte o suporte a threads. Confira a combinação de compilador, biblioteca padrão e Asio; selecionar C++20 não instala as dependências.

## 5. Código linear não significa operações em paralelo

Se você aguarda uma operação e só depois inicia outra, construiu uma sequência. Isso pode ser exatamente o necessário: não dá para enviar o resultado de uma consulta antes de recebê-lo.

Quando operações são independentes, é preciso iniciá-las separadamente ou usar uma abstração de composição que a biblioteca forneça. No exemplo, as duas chamadas de `co_spawn` fazem isso. Escrever dois `co_await` em sequência não cria essa sobreposição por si só.

Também não coloque uma compressão pesada, um parser demorado ou `std::this_thread::sleep_for` no event loop esperando que a sintaxe resolva o bloqueio. Trabalho de CPU exige uma estratégia própria: divisão, executor apropriado e limite de trabalhadores. A retomada precisa preservar o contrato de acesso aos dados.

## 6. O risco que atravessa cada suspensão: lifetime

Uma suspensão separa dois momentos do programa. Entre eles, o chamador pode sair de escopo, uma conexão pode fechar ou um pedido pode ser cancelado.

No exemplo, `name` é passado por valor e o timer é local à corrotina. Ambos permanecem válidos durante a espera. Os contadores capturados pelo handler permanecem vivos até `run()` terminar. Se você colocar várias threads executando `run()`, esse argumento sobre acesso serial deixa de valer e o estado compartilhado precisa de proteção.

Três regras das [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-concurrency) ajudam na revisão:

- **CP.51:** evite lambdas com capturas que sejam corrotinas; a closure pode morrer antes da retomada.
- **CP.52:** não mantenha locks bloqueantes atravessando pontos de suspensão.
- **CP.53:** prefira parâmetros por valor a referências em corrotinas quando precisar preservar os dados.

Passar um ponteiro por valor não prolonga a vida do objeto apontado. O mesmo vale para `string_view`, spans e buffers emprestados. Defina quem possui cada recurso e quem pode destruí-lo enquanto uma operação o utiliza.

Não trate `coroutine_handle::destroy()` como um botão universal de cancelamento. Se uma operação pendente ainda puder retomar aquele estado, destruí-lo cedo demais cria um acesso inválido. Essa coordenação pertence ao contrato da biblioteca e da aplicação.

## 7. Erros, cancelamento e encerramento são parte do design

Uma implementação de produção precisa responder a quatro perguntas:

| Pergunta | Decisão necessária |
| --- | --- |
| A operação falhou? | Propagar, recuperar ou registrar com contexto; não descartar silenciosamente |
| O cliente desistiu? | Solicitar cancelamento por um mecanismo suportado e observar a conclusão |
| O prazo venceu? | Definir timeout e o destino do trabalho que já estava em andamento |
| O serviço está encerrando? | Parar novas entradas e resolver as operações existentes antes de liberar seus recursos |

No Asio, cancelar um timer pode concluir sua espera com `operation_aborted`. Isso não é igual a interromper qualquer código em qualquer linha. Um pedido de cancelamento precisa ser aceito e processado pelo mecanismo envolvido.

É tentador usar `detached` em todos os `co_spawn` para reduzir código. Mas isso elimina o canal de conclusão escolhido no exemplo. Quando você precisa contabilizar tarefas e tratar falhas, mantenha um caminho explícito de observação.

Limite também operações em andamento, buffers e filas. Milhares de corrotinas não ocupam necessariamente milhares de threads, mas continuam consumindo memória e pressionando serviços externos. Sintaxe mais limpa não remove a necessidade de backpressure.

## 8. Como avaliar se valeu a pena

Comece com um fluxo cujo problema real seja espera ou complexidade de composição. Compare legibilidade, cancelamento, consumo de memória, throughput e latência sob carga. Inclua falhas e encerramento nos testes, não só o caminho feliz.

O exemplo com timers não demonstra aceleração de CPU. Ele demonstra que o executor pode atender outro fluxo durante uma espera. Essa é a distinção que permite escolher a ferramenta sem prometer ganhos que ainda não foram medidos.

**Exercício:** acrescente uma terceira corrotina e faça uma delas lançar uma exceção antes do timer. Verifique que seu handler observa o erro e que as demais ainda concluem. Depois substitua uma espera assíncrona por uma espera bloqueante e observe o efeito no andamento das outras tarefas. Não transforme essa observação em um benchmark de produção.

## Conclusão: `co_await` torna a espera explícita, não automática

Corrotinas tornam fluxos assíncronos mais fáceis de expressar com variáveis locais, laços e tratamento de exceções. A linguagem fornece suspensão e retomada; a biblioteca fornece os tipos, as operações e a integração com a execução.

O resultado é bom quando o contrato também é claro: quem possui os dados, onde o código retoma, como os erros chegam ao responsável e quando o trabalho termina. **Antes de perguntar onde colocar `co_await`, pergunte o que pode esperar e quem vai cuidar da continuação.**

## Referências e próximos passos

- [C++ Working Draft — corrotinas](https://eel.is/c++draft/dcl.fct.def.coroutine), [`co_await`](https://eel.is/c++draft/expr.await) e [`std::async`](https://eel.is/c++draft/futures.async). O draft evolui; este artigo usa recursos de C++20 ou anteriores.
- [Asio 1.30.2 — suporte a corrotinas C++20](https://think-async.com/Asio/asio-1.30.2/doc/asio/overview/composition/cpp20_coroutines.html), [`async_wait`](https://think-async.com/Asio/asio-1.30.2/doc/asio/reference/basic_waitable_timer/async_wait.html) e [`io_context::run`](https://think-async.com/Asio/asio-1.30.2/doc/asio/reference/io_context/run.html).
- [C++ Core Guidelines — concorrência e paralelismo](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-concurrency): em especial CP.51, CP.52 e CP.53.
- No site: [paralelismo vs. concorrência](/pt/artigos-tecnicos/paralelismo-vs-concorrencia/), [C++ por versão](/pt/artigos-tecnicos/cpp-versoes-features/) e [trilha de C++](/pt/reference/trilha-cpp/).
