---
title: Tipos de Dados
description: Entenda como representar informação corretamente para escrever código mais seguro, legível e sem bug idiota.
---

Tipo de dado não é detalhe. Tipo de dado é significado.

Se você escolhe o tipo errado, o software até roda. Mas roda torto.

É aqui que começam vários bugs clássicos:

- preço salvo com precisão ruim
- idade tratada como texto
- status confuso
- comparação quebrada
- validação inconsistente

## O que é tipo de dado, na prática

Um tipo de dado define:

- quais valores fazem sentido
- quais operações são válidas
- como o dado é interpretado
- que tipo de erro pode aparecer

Exemplo direto:

- `42` pode ser inteiro
- `"42"` é texto
- `42.0` pode ser decimal
- `true` é estado lógico

Parece simples. Mas muita regra de negócio quebra justamente porque o sistema mistura essas coisas.

## O que você deve dominar primeiro

### Inteiro

Use quando não existe fração.

Exemplos:

- quantidade de usuários
- número de tentativas
- idade
- posição no ranking

### Decimal

Use quando existe fração.

Exemplos:

- peso
- temperatura
- distância

Mas cuidado: nem todo decimal serve para dinheiro.

### String

Use para informação textual.

Exemplos:

- nome
- e-mail
- CPF mascarado
- identificador alfanumérico

### Booleano

Use para estados binários.

Exemplos:

- ativo ou inativo
- pago ou não pago
- válido ou inválido

### Null / ausência de valor

Você também precisa entender quando o sistema está dizendo:

- “não sei ainda”
- “não foi informado”
- “não existe”

Muita gente trata ausência de valor como string vazia, zero ou `false`. Aí começa o caos.

## Erro clássico: achar que “parece número” já basta

Olha isso:

- `"10"` não é `10`
- `"true"` não é `true`
- `"3.14"` não é `3.14`

Se você recebe dado de formulário, API ou banco, quase sempre vai precisar validar e converter.

Regra prática:

**valida primeiro, converte depois**

## Dinheiro merece atenção especial

Se você guardar preço como tipo decimal qualquer e sair fazendo conta sem cuidado, pode criar erro de precisão.

Em sistema real, o comum é usar:

- tipo decimal apropriado da linguagem
- inteiro em centavos

Exemplo mental:

- `R$ 10,99` pode virar `1099` centavos

Isso evita várias surpresas em cálculo financeiro.

## Data e hora também são armadilha

Data não é string “bonitinha”.

Se você salva tudo como texto sem padrão, depois sofre para:

- ordenar
- filtrar
- comparar
- lidar com timezone

Use tipo de data quando existir. Se precisar serializar, use formato consistente.

## ID não é número só porque tem dígito

Isso aqui é importante:

- telefone não é número de cálculo
- CPF não é número matemático
- CEP não é número matemático
- código de pedido pode parecer número, mas é identificador

Se você não vai somar, dividir ou comparar como quantidade, talvez aquilo nem devesse ser tratado como número.

## Como escolher o tipo certo

Antes de criar variável, campo ou coluna, responde:

1. Esse dado representa quantidade, estado, texto, data ou identidade?
2. Eu vou calcular com ele ou só armazenar e exibir?
3. Existe possibilidade de ausência?
4. Precisão importa?
5. Comparação exata importa?

Se você responde isso, a escolha melhora muito.

## Exemplos práticos de modelagem

### Usuário

- `nome`: string
- `idade`: inteiro
- `email`: string
- `ativo`: booleano

### Pedido

- `idPedido`: string ou inteiro, dependendo do domínio
- `valorTotal`: decimal apropriado ou centavos
- `pago`: booleano
- `criadoEm`: data/hora

### Produto

- `sku`: string
- `estoque`: inteiro
- `preco`: decimal apropriado

## Erros comuns de iniciante

- usar string para tudo
- comparar número com texto
- converter sem validar
- usar `0` para significar “não informado”
- usar `false` para esconder ausência de valor
- ignorar precisão em dinheiro

## Sinais de que sua modelagem está ruim

- você precisa converter o mesmo campo toda hora
- a regra de negócio está cheia de `if` estranho
- o mesmo dado muda de formato em partes diferentes do sistema
- bugs aparecem em cadastro, filtro e ordenação

## Exercícios que valem de verdade

1. Modele um cadastro de usuário com nome, idade, e-mail e ativo.
2. Modele um pedido com valor, data e status de pagamento.
3. Receba dados como texto e converta corretamente.
4. Valide entradas inválidas sem quebrar a aplicação.

## Checklist rápido

- Você sabe quando usar inteiro vs decimal?
- Você entende que ID nem sempre é número?
- Você trata ausência de valor com cuidado?
- Você sabe que dinheiro merece modelagem séria?
- Você valida antes de converter?

Se você fechar esses pontos, já sai muito na frente de quem programa “no improviso”.

## Próximas ações

- Vá para [Estruturas de Dados](/pt/reference/estruturas-de-dados/)
- Depois consolide com [Lógica de Programação](/pt/reference/logica-de-programacao/)
