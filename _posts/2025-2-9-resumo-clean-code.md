---
layout: post
title: Resumo do Clean Code Para Quem Está Com Pressa
description: 
author: Dionisio
image: assets/images/clean-code.jpg
---

Eu considero o Clean Code um dos maiores clássicos do mundo do desenvolvimento de software. Tem os que gostam e tem os que criticam, mas, com certeza, todo mundo conhece alguns conceitos que vieram desse livro.


# Capítulo 1 : Código Limpo
O livro começa explicando o que significa **Código Limpo**, ressaltando que o código é lido *MUITO mais vezes do que escrito*. Então uma das principais preocupações de um **bom programador** é a **qualidade do código** que ele está escrevendo, ou seja, ele tem que ser fácil de entender, de modificar e de estender. *Pense que seu código pode durar por vários anos e até décadas!*

# Capítulo 2 : Nomes Significativos
O tio Bob (*o autor do livro*), ressalta a importância de escolher bem nomes para suas **variáveis**, **métodos** e **classes**. Nomes com significado economizam muito tempo e espaço, já que torna os comentários praticamente desnecessários e *ajudam o programador*, que não vai precisar analisar várias linhas de código para entender o que cada objeto significa ou o que cada método realiza.

# Capítulo 3 : Funções
Funções devem ser *pequenas* e ter **uma única função**. Elas devem ter nomes claros que indicam exatamente o que elas fazem. Se uma função está crescendo demais, ela provavelmente está errada. Ele fala sobre o **Princípio da Responsabilidade Única**, o **S** do **SOLID**.

# Capítulo 4 : Comentários
Comentários devem ser *evitados ao máximo*, e quando utilizados, devem explicar o "**porquê**" de algo, e não o "**como**" o código funciona.<br>
Prefira sempre código *claro* e *autoexplicativo*, e mantenha os comentários atualizados.

# Capítulo 5 : Formatação
Um **código profissional** de **qualidade** deve ser *fácil de ler*.<br>
Deve seguir uma formatação constante em **todo o projeto**. Seguindo regras de formatação que geralmente são definidas por cada empresa, ou então seguindo o padrão que está sendo utilizado no mercado.<br>
Um código mal formatado fica difícil de ler, e pode esconder erros com mais facilidade do que um código limpo e organizado.

# Capítulo 6 : Objetos e Estruturas de Dados
Fala sobre a diferença entre **objetos** e **estruturas de dados**. E aprofunda nos conceitos de *Orientação à Objetos*, enfatizando a importância da *separação de responsabilidades*.<br>
* **Objetos** são entidades que encapsulam tanto dados quanto comportamentos.
* **Estruturas de dados** são apenas coleções de dados.

# Capítulo 7 : Tratamento de Erros
Implementar um tratamento de erros claro e robusto é super importante para ter um **software confiável**.<br>
Erros vão acontecer, e seu código deve *estar preparado* para lidar com eles. Criando um fluxo seguro para que o programa continue funcionando bem independente das excecões que possam ocorrer.

# Capítulo 8 : Limites
Ressalta a importância de definir bem e com clareza as suas **interfaces**, ou seja, o que cada classe ou API vai expor para o restante do sistema.<br>
O código deve sempre depender de uma **abstração**, para se proteger de mudanças externas.

# Capítulo 9 : Testes Unitários
Testes unitários são muito valiosos para manter a *qualidade do código*, e ele deve ser tratado como **código de produção**.<br>
Uma boa cobertura de testes permite que o código seja refatorado sem riscos de quebrar.

# Capítulo 10 : Classes
Aprofunda na questão da *responsabilidade única*. *Classes devem ser pequenas* e ter uma **única responsabilidade**.

# Capítulo 11 : Sistemas
Os sistemas devem ser divididos em partes que podem ser gerenciadas de forma independente. A comunicação e coordenação entre essas partes deve ser simples e clara.

# Capítulo 12 : Emergência
Ele descreve 4 regras para facilitar a criação de um bom projeto:
* Efetuar todos os testes
* Sem código duplicado
* Expressar o propósito do programador
* Minimizar o número de classes e métodos.

Nessa ordem.

# Capítulo 13 : Concorrência
Programação *multithread* exige simplicidade e clareza para facilitar a manutenção. Mantenha o código nas áreas de concorrência o mais simples possível e evite *data races*.

# Capítulo 14 : Refinamento Sucessivo
Código não envelhece, mas precisa estar em constante **refatoração** e evolução para se manter **atualizado**.

# Estudo de Caso e Conclusões (Parte II)
Estudo de Caso:
Uma seção prática onde o autor aplica os princípios do Clean Code para refatorar um sistema legado, demonstrando as técnicas discutidas.

# Conclusões:

Código limpo é uma filosofia que transforma a maneira como escrevemos e mantemos software.
A adoção desses princípios resulta em software mais sustentável, confiável e fácil de evoluir.
Esse foi um resumo bem rápido só pra você relembrar ou descobrir o que tem nesse livro tão conhecido na nossa área.

Ele fala da importância de escrever um código que tenha valor além do programa que ele gera, mas que seja tratado como um ativo de valor da empresa.

Recomento demais a leitura, pois ele trás muito mais valor e conteúdo do que o que pudemos colocar aqui.

Eu sou do time que gosta muito do Clean Code, e você, tem uma opinião formada? Comenta aqui!!!