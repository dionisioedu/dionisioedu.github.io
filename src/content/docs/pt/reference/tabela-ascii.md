---
title: Tabela ASCII
description: Tabela ASCII completa com códigos de controle, caracteres imprimíveis, hexadecimal, binário e contexto histórico.
sidebar:
  label: Tabela ASCII
---

ASCII significa **American Standard Code for Information Interchange**.

É uma tabela que mapeia números para caracteres e sinais de controle.

Ela é uma das bases históricas da computação, porque mostra de forma muito clara uma ideia central:

**texto também é número.**

Quando você entende ASCII, fica mais fácil entender:

- por que `'A'` vale `65`
- por que `'0'` vale `48`
- como strings são armazenadas
- como parsing e serialização funcionam
- por que bytes podem ser lidos como texto ou como número

Se você estiver lendo a página de [Tipos de Dados](/pt/reference/tipos-de-dados/), esta tabela é o complemento natural.

## Como ler a tabela

- `DEC`: valor decimal
- `HEX`: valor hexadecimal
- `BIN`: valor binário em 8 bits
- `CHAR`: caractere correspondente, quando existir forma imprimível
- `NAME`: nome ou abreviação do código

## Códigos de controle: 0 a 31 e 127

```text
DEC  HEX  BIN        CHAR  NAME
0    00   00000000         NUL
1    01   00000001         SOH
2    02   00000010         STX
3    03   00000011         ETX
4    04   00000100         EOT
5    05   00000101         ENQ
6    06   00000110         ACK
7    07   00000111         BEL
8    08   00001000         BS
9    09   00001001         TAB
10   0A   00001010         LF
11   0B   00001011         VT
12   0C   00001100         FF
13   0D   00001101         CR
14   0E   00001110         SO
15   0F   00001111         SI
16   10   00010000         DLE
17   11   00010001         DC1
18   12   00010010         DC2
19   13   00010011         DC3
20   14   00010100         DC4
21   15   00010101         NAK
22   16   00010110         SYN
23   17   00010111         ETB
24   18   00011000         CAN
25   19   00011001         EM
26   1A   00011010         SUB
27   1B   00011011         ESC
28   1C   00011100         FS
29   1D   00011101         GS
30   1E   00011110         RS
31   1F   00011111         US
127  7F   01111111         DEL
```

### O que esses controles faziam

Esses códigos nasceram para comunicação com teletipos, terminais e impressoras.

Alguns ainda aparecem muito:

- `TAB` (`9`): tabulação
- `LF` (`10`): line feed, quebra de linha em vários sistemas
- `CR` (`13`): carriage return
- `ESC` (`27`): escape

## Caracteres imprimíveis: 32 a 47

```text
DEC  HEX  BIN        CHAR  NAME
32   20   00100000   SP    SPACE
33   21   00100001   !     EXCLAMATION MARK
34   22   00100010   "     QUOTATION MARK
35   23   00100011   #     NUMBER SIGN
36   24   00100100   $     DOLLAR SIGN
37   25   00100101   %     PERCENT SIGN
38   26   00100110   &     AMPERSAND
39   27   00100111   '     APOSTROPHE
40   28   00101000   (     LEFT PARENTHESIS
41   29   00101001   )     RIGHT PARENTHESIS
42   2A   00101010   *     ASTERISK
43   2B   00101011   +     PLUS SIGN
44   2C   00101100   ,     COMMA
45   2D   00101101   -     HYPHEN-MINUS
46   2E   00101110   .     FULL STOP
47   2F   00101111   /     SLASH
```

## Dígitos e pontuação: 48 a 64

```text
DEC  HEX  BIN        CHAR  NAME
48   30   00110000   0     DIGIT ZERO
49   31   00110001   1     DIGIT ONE
50   32   00110010   2     DIGIT TWO
51   33   00110011   3     DIGIT THREE
52   34   00110100   4     DIGIT FOUR
53   35   00110101   5     DIGIT FIVE
54   36   00110110   6     DIGIT SIX
55   37   00110111   7     DIGIT SEVEN
56   38   00111000   8     DIGIT EIGHT
57   39   00111001   9     DIGIT NINE
58   3A   00111010   :     COLON
59   3B   00111011   ;     SEMICOLON
60   3C   00111100   <     LESS-THAN SIGN
61   3D   00111101   =     EQUALS SIGN
62   3E   00111110   >     GREATER-THAN SIGN
63   3F   00111111   ?     QUESTION MARK
64   40   01000000   @     AT SIGN
```

## Letras maiúsculas: 65 a 90

```text
DEC  HEX  BIN        CHAR  NAME
65   41   01000001   A     LATIN CAPITAL LETTER A
66   42   01000010   B     LATIN CAPITAL LETTER B
67   43   01000011   C     LATIN CAPITAL LETTER C
68   44   01000100   D     LATIN CAPITAL LETTER D
69   45   01000101   E     LATIN CAPITAL LETTER E
70   46   01000110   F     LATIN CAPITAL LETTER F
71   47   01000111   G     LATIN CAPITAL LETTER G
72   48   01001000   H     LATIN CAPITAL LETTER H
73   49   01001001   I     LATIN CAPITAL LETTER I
74   4A   01001010   J     LATIN CAPITAL LETTER J
75   4B   01001011   K     LATIN CAPITAL LETTER K
76   4C   01001100   L     LATIN CAPITAL LETTER L
77   4D   01001101   M     LATIN CAPITAL LETTER M
78   4E   01001110   N     LATIN CAPITAL LETTER N
79   4F   01001111   O     LATIN CAPITAL LETTER O
80   50   01010000   P     LATIN CAPITAL LETTER P
81   51   01010001   Q     LATIN CAPITAL LETTER Q
82   52   01010010   R     LATIN CAPITAL LETTER R
83   53   01010011   S     LATIN CAPITAL LETTER S
84   54   01010100   T     LATIN CAPITAL LETTER T
85   55   01010101   U     LATIN CAPITAL LETTER U
86   56   01010110   V     LATIN CAPITAL LETTER V
87   57   01010111   W     LATIN CAPITAL LETTER W
88   58   01011000   X     LATIN CAPITAL LETTER X
89   59   01011001   Y     LATIN CAPITAL LETTER Y
90   5A   01011010   Z     LATIN CAPITAL LETTER Z
```

## Símbolos: 91 a 96

```text
DEC  HEX  BIN        CHAR  NAME
91   5B   01011011   [     LEFT SQUARE BRACKET
92   5C   01011100   \     BACKSLASH
93   5D   01011101   ]     RIGHT SQUARE BRACKET
94   5E   01011110   ^     CIRCUMFLEX ACCENT
95   5F   01011111   _     UNDERSCORE
96   60   01100000   `     GRAVE ACCENT
```

## Letras minúsculas: 97 a 122

```text
DEC  HEX  BIN        CHAR  NAME
97   61   01100001   a     LATIN SMALL LETTER A
98   62   01100010   b     LATIN SMALL LETTER B
99   63   01100011   c     LATIN SMALL LETTER C
100  64   01100100   d     LATIN SMALL LETTER D
101  65   01100101   e     LATIN SMALL LETTER E
102  66   01100110   f     LATIN SMALL LETTER F
103  67   01100111   g     LATIN SMALL LETTER G
104  68   01101000   h     LATIN SMALL LETTER H
105  69   01101001   i     LATIN SMALL LETTER I
106  6A   01101010   j     LATIN SMALL LETTER J
107  6B   01101011   k     LATIN SMALL LETTER K
108  6C   01101100   l     LATIN SMALL LETTER L
109  6D   01101101   m     LATIN SMALL LETTER M
110  6E   01101110   n     LATIN SMALL LETTER N
111  6F   01101111   o     LATIN SMALL LETTER O
112  70   01110000   p     LATIN SMALL LETTER P
113  71   01110001   q     LATIN SMALL LETTER Q
114  72   01110010   r     LATIN SMALL LETTER R
115  73   01110011   s     LATIN SMALL LETTER S
116  74   01110100   t     LATIN SMALL LETTER T
117  75   01110101   u     LATIN SMALL LETTER U
118  76   01110110   v     LATIN SMALL LETTER V
119  77   01110111   w     LATIN SMALL LETTER W
120  78   01111000   x     LATIN SMALL LETTER X
121  79   01111001   y     LATIN SMALL LETTER Y
122  7A   01111010   z     LATIN SMALL LETTER Z
```

## Símbolos finais: 123 a 126

```text
DEC  HEX  BIN        CHAR  NAME
123  7B   01111011   {     LEFT CURLY BRACKET
124  7C   01111100   |     VERTICAL LINE
125  7D   01111101   }     RIGHT CURLY BRACKET
126  7E   01111110   ~     TILDE
```

## Padrões úteis para memorizar

Tem alguns padrões muito úteis:

- dígitos `0` a `9` vão de `48` a `57`
- letras maiúsculas `A` a `Z` vão de `65` a `90`
- letras minúsculas `a` a `z` vão de `97` a `122`

Diferença entre maiúscula e minúscula:

```text
'A' = 65
'a' = 97

97 - 65 = 32
```

Esse deslocamento de `32` aparece bastante em transformações simples de texto.

## Exemplos rápidos em código

### C

```c
#include <stdio.h>

int main(void) {
    char c = 'A';
    printf("%d\n", c); // 65
}
```

### C++

```cpp
#include <iostream>

int main() {
    std::cout << static_cast<int>('A') << '\n'; // 65
}
```

### JavaScript

```js
console.log('A'.charCodeAt(0)); // 65
console.log(String.fromCharCode(65)); // A
```

### Python

```python
print(ord('A'))  # 65
print(chr(65))   # A
```

## Um pouco de história

ASCII foi padronizado nos anos 1960 para permitir comunicação consistente entre equipamentos diferentes.

Na época, isso era enorme.

Sem padrão, cada máquina podia inventar sua própria codificação de texto.

ASCII ajudou a unificar:

- terminais
- impressoras
- protocolos
- arquivos de texto
- sistemas operacionais

Depois vieram extensões e, mais tarde, Unicode para cobrir o resto do mundo.

## ASCII hoje ainda importa?

Sim. Muito.

Mesmo que software moderno use Unicode, ASCII continua importante porque:

- os primeiros 128 códigos do Unicode batem com ASCII
- muitos protocolos e formatos ainda assumem ASCII em partes críticas
- debugging de bytes, logs, parsing e redes fica muito mais fácil quando você conhece esses valores

## Próximas ações

- Volte para [Tipos de Dados](/pt/reference/tipos-de-dados/)
- Depois avance para [Estruturas de Dados](/pt/reference/estruturas-de-dados/)
