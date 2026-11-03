---
title: "Uma entrevista falsa no caminho do ataque bilionário à Binance"
description: "Uma vaga, um teste de código e bilhões em jogo. Entenda a cronologia relatada pela Binance, o papel das permissões e o que ainda falta esclarecer."
publishedAt: 2026-11-03
author: Dionisio
tags:
  - News
  - Segurança
  - Arquitetura
  - DevOps
cover: /assets/images/binance-permission-boundary.png
coverAlt: Ilustração editorial de um notebook conectado a portões de acesso e a um mecanismo de assinatura, ao lado de uma chave protegida em um cofre
---

<section class="ae-feature">
  <img src="/assets/images/binance-permission-boundary.png" alt="Um caminho de permissões liga um notebook a um carimbo de assinatura, enquanto uma chave permanece protegida dentro de um cofre" loading="eager" width="1727" height="911" fetchpriority="high" decoding="async" />
  <div class="ae-feature-copy">
    <p class="ae-kicker">News · Segurança · Arquitetura</p>
    <h2>O teste era de programação. A vaga era uma armadilha.</h2>
    <p>Uma entrevista falsa aparece na reconstrução do ataque à Binance. Para entender como isso se conecta a bilhões em criptoativos, é preciso voltar alguns meses.</p>
    <div class="ae-meta"><span>3 de novembro de 2026</span><span>Cronologia do caso</span><span>Investigação em andamento</span></div>
  </div>
</section>

Você recebe uma proposta de emprego. Conversa com o recrutador. Passa para a próxima etapa. Chega o teste técnico: baixar um projeto e colocá-lo para rodar.

Até aqui, uma situação comum na carreira de um dev. Mas essa sequência faz parte do relato da Binance sobre o ataque de 29 de outubro. A empresa prometeu reservar mais de **US$ 6,34 bilhões** de recursos próprios para cobrir o impacto. [Fontes: reconstrução do recrutamento](https://www.theblock.co/news/business/2026-11-03-binance-hack-incident-report-north-korea-fake-job-interview-ai-tool-432406) e [comunicado financeiro da Binance](https://www.binance.com/pt-BR/support/announcement/detail/d3306d9dca5243548c813b605e1d1751).

**Como uma conversa sobre trabalho entra numa história de bilhões?** É essa ligação que a cronologia abaixo ajuda a entender. Você não precisa conhecer criptomoedas para acompanhar.

## Antes da linha do tempo: quem é quem

- **Binance:** a corretora onde clientes negociam criptoativos.
- **Carteira:** o mecanismo usado para controlar e movimentar esses ativos.
- **Credencial:** uma prova de acesso, como uma senha ou um token usado por software.

Pense numa empresa com várias portas: entrar no prédio, acessar a sala de operações e autorizar uma transferência deveriam exigir permissões diferentes. O que interessa nesta história é o caminho entre essas portas.

**Agora, os acontecimentos em ordem.** Os horários abaixo estão em UTC; para Brasília, subtraia três horas.

A cronologia interna ainda depende do relato da empresa. Dados observados na blockchain e a atribuição do FBI aparecem com suas próprias fontes. Há uma [versão em inglês](/en/artigos-tecnicos/binance-incidente-seguranca-2026/).

## Junho — um instalador adulterado abre a primeira frente

Segundo a reconstrução da Binance, repercutida pelo The Block, um engenheiro de Wallet DevOps baixou uma instalação adulterada do Homebrew enquanto tentava instalar uma ferramenta de programação com IA. A empresa diz ter detectado o problema, substituído o dispositivo e trocado credenciais. [Fonte: The Block, 3 de novembro.](https://www.theblock.co/news/business/2026-11-03-binance-hack-incident-report-north-korea-fake-job-interview-ai-tool-432406)

A história, portanto, começa antes das movimentações financeiras. O primeiro cenário é um ambiente de desenvolvimento. Homebrew é uma ferramenta para instalar programas; aqui, o problema relatado estava na versão adulterada que foi baixada.

## Setembro — a oportunidade de emprego era uma armadilha

Outro engenheiro recebeu um contato numa plataforma legítima de empregos. Vieram entrevistas com supostos representantes de uma empresa e, depois, um exercício de programação. O repositório baixado para o computador de trabalho continha malware, segundo o relato da corretora. [Fonte: The Block.](https://www.theblock.co/news/business/2026-11-03-binance-hack-incident-report-north-korea-fake-job-interview-ai-tool-432406)

É uma sequência familiar para qualquer dev: recrutador, entrevista, teste técnico. Aqui, ela foi usada para levar código hostil até a máquina de um funcionário.

## 20 de outubro — o acesso avança internamente

Segundo a Binance, uma ferramenta interna de IA permitiu alcançar engenheiros e um token de deploy. [Fonte: relatório preliminar.](https://www.binance.bh/en/blog/community/3229153443759566763)

O mecanismo não está suficientemente detalhado para concluir que houve prompt injection ou uma falha do modelo.

Em linguagem direta: o relato envolve acesso a mais pessoas e a uma permissão para colocar software em execução. A frase “a IA roubou o dinheiro” pula etapas que a investigação ainda precisa explicar.

## 29 de outubro, 17h15–19h56 — um container é implantado

Credenciais roubadas permitiram implantar um container e executar código malicioso, segundo a empresa. [Fonte: Binance.](https://www.binance.bh/en/blog/community/3229153443759566763)

Um *container* é um ambiente que reúne o necessário para executar uma aplicação. *Deploy* é colocá-la em funcionamento. O ponto aqui é quem conseguiu usar essa capacidade — e para executar o quê.

## 29 de outubro, 20h05–20h09 — começam as saídas documentadas

Cinco carteiras enviaram 233,46 milhões de XRP ao atacante, informa a Binance. [Fonte: Binance.](https://www.binance.bh/en/blog/community/3229153443759566763)

A investigação on-chain da Chainalysis descreve movimentações em diversas redes. No Ethereum, identificou autorizações assinadas que permitiram a uma carteira executar código do atacante; outras carteiras fizeram transferências assinadas comuns. [Fonte: Chainalysis.](https://www.chainalysis.com/blog/binance-exploit-latest-findings-and-response/)

*Hot wallets* são carteiras usadas na operação online. É por elas que esta parte da história passa.

> Uma assinatura válida prova algo sobre a autorização criptográfica. Não prova, sozinha, que a operação era desejada pelo negócio.

## Ainda em 29 de outubro — começa a corrida para bloquear os recursos

A Chainalysis registra o início de congelamentos até 17h14 no horário do leste dos EUA, equivalente a **21h14 UTC** naquela data. Também observou a troca de stablecoins por ETH enquanto ocorria a contenção. [Fonte: Chainalysis.](https://www.chainalysis.com/blog/binance-exploit-latest-findings-and-response/)

A diferença importa: emissores conseguem congelar determinados tokens. Isso não equivale a desfazer toda transferência ou recuperar imediatamente todos os ativos.

Stablecoins são tokens que buscam acompanhar o valor de uma referência, geralmente uma moeda como o dólar. ETH é o ativo nativo do Ethereum. Trocar um pelo outro muda as possibilidades de bloqueio.

## 23h56 e 00h10 — transferência final e revogação

A Binance registra a transferência final às **23h56** e a remoção da delegação às **00h10**, já no dia 30. [Fonte: Binance.](https://www.binance.bh/en/blog/community/3229153443759566763)

Para entender “delegação”: a [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) permite autorizar uma conta Ethereum a executar código delegado. A autorização pode persistir até ser alterada ou removida. Fechar uma interface de saques e revogar uma autorização na rede são ações distintas.

## 30 de outubro — a empresa promete cobrir as perdas

A Binance anunciou que usaria SAFU e tesouraria corporativa para absorver o impacto. Disse ter reservado mais de **US$ 6,34 bilhões** em recursos próprios. É uma declaração da empresa sobre cobertura financeira, não uma confirmação de que todo o dinheiro roubado foi recuperado. [Fonte: atualização de 30 de outubro.](https://www.binance.com/pt-BR/support/announcement/detail/d3306d9dca5243548c813b605e1d1751)

## 31 de outubro — o FBI atribui o ataque à Coreia do Norte

O FBI responsabilizou a Coreia do Norte pelo roubo de mais de US$ 6 bilhões e identificou a atividade como **TraderTraitor**. A agência informou observar conversões dos ativos roubados principalmente para Ether, em conjunto com o Serviço Secreto e o IRS-CI. [Fonte: FBI.](https://www.fbi.gov/investigate/cyber/alerts/2026/north-korea-responsible-for-6-billion-binance-attack)

Essa é a atribuição da investigação americana.

## 3 de novembro — sai o relatório; a investigação continua

A Binance publicou suas conclusões iniciais e anunciou revisão independente. [Fonte: Binance.](https://www.binance.bh/en/blog/community/3229153443759566763)

A cronologia ganhou detalhes, mas ainda não equivale a um post-mortem definitivo. O caminho técnico pela ferramenta de IA e a avaliação independente dos controles continuam sendo pontos a acompanhar.

## Por que essa história vai além de cripto

A leitura de engenharia cabe numa pergunta: **quantas fronteiras uma credencial comprometida consegue atravessar?**

Um teste técnico, um ambiente de desenvolvimento, uma ferramenta interna e um deploy pertencem ao cotidiano de muita gente que lê este site. Vale revisar como essas partes se conectam — e em qual ponto uma operação de alto impacto exige uma aprovação independente.

Para quem participa de entrevistas, fica um cuidado concreto: executar um projeto desconhecido também é executar código de outra pessoa. Para quem lidera um time, a pergunta é maior: se uma máquina for comprometida, o que impede que o problema se espalhe?

**O teste técnico pode avaliar você. Você também precisa avaliar o que ele pede para executar.**

Conhece alguém fazendo entrevistas ou contratando devs? Este é um caso útil para discutir antes do próximo desafio de código. E, no seu time, qual é a regra para executar projetos recebidos de fora?

Essa é a análise do autor. Não é uma conclusão sobre quais controles específicos faltavam na Binance.

*Atualizado em 3 de novembro de 2026. Fontes vinculadas em cada etapa. A imagem é uma ilustração conceitual, não uma reconstrução do ataque.*
