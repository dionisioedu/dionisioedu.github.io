---
layout: tutorial
title: Hello World no C++
image: 
nav-menu: false
show_tile: false
---
Eu vou te mostrar algo <i>simples</i> e <i>fundamental</i> para todo <b>programador C/C++</b> que é a capacidade de compilar e rodar uma aplicação simples <mark>sem nenhuma dependência</mark> e sem a necessidade de IDEs ou ferramentas gráficas.

<div class="box">
&#128073; Para realizar este tutorial estou usando <b>Linux</b>, e vamos fazer tudo no console, sem a necessidade de utilizar interfaces gráficas, assim, se você estiver acessando um servidor ou estiver em um sistema muito básico, vai conseguir escrever, compilar e rodar as suas aplicações sem problemas.
</div>
<p>Abra um terminal:</p>
<div class="box">
&#128073; <b>Windows:</b> Win + R, digite cmd ou powershell.<br>
&#128073; <b>macOS:</b> Cmd + Espaço, digite Terminal.<br>
&#128073; <b>Linux:</b> Ctrl + Alt + T (na maioria das distribuições).<br>
</div>
<p>Digite os seguintes comandos para <i>criar uma pasta</i>, entrar na pasta, e criar o seu <i>primeiro arquivo</i> de <b>código C++</b>.</p>
<pre><code>~$ mkdir projeto
~$ cd projeto
~$ vi main.cpp
</code></pre>
<div class="box">
<p><b>vi</b> é um editor de textos no console, nativo de praticamente todos os sistemas operacionais baseados em Linux. A usabilidade não é nada intuitiva, então, é bom também que você reserve algum tempo para aprender a trabalhar com essa ferramenta, que pode ser muito útil em diversas situações.</p>
</div>
&#10071;&#65039; Para iniciar o modo de edição do vi você precisa digitar a tecla ‘<b>a</b>’.
<pre><code>#include "iostream"
int main()
{
    std::cout << "Hello World!" << std::endl;
    return 0;
}
</code></pre>
&#10071;&#65039; Ao terminar a edição, digite a tecla ‘Esc’ para sair do modo de edição do <b>vi</b>.<br>
&#128161; Para salvar e sair você deve digitar ‘<b>:qw</b>’ e confirmar com a tecla ‘<b>Enter</b>’ (q -> quit, w -> write).

De volta ao prompt de comando, já com nosso código pronto, vamos compilar nossa aplicação:
<pre><code>~$ g++ main.cpp</code></pre>
&#128073; Após a compilação um arquivo executável será criado com o nome <b>a.out</b> <i>(nome padrão, mas podemos informar o nome que quisermos)</i>.

Agora sua aplicação está pronta para ser executada! &#127881;
<pre><code>~$ ./a.out
Hello World!
</code></pre>
<p>Tudo isso foi <i>muito simples</i>, mas essas ferramentas que utilizamos são muito poderosas!</p>
<p>Se você investir um tempo se aprofundando no uso do <b>vi</b> e do <b>gdb</b> vai ter um truque incrível na manga.</p>
<p>Pensa que interessante você poder acessar qualquer terminal e em minutos ter um programa seu sendo executado, como um <strong>hacker</strong> em um <b>filme de ação</b>! &#128187;</p>