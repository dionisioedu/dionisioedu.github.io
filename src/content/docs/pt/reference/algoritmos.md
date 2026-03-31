---
title: Algoritmos
description: Aprenda a resolver problemas de forma correta, clara e eficiente sem cair na armadilha da complexidade desnecessária.
---

Algoritmo é um passo a passo finito para resolver um problema.

Só que no mundo real, não basta “resolver de algum jeito”.

Você precisa resolver de um jeito que seja:

- correto
- compreensível
- testável
- viável quando a entrada cresce

## O que diferencia um algoritmo bom de um algoritmo meia-boca

Um algoritmo bom:

- devolve a resposta certa
- termina em tempo finito
- é fácil de entender e revisar
- escala de forma razoável

Um algoritmo ruim geralmente faz uma destas coisas:

- quebra em caso de borda
- só funciona no exemplo feliz
- fica lento demais quando cresce
- é tão confuso que ninguém quer tocar

## Primeiro: corretude. Depois: performance.

Muita gente quer falar de Big-O cedo demais.

Só que antes de otimizar, você precisa garantir que a solução:

- realmente resolve o problema
- cobre os casos importantes
- tem uma ideia consistente

Regra prática:

**solução correta e simples > solução “genial” e errada**

## Como pensar antes de implementar

Antes de abrir o editor, responde:

1. qual é a entrada?
2. qual é a saída?
3. quais restrições existem?
4. qual é o caso mais simples?
5. o que pode dar errado?

Esse processo evita muita digitação inútil.

## Complexidade: o mínimo que você precisa sentir

Você não precisa decorar todas as fórmulas agora.

Mas precisa sentir a diferença entre:

- `O(1)`: custo constante
- `O(log n)`: cresce devagar
- `O(n)`: cresce linearmente
- `O(n²)`: cresce rápido e começa a machucar

Exemplo mental:

- comparar cada item com cada item costuma explodir
- passar uma vez pela coleção costuma ser saudável

Em projeto real, isso separa:

- “funciona na demo”
- de “aguenta produção”

## Famílias clássicas de estratégia

### Força bruta

Tenta tudo até achar resposta.

Boa quando:

- o problema é pequeno
- você quer validar a ideia
- precisa de uma primeira solução correta

Ruim quando:

- o espaço de busca explode

### Dividir para conquistar

Você quebra o problema em partes menores, resolve e depois combina.

Exemplos clássicos:

- merge sort
- binary search

### Guloso

Você toma a melhor decisão local em cada passo.

Funciona muito bem em alguns problemas.
Em outros, dá resposta errada com confiança.

### Programação dinâmica

Você guarda resultados parciais para não recalcular.

É poderosa, mas só faz sentido quando existe:

- subproblema repetido
- estrutura ótima reutilizável

## Processo recomendado para resolver problema

1. entenda o enunciado sem pressa
2. faça 2 ou 3 exemplos manuais
3. escreva pseudocódigo
4. implemente a versão simples
5. teste casos de borda
6. só então pense em otimização

Esse fluxo parece mais lento no começo.

Na prática, ele economiza tempo.

## Exemplo direto

Problema:

“Encontrar duplicados em uma lista.”

### Solução 1

Comparar todo mundo com todo mundo.

- simples
- correta
- custo ruim: `O(n²)`

### Solução 2

Passar pela lista guardando os vistos em um `Set`.

- simples
- correta
- custo melhor: perto de `O(n)`

Esse tipo de comparação é o coração do raciocínio algorítmico.

## Erros comuns

- otimizar cedo demais
- ignorar caso vazio
- ignorar valor nulo
- não provar para si mesmo por que a solução funciona
- complicar um problema que pedia solução direta

## Quando otimizar de verdade

Você deve pensar seriamente em otimização quando:

- a entrada pode crescer muito
- a operação roda toda hora
- o custo já virou gargalo real
- há requisito claro de performance

Se não existe gargalo real, às vezes a melhor decisão é manter a solução simples.

## Exercícios que realmente constroem base

1. busca linear
2. busca binária
3. encontrar maior e menor valor
4. remover duplicados
5. contar frequência de elementos
6. ordenar por inserção ou seleção

Em cada exercício, pergunte:

- está certo?
- está claro?
- dá para explicar?
- dá para melhorar?

## Checklist rápido

- Você separa corretude de otimização?
- Você pensa em entrada, saída e restrições?
- Você testa caso simples e caso de borda?
- Você consegue explicar por que sua solução funciona?

Se sim, seu raciocínio algorítmico já está ficando forte de verdade.

## Próximas ações

- Consolide com [Estruturas de Dados e Algoritmos](/pt/reference/dsa/)
- Depois aplique esse raciocínio em [Projetos](/pt/projects/)
