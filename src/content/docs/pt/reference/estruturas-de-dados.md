---
title: Estruturas de Dados
description: Aprenda a organizar dados corretamente para reduzir complexidade e melhorar performance.
---

Estrutura de dados é o **formato** que você escolhe para guardar e manipular informação.

A mesma regra de negócio pode ficar simples ou impossível de manter dependendo dessa escolha.

## Por que isso importa tanto

Quando você escolhe uma estrutura errada, o sistema sofre com:

- buscas lentas;
- código difícil de ler;
- regras duplicadas;
- bugs por manipulação confusa.

Quando escolhe certo, ganha clareza e velocidade.

## Estruturas fundamentais para estudar primeiro

### Array / Lista

Boa para coleção ordenada, leitura por índice e iteração simples.

### Pilha (Stack)

Modelo LIFO (último que entra, primeiro que sai). Útil para histórico, desfazer ações, parsing.

### Fila (Queue)

Modelo FIFO (primeiro que entra, primeiro que sai). Útil para processamento assíncrono e filas de tarefas.

### Mapa / Dicionário (HashMap)

Acesso por chave. Excelente para lookup rápido (`id -> objeto`).

### Conjunto (Set)

Coleção sem duplicatas. Ótimo para garantir unicidade e membership check.

## Como escolher a estrutura certa

Pergunte sempre:

1. O acesso principal será por índice, chave, ordem ou prioridade?
2. O dado precisa manter ordem de inserção?
3. Vai ter muita busca, muita escrita ou ambos?
4. Existe requisito de unicidade?

A resposta dessas perguntas normalmente define sua escolha.

## Erros comuns de iniciante

- usar lista para tudo;
- ignorar custo de busca linear;
- duplicar dados em várias estruturas sem sincronização;
- não encapsular operações da estrutura em funções claras.

## Exemplo mental útil

Pense em um sistema de pedidos:

- `Queue` para processar pedidos pendentes;
- `Map` para encontrar pedido por ID rapidamente;
- `Set` para evitar processamento duplicado;
- `Array` para renderização ordenada na interface.

Cada estrutura resolve um problema diferente dentro do mesmo fluxo.

## Exercícios práticos

1. Implemente uma lista de tarefas com prioridade.
2. Use `Map` para acessar tarefa por ID.
3. Use `Set` para impedir tags duplicadas.
4. Crie fila de execução para tarefas pendentes.

## Checklist rápido

- Você sabe a diferença entre lista, fila e pilha?
- Você entende quando usar mapa em vez de lista?
- Você considera custo de busca/inserção ao modelar?
- Sua estrutura reflete a regra de negócio real?

Se sim, você já começou a pensar como engenheiro e não apenas como “escrevedor de código”.
