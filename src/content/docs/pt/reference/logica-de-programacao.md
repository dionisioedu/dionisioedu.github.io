---
title: Lógica de Programação
description: Entenda como pensar como programador de verdade, decompor problemas, usar condições, loops, estados, funções e depurar raciocínio com muitos exemplos práticos.
---

Lógica de programação não é um assunto "de iniciante".

É a base que separa quem só copia sintaxe de quem realmente consegue resolver problema.

Se você sente que trava quando abre o editor, normalmente o problema não é falta de inteligência.

É falta de processo.

E processo dá para treinar.

Nesta página, a ideia é sair do superficial e tratar lógica como ela realmente merece: como engenharia de pensamento executável.

## A verdade que pouca gente fala

Muita gente acha que está ruim em programação porque:

- esquece sintaxe
- confunde `for` com `while`
- demora para montar uma solução
- precisa pesquisar muito

Mas isso quase nunca é o problema principal.

O problema real costuma ser este:

**a pessoa tenta escrever código antes de modelar o raciocínio.**

Você não começa por `if`.

Você começa por:

- o que entra
- o que precisa acontecer
- quais regras mandam no problema
- o que sai
- como provar que está certo

Quando essa base fica clara, o código deixa de ser um labirinto.

## O que lógica realmente é

Lógica de programação é a capacidade de transformar um problema em uma sequência finita de passos claros, testáveis e executáveis.

Repara nos termos importantes:

- **transformar**: você sai do mundo do problema e entra no mundo da solução
- **sequência finita**: não pode ser bagunçado nem infinito por acidente
- **passos claros**: ambiguidade quebra programa
- **testáveis**: você precisa verificar se a ideia funciona
- **executáveis**: a máquina precisa conseguir seguir a receita

Em resumo:

```text
Problema real -> modelo mental -> passos -> algoritmo -> código
```

Se você pula o modelo mental, o resto sai torto.

## Sintaxe não é lógica

Sintaxe é como escrever.

Lógica é o que escrever.

Exemplo:

```text
Quero verificar se um número é par.
```

Essa lógica existe antes da linguagem.

Em português:

```text
Se o resto da divisão por 2 for 0, é par.
Caso contrário, é ímpar.
```

Agora olha a mesma lógica em linguagens diferentes.

### C

```c
#include <stdio.h>

int main(void) {
    int numero = 12;

    if (numero % 2 == 0) {
        printf("par\n");
    } else {
        printf("impar\n");
    }

    return 0;
}
```

### C++

```cpp
#include <iostream>

int main() {
    int numero = 12;

    if (numero % 2 == 0) {
        std::cout << "par\n";
    } else {
        std::cout << "impar\n";
    }
}
```

### JavaScript

```js
const numero = 12;

if (numero % 2 === 0) {
  console.log("par");
} else {
  console.log("impar");
}
```

### Python

```python
numero = 12

if numero % 2 == 0:
    print("par")
else:
    print("impar")
```

A sintaxe muda.

A lógica é a mesma.

Essa é uma chave importante para evoluir rápido.

## O modelo mental que mais ajuda no começo

Se você quer parar de travar, grava esse roteiro:

1. escreva o problema em português simples
2. identifique entrada
3. identifique saída
4. liste as regras
5. monte 2 ou 3 exemplos manuais
6. quebre em passos
7. só então codifique

Isso parece "mais lento".

Na prática, é muito mais rápido do que abrir o VS Code e começar a atirar no escuro.

## Entrada, processamento e saída

Quase todo problema pode ser enxergado assim:

```text
+---------+     +----------------+     +--------+
| Entrada | --> | Processamento  | --> | Saida  |
+---------+     +----------------+     +--------+
```

### Exemplo: calcular média

```text
Entrada:
- nota 1
- nota 2
- nota 3

Processamento:
- somar as notas
- dividir por 3

Saida:
- media final
- mensagem de aprovado ou reprovado
```

### Exemplo em Python

```python
nota1 = 7.5
nota2 = 8.0
nota3 = 6.5

media = (nota1 + nota2 + nota3) / 3

if media >= 7:
    print("Aprovado")
else:
    print("Reprovado")
```

Se você não consegue enxergar entrada, processamento e saída, ainda não entendeu o problema.

## Os blocos fundamentais da lógica

Toda lógica de programação forte se apoia em poucos blocos fundamentais:

- sequência
- decisão
- repetição
- decomposição
- estado
- validação

Vamos tratar cada um com profundidade.

## Sequência: ordem importa mais do que parece

Sequência é executar ações na ordem correta.

Isso parece trivial, mas muito bug nasce aqui.

Exemplo clássico errado:

```text
1. dividir a soma pela quantidade
2. somar os valores
```

Não faz sentido.

Você precisa somar antes de dividir.

### Exemplo de sequência correta

```text
Problema: calcular media de 3 notas

1. receber nota1
2. receber nota2
3. receber nota3
4. somar as 3 notas
5. dividir por 3
6. exibir resultado
```

### Exemplo em C

```c
#include <stdio.h>

int main(void) {
    float nota1 = 7.0f;
    float nota2 = 9.0f;
    float nota3 = 8.0f;

    float soma = nota1 + nota2 + nota3;
    float media = soma / 3.0f;

    printf("Media: %.2f\n", media);
    return 0;
}
```

### Diagrama de sequência

```text
Receber dados
    |
    v
Somar valores
    |
    v
Dividir pela quantidade
    |
    v
Exibir resultado
```

Se a ordem muda, a solução quebra.

## Decisão: o programa precisa escolher caminho

Decisão é quando o fluxo depende de uma condição.

Palavras que normalmente indicam decisão:

- se
- senão
- caso
- quando
- somente se

### Exemplo real

```text
Se a senha estiver correta, libera acesso.
Senão, bloqueia.
```

### Estrutura mental

```text
Se condicao for verdadeira:
    executa caminho A
Caso contrario:
    executa caminho B
```

### Exemplo em JavaScript

```js
const senha = "123456";

if (senha === "123456") {
  console.log("Acesso liberado");
} else {
  console.log("Acesso negado");
}
```

### Exemplo em Python

```python
senha = "123456"

if senha == "123456":
    print("Acesso liberado")
else:
    print("Acesso negado")
```

## Condições booleanas: o coração da decisão

Uma decisão depende de uma expressão booleana.

Ou seja, algo que resulte em:

- `true` / `false`
- `verdadeiro` / `falso`

### Operadores relacionais comuns

```text
==  igual
!=  diferente
>   maior que
<   menor que
>=  maior ou igual
<=  menor ou igual
```

### Exemplo em C++

```cpp
#include <iostream>

int main() {
    int idade = 20;

    if (idade >= 18) {
        std::cout << "maior de idade\n";
    } else {
        std::cout << "menor de idade\n";
    }
}
```

## Operadores lógicos

Quando uma condição não basta sozinha, você combina regras.

### Principais operadores

```text
E   -> todas as condicoes precisam ser verdadeiras
OU  -> pelo menos uma precisa ser verdadeira
NAO -> inverte o valor logico
```

### Em código

```text
C / C++ / JavaScript
&&  -> AND
||  -> OR
!   -> NOT
```

```text
Python
and
or
not
```

### Exemplo: pode entrar no evento?

Regra:

- precisa ter nome na lista
- e precisa ter documento

### JavaScript

```js
const nomeNaLista = true;
const temDocumento = true;

if (nomeNaLista && temDocumento) {
  console.log("entrada liberada");
} else {
  console.log("entrada bloqueada");
}
```

### Python

```python
nome_na_lista = True
tem_documento = True

if nome_na_lista and tem_documento:
    print("entrada liberada")
else:
    print("entrada bloqueada")
```

## Tabela verdade na prática

### Operador AND

```text
A      B      A AND B
true   true   true
true   false  false
false  true   false
false  false  false
```

### Operador OR

```text
A      B      A OR B
true   true   true
true   false  true
false  true   true
false  false  false
```

### Operador NOT

```text
A      NOT A
true   false
false  true
```

Se isso ainda parece abstrato, pensa assim:

- `AND` é checklist completo
- `OR` é alternativa aceitável
- `NOT` é inversão de estado

## Fluxo de decisão com várias regras

Problema:

```text
Classificar aluno:
- media >= 7  -> aprovado
- media >= 5  -> recuperacao
- senao       -> reprovado
```

### Pseudocódigo

```text
se media >= 7
    mostrar "aprovado"
senao se media >= 5
    mostrar "recuperacao"
senao
    mostrar "reprovado"
```

### C

```c
#include <stdio.h>

int main(void) {
    float media = 6.0f;

    if (media >= 7.0f) {
        printf("aprovado\n");
    } else if (media >= 5.0f) {
        printf("recuperacao\n");
    } else {
        printf("reprovado\n");
    }

    return 0;
}
```

### Python

```python
media = 6.0

if media >= 7:
    print("aprovado")
elif media >= 5:
    print("recuperacao")
else:
    print("reprovado")
```

## Repetição: quando a máquina faz trabalho repetido

Loop existe para repetir um bloco de lógica sem você duplicar código.

As duas perguntas mais importantes aqui são:

1. quantas vezes isso precisa repetir?
2. quando essa repetição deve parar?

Se você não sabe responder isso, o loop ainda não está bem modelado.

## `for` versus `while`

Regra prática:

- use `for` quando souber a quantidade ou estiver percorrendo uma coleção
- use `while` quando a repetição depende de uma condição que vai sendo avaliada

## Exemplo com `for`: somar lista

### Pseudocódigo

```text
total = 0
para cada numero na lista
    total = total + numero
mostrar total
```

### C++

```cpp
#include <iostream>

int main() {
    int numeros[] = {2, 4, 6, 8};
    int total = 0;

    for (int i = 0; i < 4; i++) {
        total += numeros[i];
    }

    std::cout << total << '\n';
}
```

### JavaScript

```js
const numeros = [2, 4, 6, 8];
let total = 0;

for (let i = 0; i < numeros.length; i += 1) {
  total += numeros[i];
}

console.log(total);
```

### Python

```python
numeros = [2, 4, 6, 8]
total = 0

for numero in numeros:
    total += numero

print(total)
```

## Exemplo com `while`: validar entrada

### Pseudocódigo

```text
enquanto senha for diferente da correta
    pedir senha novamente
```

### JavaScript

```js
let senha = "0000";

while (senha !== "1234") {
  console.log("senha incorreta");
  senha = "1234";
}

console.log("acesso liberado");
```

### Python

```python
senha = "0000"

while senha != "1234":
    print("senha incorreta")
    senha = "1234"

print("acesso liberado")
```

## Loop infinito: o bug clássico

Um loop infinito acontece quando a condição de parada nunca é atingida.

Exemplo ruim:

```js
let i = 0;

while (i < 5) {
  console.log(i);
}
```

Aqui `i` nunca muda.

Então:

```text
i continua 0
0 < 5 continua true
o loop nunca termina
```

Versão correta:

```js
let i = 0;

while (i < 5) {
  console.log(i);
  i += 1;
}
```

## Estado: a variável conta a história do programa

Estado é o conjunto de valores atuais que controlam o comportamento da execução.

Exemplos de estado:

- contador atual
- saldo atual
- usuário autenticado ou não
- posição de um cursor
- maior valor encontrado até agora

Se você não acompanha o estado, não entende a lógica.

## Dry run: execute o algoritmo na mão

Essa prática vale ouro.

Antes de confiar no código, rode mentalmente ou no papel.

### Exemplo: encontrar o maior número

Lista:

```text
[7, 2, 9, 4]
```

### Ideia

```text
1. assumir que o primeiro numero eh o maior
2. comparar com os proximos
3. se encontrar maior, atualizar
4. no final, mostrar o maior
```

### Dry run

```text
Inicio:
maior = 7

Compara com 2:
2 > 7 ? nao
maior continua 7

Compara com 9:
9 > 7 ? sim
maior vira 9

Compara com 4:
4 > 9 ? nao
maior continua 9

Resultado final:
maior = 9
```

### Python

```python
numeros = [7, 2, 9, 4]
maior = numeros[0]

for numero in numeros[1:]:
    if numero > maior:
        maior = numero

print(maior)
```

### C

```c
#include <stdio.h>

int main(void) {
    int numeros[] = {7, 2, 9, 4};
    int maior = numeros[0];

    for (int i = 1; i < 4; i++) {
        if (numeros[i] > maior) {
            maior = numeros[i];
        }
    }

    printf("%d\n", maior);
    return 0;
}
```

## Contador e acumulador

Esse par aparece o tempo todo.

### Contador

Serve para contar ocorrências.

```text
quantos alunos passaram?
quantas letras 'a' existem?
quantos numeros sao pares?
```

### Acumulador

Serve para somar, concatenar ou agregar algo ao longo do processo.

```text
somar vendas
somar notas
juntar palavras
```

## Exemplo: contar pares e somar total

### JavaScript

```js
const numeros = [3, 8, 10, 7, 2];
let quantidadeDePares = 0;
let soma = 0;

for (const numero of numeros) {
  soma += numero;

  if (numero % 2 === 0) {
    quantidadeDePares += 1;
  }
}

console.log("Soma:", soma);
console.log("Pares:", quantidadeDePares);
```

### Python

```python
numeros = [3, 8, 10, 7, 2]
quantidade_de_pares = 0
soma = 0

for numero in numeros:
    soma += numero

    if numero % 2 == 0:
        quantidade_de_pares += 1

print("Soma:", soma)
print("Pares:", quantidade_de_pares)
```

## Decomposição: quebrar problema grande em problemas menores

Se você tenta resolver tudo de uma vez, trava.

Quando decompõe, o cérebro trabalha melhor.

Problema grande:

```text
Cadastrar usuario com validacao, senha e mensagem final
```

Subproblemas:

1. ler nome
2. validar email
3. validar senha
4. verificar confirmacao
5. montar resposta

Agora ficou tratável.

## Funções: lógica modular de verdade

Função não serve só para "organizar código bonitinho".

Função serve para:

- dar nome a uma ideia
- isolar responsabilidade
- reutilizar lógica
- testar partes pequenas

## Exemplo: validar idade mínima

### Python

```python
def pode_entrar(idade):
    return idade >= 18


idade = 20

if pode_entrar(idade):
    print("entrada liberada")
else:
    print("entrada bloqueada")
```

### JavaScript

```js
function podeEntrar(idade) {
  return idade >= 18;
}

const idade = 20;

if (podeEntrar(idade)) {
  console.log("entrada liberada");
} else {
  console.log("entrada bloqueada");
}
```

### C++

```cpp
#include <iostream>

bool podeEntrar(int idade) {
    return idade >= 18;
}

int main() {
    int idade = 20;

    if (podeEntrar(idade)) {
        std::cout << "entrada liberada\n";
    } else {
        std::cout << "entrada bloqueada\n";
    }
}
```

## Exemplo completo: média de notas com decomposição

### Passo 1: entender o problema

Entrada:

- nome do aluno
- 3 notas

Processamento:

- calcular média
- classificar

Saída:

- nome
- média
- status

### Passo 2: pseudocódigo

```text
receber nome
receber nota1
receber nota2
receber nota3

media = (nota1 + nota2 + nota3) / 3

se media >= 7
    status = "aprovado"
senao se media >= 5
    status = "recuperacao"
senao
    status = "reprovado"

mostrar nome, media e status
```

### Passo 3: fluxograma textual

```text
Inicio
  |
  v
Receber nome e notas
  |
  v
Calcular media
  |
  v
media >= 7 ?
  |sim                |nao
  v                   v
aprovado        media >= 5 ?
                      |sim         |nao
                      v            v
                 recuperacao   reprovado
                      \          /
                       \        /
                        v      v
                     Exibir resultado
                          |
                          v
                         Fim
```

### Passo 4: implementação em C

```c
#include <stdio.h>

int main(void) {
    char nome[] = "Dionisio";
    float nota1 = 8.0f;
    float nota2 = 6.5f;
    float nota3 = 7.0f;
    float media = (nota1 + nota2 + nota3) / 3.0f;

    if (media >= 7.0f) {
        printf("%s - media %.2f - aprovado\n", nome, media);
    } else if (media >= 5.0f) {
        printf("%s - media %.2f - recuperacao\n", nome, media);
    } else {
        printf("%s - media %.2f - reprovado\n", nome, media);
    }

    return 0;
}
```

### Passo 5: implementação em Python

```python
nome = "Dionisio"
nota1 = 8.0
nota2 = 6.5
nota3 = 7.0

media = (nota1 + nota2 + nota3) / 3

if media >= 7:
    status = "aprovado"
elif media >= 5:
    status = "recuperacao"
else:
    status = "reprovado"

print(nome, media, status)
```

## Validação: lógica boa trata entrada ruim

Esse é um ponto que muita explicação rasa ignora.

No mundo real, usuário erra.

API vem quebrada.

Arquivo vem vazio.

Campo vem nulo.

Se sua lógica não considera isso, ela está incompleta.

## Exemplo: nota inválida

Regra:

- nota precisa estar entre `0` e `10`

### Python

```python
nota = 11

if nota < 0 or nota > 10:
    print("nota invalida")
else:
    print("nota valida")
```

### JavaScript

```js
const nota = 11;

if (nota < 0 || nota > 10) {
  console.log("nota invalida");
} else {
  console.log("nota valida");
}
```

## Caso de borda: onde muito código quebra

Caso de borda é cenário limite ou incomum que muita gente esquece.

Exemplos:

- lista vazia
- valor zero
- número negativo
- texto vazio
- divisão por zero
- senha com espaço
- apenas um item na lista

## Exemplo: maior valor em lista vazia

Código ingênuo:

```python
numeros = []
maior = numeros[0]
```

Isso quebra.

Versão melhor:

```python
numeros = []

if not numeros:
    print("lista vazia")
else:
    maior = numeros[0]
    for numero in numeros[1:]:
        if numero > maior:
            maior = numero
    print(maior)
```

## Rastreando o estado na memória mental

Quando você depura lógica, precisa imaginar as variáveis mudando.

### Exemplo: somar números

```python
numeros = [5, 1, 3]
total = 0

for numero in numeros:
    total += numero

print(total)
```

### Dry run do estado

```text
Inicio:
total = 0

Iteracao 1:
numero = 5
total = 0 + 5 = 5

Iteracao 2:
numero = 1
total = 5 + 1 = 6

Iteracao 3:
numero = 3
total = 6 + 3 = 9

Fim:
total = 9
```

Isso é literalmente acompanhar o estado do programa.

## Busca linear: um padrão lógico essencial

Problema:

```text
Verificar se um valor existe em uma lista.
```

### Ideia

```text
Percorrer elemento por elemento.
Se encontrar, encerrar.
Se terminar e nao encontrar, nao existe.
```

### C

```c
#include <stdbool.h>
#include <stdio.h>

int main(void) {
    int numeros[] = {4, 8, 15, 16, 23, 42};
    int alvo = 15;
    bool encontrou = false;

    for (int i = 0; i < 6; i++) {
        if (numeros[i] == alvo) {
            encontrou = true;
            break;
        }
    }

    if (encontrou) {
        printf("encontrou\n");
    } else {
        printf("nao encontrou\n");
    }

    return 0;
}
```

### Python

```python
numeros = [4, 8, 15, 16, 23, 42]
alvo = 15
encontrou = False

for numero in numeros:
    if numero == alvo:
        encontrou = True
        break

if encontrou:
    print("encontrou")
else:
    print("nao encontrou")
```

## Mínimo e máximo: padrão que aparece o tempo todo

Você vai usar esse raciocínio em:

- ranking
- filtro de preços
- análise de notas
- logs
- métricas

### Exemplo em JavaScript

```js
const notas = [6.5, 9.0, 7.2, 5.8];
let maior = notas[0];
let menor = notas[0];

for (let i = 1; i < notas.length; i += 1) {
  if (notas[i] > maior) {
    maior = notas[i];
  }

  if (notas[i] < menor) {
    menor = notas[i];
  }
}

console.log("Maior:", maior);
console.log("Menor:", menor);
```

## Problema clássico: contagem de vogais

Esse é ótimo porque treina:

- loop
- condição
- comparação
- contador
- raciocínio sobre string

### Python

```python
texto = "programacao"
vogais = 0

for letra in texto:
    if letra in "aeiou":
        vogais += 1

print(vogais)
```

### JavaScript

```js
const texto = "programacao";
let vogais = 0;

for (const letra of texto) {
  if ("aeiou".includes(letra)) {
    vogais += 1;
  }
}

console.log(vogais);
```

## Problema clássico: inverter número

Esse problema treina:

- matemática básica
- resto de divisão
- loop
- atualização de estado

### Ideia

```text
numero = 1234

pegar ultimo digito
montar novo numero
remover ultimo digito do numero original
repetir ate zerar
```

### Pseudocódigo

```text
invertido = 0

enquanto numero > 0
    digito = numero % 10
    invertido = invertido * 10 + digito
    numero = numero / 10 sem parte decimal
```

### C++

```cpp
#include <iostream>

int main() {
    int numero = 1234;
    int invertido = 0;

    while (numero > 0) {
        int digito = numero % 10;
        invertido = invertido * 10 + digito;
        numero /= 10;
    }

    std::cout << invertido << '\n';
}
```

### Python

```python
numero = 1234
invertido = 0

while numero > 0:
    digito = numero % 10
    invertido = invertido * 10 + digito
    numero //= 10

print(invertido)
```

## Debug lógico: como encontrar o erro sem entrar em pânico

Quando a solução não funciona, faz isso:

1. volta para o enunciado
2. testa com entrada pequena
3. acompanha variável por variável
4. verifica se a condição está certa
5. verifica se o loop para
6. verifica caso de borda

Bug lógico raramente se resolve só olhando rápido para o código.

Você precisa rastrear execução.

## Exemplo de bug lógico real

Objetivo:

```text
Contar quantos numeros sao positivos.
```

Código errado:

```python
numeros = [3, -1, 4, 0, -2]
positivos = 0

for numero in numeros:
    if numero >= 0:
        positivos += 1

print(positivos)
```

Se a regra era "positivo" de verdade, `0` não deveria contar.

A condição correta seria:

```python
if numero > 0:
    positivos += 1
```

Percebe?

Às vezes o bug não está na sintaxe.

Está na regra.

## Pseudocódigo: a ponte entre ideia e código

Pseudocódigo é importante porque reduz carga mental.

Você pensa primeiro na lógica, sem brigar com detalhes da linguagem.

### Exemplo: caixa eletrônico

```text
saldo = 1000
valorSaque = 300

se valorSaque <= saldo
    saldo = saldo - valorSaque
    mostrar "saque realizado"
senao
    mostrar "saldo insuficiente"
```

Depois disso, implementar em qualquer linguagem fica muito mais fácil.

## Fluxograma textual: útil para problema de negócio

Nem sempre você precisa desenhar com ferramenta.

Muitas vezes um fluxograma em texto já organiza o pensamento.

### Exemplo: login

```text
Inicio
  |
  v
Receber email e senha
  |
  v
Email existe?
  |sim           |nao
  v              v
Senha correta?   Mostrar "usuario nao encontrado"
  |sim     |nao
  v        v
Entrar   Mostrar "senha invalida"
```

## Estratégia para não travar em problema grande

Quando o problema parecer grande demais, faz este recorte:

1. qual é a versão mínima desse problema?
2. consigo resolver com 1 caso?
3. consigo resolver sem interface?
4. consigo resolver sem banco?
5. consigo resolver só a lógica central?

Isso diminui ansiedade e aumenta clareza.

## Exemplo: carrinho de compras

Versão assustadora:

```text
Fazer carrinho completo de e-commerce.
```

Versão lógica mínima:

```text
Receber lista de preços.
Somar tudo.
Aplicar desconto se total passar de 100.
```

Agora dá para pensar.

### JavaScript

```js
const precos = [35, 40, 50];
let total = 0;

for (const preco of precos) {
  total += preco;
}

if (total > 100) {
  total *= 0.9;
}

console.log(total);
```

## Recursão: mencione quando ela realmente fizer sentido

No começo, não precisa forçar recursão em tudo.

Mas vale saber a ideia:

recursão é quando uma função resolve um problema chamando a si mesma para uma versão menor do mesmo problema.

### Exemplo clássico: fatorial

```text
5! = 5 * 4 * 3 * 2 * 1
0! = 1
```

### Python

```python
def fatorial(n):
    if n == 0:
        return 1
    return n * fatorial(n - 1)


print(fatorial(5))
```

### C++

```cpp
#include <iostream>

int fatorial(int n) {
    if (n == 0) {
        return 1;
    }

    return n * fatorial(n - 1);
}

int main() {
    std::cout << fatorial(5) << '\n';
}
```

Aqui o importante é entender:

- caso base
- redução do problema
- chamada recursiva

## Invariantes: a ideia de "o que sempre deve ser verdade"

Esse conceito é forte demais e quase ninguém explica cedo.

Invariante é uma condição que deve permanecer verdadeira durante uma parte da execução.

Exemplo:

```text
Ao percorrer uma lista para achar o maior valor,
"maior" sempre guarda o maior elemento visto ate agora.
```

Se você pensa em invariantes, sua lógica fica muito mais robusta.

## Complexidade mental antes da complexidade algorítmica

Antes de decorar Big O, aprende isto:

- solução simples e correta vale mais do que solução "genial" e errada
- clareza é parte da qualidade
- se você não consegue explicar, provavelmente ainda não entendeu

Depois você otimiza.

Primeiro, resolve.

## Erros mais comuns de quem está aprendendo lógica

- começar a digitar sem modelar
- ignorar entrada e saída
- esquecer condição de parada
- não testar caso de borda
- misturar várias responsabilidades
- usar nomes vagos como `x`, `y`, `a1`, `temp2` em tudo
- não executar manualmente
- confiar porque "rodou uma vez"

## O que estudar junto com lógica

Lógica não vive sozinha.

Ela melhora muito quando você combina com:

- [Tipos de Dados](/pt/reference/tipos-de-dados/)
- [Algoritmos](/pt/reference/algoritmos/)
- [Estruturas de Dados](/pt/reference/estruturas-de-dados/)
- [DSA](/pt/reference/dsa/)

Porque toda decisão lógica depende do tipo certo de dado e da estrutura certa de processamento.

## Plano de treino que realmente funciona

### Semana 1

- sequência
- condição simples
- operações matemáticas
- entrada e saída

### Semana 2

- `if`, `else`, `else if`
- operadores lógicos
- validação básica

### Semana 3

- `for`
- `while`
- contador
- acumulador

### Semana 4

- listas
- busca
- maior e menor valor
- média

### Semana 5

- funções
- decomposição
- pseudocódigo
- casos de borda

### Semana 6

- problemas combinando tudo
- depuração
- leitura de enunciado
- explicação em voz alta

## Checklist forte de lógica de programação

- Você consegue explicar entrada, processamento e saída?
- Você consegue resolver manualmente antes de codar?
- Você sabe a diferença entre sequência, decisão e repetição?
- Você sabe quando usar `for` e quando usar `while`?
- Você acompanha o estado das variáveis?
- Você pensa em caso de borda?
- Você consegue quebrar um problema grande em partes menores?
- Você valida entrada ruim?
- Você consegue explicar por que sua solução está correta?

Se a resposta for "sim" para a maior parte disso, sua base já está ficando séria.

## Exercícios de alto valor

Treina estes sem pular etapa:

1. verificar se um número é par ou ímpar
2. calcular média de notas
3. encontrar maior e menor valor
4. contar vogais em uma string
5. validar senha com regras mínimas
6. somar apenas números pares de uma lista
7. buscar um valor em uma coleção
8. inverter um número
9. contar palavras em uma frase
10. montar menu simples com repetição

Para cada exercício:

1. escreva o problema em português
2. resolva 2 exemplos manualmente
3. faça pseudocódigo
4. implemente
5. teste casos de borda
6. explique sua lógica em voz alta

## Como saber se você está evoluindo

Você vai notar sinais claros:

- trava menos no começo
- precisa apagar menos código
- consegue prever erro antes de rodar
- seus loops ficam mais seguros
- suas funções ficam mais limpas
- você começa a enxergar padrões repetidos

Esse é o momento em que programação deixa de parecer mágica e começa a virar ferramenta.

## Próximas ações

- Reforce a base em [Tipos de Dados](/pt/reference/tipos-de-dados/)
- Continue em [Algoritmos](/pt/reference/algoritmos/)
- Depois consolide com [Estruturas de Dados e Algoritmos](/pt/reference/dsa/)
