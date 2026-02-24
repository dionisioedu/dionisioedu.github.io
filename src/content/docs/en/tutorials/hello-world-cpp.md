---
layout: tutorial
title: Hello World in C++
image: 
nav-menu: false
show_tile: false
---

I'm going to show you something <i>simple</i> and <i>fundamental</i> for every <b>C/C++ programmer</b>: the ability to compile and run a simple application <mark>with no dependencies at all</mark> and without needing any IDEs or graphical tools.

<div class="box">
&#128073; For this tutorial I'm using <b>Linux</b>, and we'll do everything in the console, without any graphical interfaces. This way, if you're accessing a server or using a very basic system, you'll still be able to write, compile, and run your applications without any problems.
</div>

<p>Open a terminal:</p>
<div class="box">
&#128073; <b>Windows:</b> Win + R, type cmd or powershell.<br>
&#128073; <b>macOS:</b> Cmd + Space, type Terminal.<br>
&#128073; <b>Linux:</b> Ctrl + Alt + T (on most distributions).<br>
</div>

<p>Type the following commands to <i>create a folder</i>, enter the folder, and create your <i>first</i> <b>C++ code</b> file.</p>
<pre><code>~$ mkdir project
~$ cd project
~$ vi main.cpp
</code></pre>

<div class="box">
<p><b>vi</b> is a console text editor, native to practically all Linux-based operating systems. Its usability is not very intuitive, so it's worth taking some time to learn how to use this tool — it can be extremely useful in many situations.</p>
</div>

&#10071;&#65039; To start editing mode in vi, press the '<b>a</b>' key.
<pre><code>#include "iostream"
int main()
{
    std::cout << "Hello World!" << std::endl;
    return 0;
}
</code></pre>

&#10071;&#65039; When you're finished editing, press the '<b>Esc</b>' key to exit vi's edit mode.<br>
&#128161; To save and exit, type '<b>:wq</b>' and press '<b>Enter</b>' (w → write, q → quit).

Back at the command prompt, with our code ready, let's compile the application:
<pre><code>~$ g++ main.cpp</code></pre>

&#128073; After compilation, an executable file will be created with the default name <b>a.out</b> <i>(we can specify any name we want)</i>.

Now your application is ready to run! &#127881;
<pre><code>~$ ./a.out
Hello World!
</code></pre>

<p>All of this was <i>very simple</i>, but the tools we used are incredibly powerful!</p>
<p>If you spend some time mastering <b>vi</b> and <b>gdb</b>, you'll have an amazing trick up your sleeve.</p>
<p>Imagine how cool it is to be able to open any terminal and, in just minutes, have your own program running — like a <strong>hacker</strong> in an <b>action movie</b>! &#128187;</p>