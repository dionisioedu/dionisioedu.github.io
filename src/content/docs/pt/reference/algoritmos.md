---
title: Algoritmos
description: Aprenda a construir soluções eficientes, previsíveis e fáceis de manter.
---

Algoritmo é um passo a passo finito para resolver um problema.

Programar sem noção de algoritmo é como construir casa sem planta: até pode ficar de pé, mas vai dar manutenção toda semana.

## O que caracteriza um bom algoritmo

- resolve o problema corretamente;
- termina em tempo finito;
- é claro para quem lê;
- tem custo aceitável para o cenário.

## Complexidade: o mínimo que você deve saber

Você não precisa ser especialista em Big-O no primeiro mês, mas precisa entender o impacto de escala.

Exemplo:

- solução O(n) cresce de forma linear;
- solução O(n²) explode quando a entrada aumenta.

Em projetos reais, isso separa código “funciona no teste” de código “aguenta produção”.

## Estratégias clássicas

### Força bruta

Tenta tudo até achar resposta. É simples, mas pode ser caro.

### Dividir para conquistar

Quebra o problema em subproblemas menores e combina os resultados.

### Guloso (greedy)

Escolhe a melhor opção local em cada passo. Funciona bem em alguns cenários específicos.

### Programação dinâmica

Guarda resultados parciais para evitar recomputação.

## Processo recomendado para resolver problemas

1. Entenda exatamente o enunciado.
2. Defina entrada, saída e restrições.
3. Resolva manualmente 2 ou 3 casos.
4. Escreva pseudocódigo.
5. Implemente a versão simples.
6. Meça e otimize se necessário.

## Erros comuns

- otimizar cedo demais;
- ignorar casos extremos (lista vazia, valor nulo);
- não provar a correção da ideia;
- complicar solução simples.

## Exercícios para fixação

1. Busca linear em lista.
2. Busca binária em lista ordenada.
3. Ordenação por seleção e por inserção.
4. Remover duplicados de uma coleção.
5. Encontrar elemento mais frequente.

## Critérios de qualidade que você deve aplicar

- **Corretude:** retorna o resultado certo?
- **Clareza:** outro dev entende sem sofrimento?
- **Eficiência:** escala razoavelmente?
- **Testabilidade:** é fácil validar casos?

Se você aplicar esses quatro critérios em cada exercício, seu nível sobe rápido.
