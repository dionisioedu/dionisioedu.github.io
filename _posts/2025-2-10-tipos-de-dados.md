---
layout: post
title: Tipos De Dados
description: 
author: Dionisio
image: assets/images/data-types.webp
---
Nesse post você vai aprender o básico sobre os **Tipos de Dados** para nunca mais ficar inseguro e saber o suficiente para seguir para a etapa seguinte que são as **Estruturas de Dados**.

Em programação, **Tipos de Dados** definem:

* Quais valores uma variável pode armazenar.
* Quais operações ela pode realizar.
* A forma como esses valores serão armazenados na memória do computador.

## Existem 3 Tipos de Dados
* **Primitivos**: São fornecidos pelas linguagens de programação (_Inteiros_, _Ponto Flutuante_, _Caracteres_, _Booleanos_)
<pre><code>int idade = 30;
float salario = 5432.10;
char letra = 'A';
bool ativo = true;
</code></pre>
* **Compostos**: São formados com a combinação de _tipos primitivos_ (_Arrays_, _Strings_, _Structs_ e coleções em linguagens de alto nível).
<pre><code>numeros = [1, 2, 3, 4, 5] #Lista de inteiros
pessoa = {"nome": "Ana", "idade": 28, "ativo": True} #Dicionário (chave: valor)
coordenadas = (10.0, 20.0) #Tupla
</code></pre>
* **Abstratos**: São interfaces para **estruturas de dados** que não especificam a implementação: (_Listas_, _Filas_, _Pilhas_, _Árvores_, _Grafos_).

## Tipagem Estática x Tipagem Dinânica
Algumas linguagens, como _C_, _C++_, _Java_, _C#_ e _Rust_ implementam **Tipagem Estática**. Ou seja, os **Tipos de Dados** são declarados pelo programador e validados quando o sistema é **compilado**.
<pre><code>int idade = 30;
double salario = 9500.00;
String nome = "Carlos";
</code></pre>
Já nas linguagens que trabalham com **Tipagem Dinânica**, como _JavaScript_, _Python_ e _Ruby_, os **Tipos de Dados** não são declarados pelo **programador**, e são definidos em **tempo de execução**, ou seja, quando o sistema está rodando.
<pre><code>idade = 30
idade = "trinta"
</code></pre>

## Tipagem Forte vs Tipagem Fraca
* **Tipagem Forte**: A linguagem tem restrições que impedem conversões entre tipos incompatíveis, como converter uma **String** para um **Inteiro**, por exemplo.
* **Tipagem Fraca**: Permite conversões implícitas entre tipos, o que pode levar a resultados inesperados. O que acontece quando você converte uma **String** inválida para um **Double**?… (_Exception_!)

## Conversão de Tipos: Casting
**Casting** é a conversão de um Tipo de Dado para outro:
<pre><code>int a = 5;
double b = (double)a;
</code></pre>
Cada linguagem implementa sua maneira de fazer **casting**, e assim é possível passar um valor de um **Tipo de Dados** para outro.

## Espaço na Memória
Aqui listamos o espaço que cada **Tipo de Dados** ocupa na memória, e quais os valores que cada um deles pode armazenar. Esses nomes vieram do C, mas são bem parecidos para as linguagens que vieram depois. Contudo, algumas linguagens usam nomes diferentes para esses mesmos Tipos.

![Tipos de Dados](/assets/images/data-types-table.webp)

## Conclusão
Bom, isso é o básico que você precisa saber sobre **Tipos de Dados** para ser capaz de entender o segundo conceito mais importante na programação que são as **Estruturas de Dados**.
Mas isso fica para outro post. &#128640;