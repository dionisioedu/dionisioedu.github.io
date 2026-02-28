---
title: Tipos de Dados
description: Entenda como representar informação de forma correta para escrever código mais seguro, legível e eficiente.
---

Tipos de dados são a base de tudo em programação. Eles dizem ao computador **que tipo de informação** você quer armazenar, como essa informação deve ser interpretada e quais operações fazem sentido nela.

Se você erra aqui, o resto do código vira uma sequência de correções e exceções.

## O que são tipos de dados

Um tipo de dado define:

- o **conjunto de valores** possíveis;
- as **operações válidas**;
- a **forma de armazenamento** em memória.

Exemplo simples:

- inteiro: `-2`, `0`, `42`
- decimal: `3.14`, `0.5`
- texto: `"Olá"`
- lógico: `true` ou `false`

## Tipos primitivos que você deve dominar

### Números inteiros

Use quando não existe parte fracionária: quantidade de usuários, idade, número de tentativas.

### Números decimais

Use quando existe fração: preço, distância, temperatura.

### Texto (string)

Use para nomes, mensagens, IDs textuais, emails.

### Booleano

Use para estados binários: ativo/inativo, logado/deslogado, válido/inválido.

## Conversão de tipos (casting)

Converter de um tipo para outro é normal, mas perigoso se feito sem cuidado.

Erros comuns:

- converter texto inválido para número;
- perder precisão ao converter decimal para inteiro;
- comparar tipos diferentes sem normalizar antes.

Regra prática: **valide primeiro, converta depois**.

## Tipagem fraca vs tipagem forte

- Tipagem forte: menos surpresas em runtime, erros aparecem mais cedo.
- Tipagem fraca: mais flexibilidade, mas exige mais disciplina.

Nenhuma abordagem elimina bugs sozinha. O que elimina é combinação de:

- modelagem correta;
- validação de entrada;
- testes.

## Boas práticas que aceleram seu aprendizado

- Dê nome claro às variáveis: `idadeUsuario` comunica mais que `x`.
- Evite armazenar número como texto sem necessidade.
- Centralize validações em funções utilitárias.
- Prefira tipos explícitos em dados críticos (preço, saldo, permissões).

## Exercícios práticos

1. Crie um cadastro simples com nome, idade e email.
2. Valide se idade é número inteiro e maior que zero.
3. Converta entradas textuais para os tipos corretos.
4. Exiba mensagens de erro claras quando o tipo não for válido.

## Checklist rápido

- Você sabe quando usar inteiro vs decimal?
- Você valida antes de converter?
- Você evita comparar tipos incompatíveis?
- Você entende o impacto do tipo na regra de negócio?

Se a resposta for “sim” para esses pontos, sua base já está muito melhor que a média de quem está começando.