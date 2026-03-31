---
title: Tipos de Dados
description: Entenda bits, bytes, representação na memória, casting, caracteres, números e tipos em C, C++, JavaScript e Python.
---

Tipo de dado não é detalhe.

Tipo de dado é contrato.

É o que define:

- o que um valor significa
- quanto espaço ele ocupa
- quais operações fazem sentido
- que tipo de bug pode nascer dali

Quando você domina tipos de dados, para de programar só na superfície e começa a entender como a máquina realmente enxerga o que você escreveu.

E isso muda tudo.

## Antes de falar de tipos: tudo vira bit

No fim do dia, a memória não sabe o que é `int`, `float`, `char` ou `bool`.

Ela só guarda bits.

Bit é o menor pedaço de informação digital:

- `0`
- `1`

Oito bits formam um byte.

```text
1 bit   = 0 ou 1
8 bits  = 1 byte
1024 bytes = 1 KB
1024 KB    = 1 MB
```

Exemplo de 1 byte:

```text
01000001
```

Esse mesmo byte pode ser interpretado de várias formas:

- como número decimal `65`
- como hexadecimal `0x41`
- como caractere ASCII `'A'`

Repara na ideia central:

**os bits são os mesmos; o significado muda conforme o tipo e o contexto.**

## Representação de dados: a memória não “vê” semântica

Olha esse bloco de 1 byte:

```text
Bits:  01000001
Dec:   65
Hex:   0x41
ASCII: 'A'
```

A memória não sabe se isso é letra ou número.

Quem decide isso é:

- o tipo
- a instrução usada
- a forma de leitura

É por isso que caracteres têm valor numérico intercambiável.

No ASCII:

- `'A'` = `65`
- `'B'` = `66`
- `'a'` = `97`
- `'0'` = `48`

Se quiser a tabela completa, veja [Tabela ASCII](/pt/reference/tabela-ascii/).

## Diagrama mental: o mesmo dado, interpretações diferentes

```text
Endereço: 0x1000

+--------+
| 01000001 |
+--------+

Se lido como unsigned char -> 65
Se lido como char ASCII    -> 'A'
Se lido como binário puro  -> 01000001
```

Essa é uma das bases mais importantes da computação.

## Números inteiros

Inteiros representam valores sem parte fracionária.

Exemplos clássicos:

- idade
- quantidade
- tentativas
- estoque
- posição

## Tamanho dos inteiros nas linguagens principais

### C

Em C, o tamanho exato depende da plataforma e do compilador, mas existe um mínimo garantido pelo padrão.

```c
char        // pelo menos 8 bits
short       // pelo menos 16 bits
int         // pelo menos 16 bits
long        // pelo menos 32 bits
long long   // pelo menos 64 bits
```

### C++

Em C++, a lógica base é parecida com C:

```cpp
char
short
int
long
long long
```

Mas C++ te dá casts mais seguros e tipos utilitários em bibliotecas modernas.

### JavaScript

JavaScript é diferente.

Quase todo número comum é `Number`, que usa ponto flutuante de 64 bits no padrão IEEE 754.

Ou seja:

- inteiro pequeno funciona bem
- decimal existe
- inteiro muito grande perde precisão

```js
console.log(typeof 10);     // "number"
console.log(typeof 10.5);   // "number"
```

Para inteiros realmente grandes:

```js
const id = 9007199254740993n;
console.log(typeof id); // "bigint"
```

### Python

Python abstrai mais.

`int` em Python cresce conforme a necessidade.

```python
x = 10
y = 10**100

print(type(x))  # <class 'int'>
print(type(y))  # <class 'int'>
```

Isso é ótimo para ergonomia, mas não significa custo zero.

Inteiro gigante consome mais memória e mais processamento.

## Inteiros com sinal e sem sinal

Em linguagens como C e C++, isso importa muito.

### Signed

Permite números negativos e positivos.

### Unsigned

Só permite zero e positivos.

Exemplo com 8 bits:

```text
unsigned 8 bits: 0 a 255
signed 8 bits:  -128 a 127
```

## Como negativos são armazenados: complemento de dois

A forma mais comum de representar inteiros negativos é o complemento de dois.

Exemplo com 8 bits:

```text
  5  = 00000101
 -5  = 11111011
```

Como gerar `-5` em complemento de dois:

```text
5 em binário:           00000101
inverte os bits:        11111010
soma 1:                 11111011
```

Isso importa porque overflow, casting e aritmética binária dependem dessa representação.

## Exemplo real em C

```c
#include <stdio.h>

int main(void) {
    signed char a = -5;
    unsigned char b = 250;

    printf("a = %d\n", a);
    printf("b = %u\n", b);
    return 0;
}
```

## Overflow: quando o valor não cabe

Um tipo tem limite.

Se você tenta guardar valor além do limite, dá problema.

Exemplo conceitual com `unsigned char`:

```text
Máximo: 255

255 + 1 = 0   // overflow por wraparound em unsigned
```

Exemplo em C:

```c
#include <stdio.h>

int main(void) {
    unsigned char x = 255;
    x = x + 1;
    printf("%u\n", x); // normalmente 0
    return 0;
}
```

Em `signed`, overflow pode ser ainda pior, porque comportamento indefinido entra na conversa em C e C++.

## Decimal para binário: parte inteira

Se você quer converter decimal inteiro para binário manualmente, divide por 2 e guarda os restos.

Exemplo com `13`:

```text
13 / 2 = 6  resto 1
 6 / 2 = 3  resto 0
 3 / 2 = 1  resto 1
 1 / 2 = 0  resto 1

Lendo de baixo para cima:
13 = 1101
```

## Decimal fracionário para binário

Para frações, multiplica por 2 e observa a parte inteira.

Exemplo com `0.625`:

```text
0.625 * 2 = 1.25   -> 1
0.25  * 2 = 0.5    -> 0
0.5   * 2 = 1.0    -> 1

0.625 = 0.101 em binário
```

Então:

```text
10.625 = 1010.101
```

## Números de ponto flutuante

Agora vem a parte onde muita gente apanha sem perceber.

Ponto flutuante não representa “qualquer decimal exatamente”.

Ele representa aproximações binárias.

Por isso aparecem casos como:

```js
console.log(0.1 + 0.2); // 0.30000000000000004
```

```python
print(0.1 + 0.2)  # 0.30000000000000004
```

```cpp
#include <iostream>

int main() {
    std::cout << (0.1 + 0.2) << '\n';
}
```

## Como um float é dividido na memória

No padrão IEEE 754, um `float` de 32 bits costuma ser organizado assim:

```text
31          23          0
+-----------+-----------+
| sinal | expoente | mantissa |
+-----------+-----------+

1 bit   8 bits      23 bits
```

Para `double` de 64 bits:

```text
63           52                    0
+------------+---------------------+
| sinal | expoente | mantissa      |
+------------+---------------------+

1 bit   11 bits     52 bits
```

Isso explica por que:

- comparação de float pode falhar
- precisão é limitada
- dinheiro em `float` é armadilha

## Exemplo de comparação perigosa

```python
a = 0.1 + 0.2
b = 0.3

print(a == b)  # False
```

Melhor abordagem:

```python
import math

print(math.isclose(0.1 + 0.2, 0.3))  # True
```

Em C++:

```cpp
#include <cmath>
#include <iostream>

int main() {
    double a = 0.1 + 0.2;
    double b = 0.3;
    std::cout << std::boolalpha << (std::fabs(a - b) < 1e-9) << '\n';
}
```

## Dinheiro: use decimal apropriado ou inteiro em menor unidade

Regra prática:

- `R$ 10,99` como `1099` centavos
- ou tipo decimal apropriado na stack escolhida

Exemplo em JavaScript usando centavos:

```js
const priceInCents = 1099;
const quantity = 3;

const total = priceInCents * quantity;
console.log(total); // 3297
console.log((total / 100).toFixed(2)); // "32.97"
```

Exemplo em Python:

```python
price_cents = 1099
quantity = 3

total_cents = price_cents * quantity
print(total_cents)         # 3297
print(total_cents / 100)   # 32.97
```

## Caracteres: letras também são números

Isso aqui é muito importante.

Um caractere não é magia. Ele também é representado numericamente.

No ASCII:

- `'A'` = `65`
- `'B'` = `66`
- `'Z'` = `90`
- `'a'` = `97`
- `'0'` = `48`

Exemplo visual:

```text
'A'
Decimal: 65
Hex:     0x41
Bin:     01000001
```

Você falou “A = 52”, mas o valor correto em ASCII é `65`.

`52` em ASCII é o caractere `'4'`.

## Código: caractere para número e número para caractere

### C

```c
#include <stdio.h>

int main(void) {
    char c = 'A';
    printf("%c\n", c);   // A
    printf("%d\n", c);   // 65
    return 0;
}
```

### C++

```cpp
#include <iostream>

int main() {
    char c = 'A';
    std::cout << c << '\n';
    std::cout << static_cast<int>(c) << '\n';
}
```

### JavaScript

```js
const c = 'A';

console.log(c.charCodeAt(0));      // 65
console.log(String.fromCharCode(65)); // A
```

### Python

```python
print(ord('A'))   # 65
print(chr(65))    # A
```

## ASCII versus Unicode

ASCII cobre 128 códigos clássicos.

Ótimo para entender base.

Mas software moderno geralmente precisa de Unicode, porque:

- acentos existem
- emojis existem
- alfabetos de vários idiomas existem

ASCII é ponto de partida.

Unicode é o mundo real.

Mesmo assim, entender ASCII continua extremamente valioso, porque ajuda você a entender:

- comparação entre caracteres
- ordenação básica
- parsing
- manipulação de bytes
- serialização de texto

## Strings: texto não é só um monte de letras

String é sequência de caracteres.

Mas a implementação muda bastante por linguagem.

### C

Em C, string é array de `char` terminado por byte nulo `'\0'`.

```c
#include <stdio.h>

int main(void) {
    char name[] = "Edu";

    printf("%c\n", name[0]); // E
    printf("%c\n", name[1]); // d
    printf("%c\n", name[2]); // u
    printf("%d\n", name[3]); // 0 -> '\0'
    return 0;
}
```

Diagrama:

```text
name = "Edu"

+-----+-----+-----+------+
| 'E' | 'd' | 'u' | '\0' |
+-----+-----+-----+------+
```

### C++

Em C++, você pode ter `char[]`, `const char*` ou `std::string`.

```cpp
#include <iostream>
#include <string>

int main() {
    std::string name = "Edu";
    std::cout << name.size() << '\n'; // 3
}
```

### JavaScript

Strings em JavaScript são imutáveis.

```js
const name = "Edu";

console.log(name[0]);      // E
console.log(name.length);  // 3
```

### Python

Strings em Python também são imutáveis.

```python
name = "Edu"

print(name[0])     # E
print(len(name))   # 3
```

## Booleanos

Booleano modela estado binário.

```text
true / false
1 / 0
ligado / desligado
ativo / inativo
```

Em C:

```c
#include <stdbool.h>
#include <stdio.h>

int main(void) {
    bool active = true;
    printf("%d\n", active); // 1
    return 0;
}
```

Em JavaScript:

```js
const active = true;
console.log(typeof active); // boolean
```

Em Python:

```python
active = True
print(type(active))  # <class 'bool'>
```

## Null, None, undefined e companhia

Aqui mora muita confusão.

### C

C puro trabalha muito com ponteiros nulos:

```c
int *ptr = NULL;
```

### C++

C++ moderno usa `nullptr`:

```cpp
int* ptr = nullptr;
```

### JavaScript

JavaScript tem `null` e `undefined`.

```js
let a = null;
let b;

console.log(a); // null
console.log(b); // undefined
```

### Python

Python usa `None`.

```python
value = None
```

Regra mental:

- ausência de valor não é a mesma coisa que zero
- ausência de valor não é string vazia
- ausência de valor não é `false`

## Casting e conversão

Agora chegamos numa parte crítica.

Casting é conversão de um tipo para outro.

Ela pode ser:

- implícita
- explícita
- segura
- perigosa

## Casting implícito

A linguagem converte sem você pedir.

Às vezes ajuda.

Às vezes planta bomba.

### Exemplo em C

```c
int a = 10;
double b = a; // conversão implícita de int para double
```

### Exemplo em JavaScript

```js
console.log("5" + 1); // "51"
console.log("5" - 1); // 4
```

Isso acontece porque JavaScript faz coerção implícita de tipos.

É poderoso.

Mas também é uma fábrica de bug quando usado sem atenção.

## Casting explícito

Você deixa claro que quer converter.

### C

```c
#include <stdio.h>

int main(void) {
    double x = 3.99;
    int y = (int)x;
    printf("%d\n", y); // 3
    return 0;
}
```

### C++

Prefira `static_cast` em vez de cast estilo C quando possível:

```cpp
#include <iostream>

int main() {
    double x = 3.99;
    int y = static_cast<int>(x);
    std::cout << y << '\n'; // 3
}
```

### JavaScript

```js
console.log(Number("42"));      // 42
console.log(parseInt("42", 10)); // 42
console.log(parseFloat("3.14")); // 3.14
```

### Python

```python
print(int("42"))      # 42
print(float("3.14"))  # 3.14
print(str(42))        # "42"
```

## Conversões perigosas

### Perda de parte decimal

```cpp
double price = 19.99;
int truncated = static_cast<int>(price); // 19
```

### Overflow por narrowing

```c
#include <stdio.h>

int main(void) {
    int x = 300;
    unsigned char y = (unsigned char)x;
    printf("%u\n", y); // pode virar 44
    return 0;
}
```

Porque:

```text
300 % 256 = 44
```

### String inválida para número

```python
value = "abc"
# int(value) -> ValueError
```

```js
console.log(Number("abc")); // NaN
```

## `NaN`: número que não é número

Em JavaScript:

```js
const value = Number("abc");

console.log(value);            // NaN
console.log(Number.isNaN(value)); // true
```

Esse tipo de caso precisa ser tratado antes de seguir lógica de negócio.

## Hexadecimal e leitura de memória

Hexadecimal aparece o tempo todo porque ele conversa muito bem com bytes.

Cada dígito hexadecimal representa 4 bits.

```text
Binário:      11111111
Hexadecimal:  FF
Decimal:      255
```

Conversão:

```text
1111 1111
 F    F
```

Outro exemplo:

```text
0100 0001
 4    1

0x41 = 65 = 'A'
```

## Endianness: ordem dos bytes

Quando um valor ocupa mais de 1 byte, a ordem de armazenamento importa.

Exemplo com `0x12345678`:

### Big-endian

```text
+------+------+------+------+
| 12   | 34   | 56   | 78   |
+------+------+------+------+
```

### Little-endian

```text
+------+------+------+------+
| 78   | 56   | 34   | 12   |
+------+------+------+------+
```

Isso aparece em:

- serialização
- redes
- leitura de arquivos binários
- interoperabilidade entre sistemas

## Tamanho de tipos em prática

Exemplo em C:

```c
#include <stdio.h>

int main(void) {
    printf("char: %zu\n", sizeof(char));
    printf("short: %zu\n", sizeof(short));
    printf("int: %zu\n", sizeof(int));
    printf("long: %zu\n", sizeof(long));
    printf("long long: %zu\n", sizeof(long long));
    printf("float: %zu\n", sizeof(float));
    printf("double: %zu\n", sizeof(double));
    return 0;
}
```

Exemplo em C++:

```cpp
#include <iostream>

int main() {
    std::cout << sizeof(char) << '\n';
    std::cout << sizeof(int) << '\n';
    std::cout << sizeof(double) << '\n';
}
```

## Como modelar dados de verdade

Antes de escolher tipo, responde:

1. Isso é quantidade, identidade, texto, estado, data ou dinheiro?
2. Eu vou calcular com isso?
3. Existe limite conhecido?
4. Preciso preservar exatidão?
5. Pode faltar valor?
6. Esse dado vem de usuário, API ou arquivo?

Essas perguntas evitam muita gambiarra.

## Exemplos de modelagem correta

### Usuário

```text
nome         -> string
idade        -> inteiro
ativo        -> booleano
criadoEm     -> data/hora
```

### Pedido

```text
idPedido     -> string ou inteiro de domínio
valorCentavos -> inteiro
pago         -> booleano
status       -> enum ou string validada
```

### Produto

```text
sku          -> string
estoque      -> inteiro
precoCentavos -> inteiro
```

## Mini laboratório de exemplos

### C: caractere e inteiro compartilham base numérica

```c
#include <stdio.h>

int main(void) {
    char c = 'A';
    int code = c;

    printf("char: %c\n", c);
    printf("code: %d\n", code);
    return 0;
}
```

### C++: truncamento explícito

```cpp
#include <iostream>

int main() {
    double ratio = 9.87;
    int whole = static_cast<int>(ratio);

    std::cout << ratio << '\n';
    std::cout << whole << '\n';
}
```

### JavaScript: coerção traiçoeira

```js
console.log("10" + 2);   // "102"
console.log("10" - 2);   // 8
console.log(true + 1);   // 2
console.log(false + 1);  // 1
```

### Python: conversão segura com tratamento

```python
raw = "42"

try:
    value = int(raw)
    print(value + 8)
except ValueError:
    print("entrada inválida")
```

## Erros clássicos de iniciante

- usar string para tudo
- comparar `"10"` com `10`
- usar `float` para dinheiro
- achar que `char` não tem valor numérico
- converter sem validar
- misturar ausência de valor com zero
- ignorar limite do tipo

## Sinais de que a modelagem está ruim

- o mesmo campo muda de tipo em camadas diferentes
- você converte toda hora
- o sistema está cheio de `if` defensivo sem clareza
- bugs aparecem em ordenação, filtro, cálculo e serialização

## Exercícios que realmente valem

1. Converta `13` para binário manualmente.
2. Converta `0.625` para binário manualmente.
3. Mostre em código que `'A'` vale `65`.
4. Modele um pedido usando centavos em vez de float.
5. Faça parsing seguro de string para inteiro em C, C++, JavaScript e Python.
6. Compare `0.1 + 0.2` com `0.3` e explique o resultado.

## Checklist forte de tipos de dados

- Você entende bit, byte e representação binária?
- Você sabe a diferença entre inteiro, float, char, string e bool?
- Você sabe que caractere também é número?
- Você conhece o básico de complemento de dois?
- Você entende por que float falha em dinheiro?
- Você sabe quando usar cast explícito?
- Você trata input inválido antes de converter?

Se você fecha esses pontos, sua base já sai do nível “tutorial” e entra no nível de engenharia.

## Próximas ações

- Consulte agora a [Tabela ASCII](/pt/reference/tabela-ascii/)
- Depois avance para [Estruturas de Dados](/pt/reference/estruturas-de-dados/)
- Se quiser consolidar raciocínio, siga para [Lógica de Programação](/pt/reference/logica-de-programacao/)
