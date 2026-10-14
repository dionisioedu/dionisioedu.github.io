---
title: "O Que Construir um Jogo de Programação em Tempo Real Me Ensinou Sobre Tempo, Estado e Confiança"
description: "Uma batalha de programação 1v1 em tempo real não é um CRUD. Estado autoritativo por WebSocket, um contador que sobrevive à aba em segundo plano, matchmaking que nunca te deixa esperando — a engenharia por trás de um jogo em que o relógio faz parte do contrato."
publishedAt: 2026-10-14
author: Dionisio
tags:
  - WebSocket
  - Tempo Real
  - Go
  - Next.js
  - Arquitetura
  - Sistemas
cover: /assets/images/code-royale.png
coverAlt: Dois jogadores conectados a um servidor Go autoritativo, com matchmaking, Elo e bots rotulados
---

<section class="ae-feature">
  <img src="/assets/images/code-royale.png" alt="Dois jogadores conectados a um servidor Go autoritativo, com matchmaking, Elo e bots rotulados" loading="eager" />
  <div class="ae-feature-copy">
    <p class="ae-kicker">Tempo Real · WebSocket · Engenharia de Jogos</p>
    <h2>Quando o relógio faz parte do contrato, "na minha máquina funciona" deixa de bastar</h2>
    <p>
      Construí um jogo de programação 1v1 em tempo real. Parecia um projetinho divertido. Virou a
      minha lição mais dura sobre estado, tempo e confiança — porque, num jogo, dois jogadores nunca
      podem discordar sobre o que acabou de acontecer.
    </p>
    <div class="ae-meta">
      <span>Estado Autoritativo</span>
      <span>Desvio do Contador</span>
      <span>Matchmaking</span>
      <span>Elo por Guerra</span>
    </div>
  </div>
</section>

A maioria dos projetos "em tempo real" que eu vejo são chats ou dashboards. São em tempo real no
sentido de que os dados acabam aparecendo. Esse é um problema tolerante: se uma mensagem chega dois
segundos atrasada, ninguém perde nada.

Um jogo competitivo não é tolerante. Dois jogadores estão olhando para duas telas, e se essas telas
discordam sobre o placar, o relógio ou de quem é a vez, o jogo está quebrado — não importa o quão
bonita seja a interface.

O Code Royale é um jogo de batalha de programação 1v1. Os dois jogadores recebem o mesmo desafio ao
mesmo tempo, respondem o mais rápido e o mais certo que conseguem, e quem enche a barra de energia
primeiro vence a rodada. As rodadas fluem até alguém atingir a pontuação-alvo, e o Elo atualiza por
tópico de programação. [O estudo de caso completo está aqui](/pt/projects/code-royale/). Este artigo
é sobre as quatro decisões de engenharia que o jogo me forçou a tomar, e o que elas generalizam.

## Decisão 1 — O servidor é dono de tudo; o cliente, de nada

O primeiro instinto quando você escreve um jogo multiplayer é deixar o cliente esperto. O cliente tem
o desafio, sabe a resposta, então deixa ele conferir e avisar o servidor. Mais rápido, certo?

Errado, e perigosamente errado. No momento em que o cliente decide o placar, você tem dois problemas:

1. **Trapaça** — qualquer um abre o devtools e envia "acertou" sem responder nada.
2. **Divergência** — dois clientes calculam estados sutilmente diferentes e se afastam sem forma de reconciliar.

Então a arquitetura é o oposto de um CRUD. O **servidor é a única fonte da verdade.** O cliente não
calcula o placar; ele renderiza o último estado que o servidor mandou e envia *intenções*:

```text
cliente -> servidor:  { type: "submit_answer", challengeId, choice }
servidor -> cliente:  { type: "answer_result", correct, scores, energy }
cliente -> servidor:  { type: "forfeit_battle" }
```

É exatamente o modelo de um servidor de jogo, e é a única decisão que separa um brinquedo de algo que
dá para colocar no ar. A partir do momento em que o servidor é dono do estado, todo o resto —
reconexão, anti-trapaça, espectador, bots — vira variação do mesmo tema, em vez de caso especial novo
a cada vez.

A parte sutil não é o socket. É o **intervalo** entre enviar uma intenção e receber a resposta. Você
mostra "acertou!" na hora, ou espera o servidor?

Para respostas de múltipla escolha, o Code Royale espera. O botão é *pessimista*. Um "acertou!" otimista
que depois é revertido é pior do que meio segundo de espera, porque o jogador aprende a desconfiar do
próprio feedback do jogo. A confiança é o produto; a latência dá para esconder, uma mentira não.

## Decisão 2 — Um contador regressivo é mais difícil do que parece

Um relógio correndo parece a coisa mais simples da tela. É onde a maioria dos apps em tempo real
quebra em silêncio.

Três modos de falha apareceram nos testes, todos visíveis para o jogador:

**Arredondamento divergente.** Se o cliente arredonda para baixo e o servidor para cima (ou vice-versa),
o número exibido oscila entre N e N−1 várias vezes por segundo. O jogador vê um número que não se
decide. A correção é chata e obrigatória: os dois lados usam o *mesmo* arredondamento, na *mesma*
direção.

**Tremor causado por ping.** Uma implementação ingênua recalcula "tempo restante" do zero a cada
mensagem do servidor. Cada ping chega alguns milissegundos fora de sincronia, então os segundos
gaguejam. A correção é parar de derivar o relógio do servidor: o cliente é dono de **um prazo
absoluto** e deriva cada segundo exibido dele, localmente.

**Estrangulamento em segundo plano.** Este é o que surpreende. Quando a aba vai para segundo plano, os
navegadores estrangulam os timers para cerca de uma vez por minuto. Seu contador congela enquanto o
jogador está fora — e o jogador volta para um relógio simplesmente errado.

O modelo que sobrevive aos três:

- o cliente guarda um prazo absoluto, calculado uma vez no início da rodada
- o segundo exibido é derivado dele a cada quadro, sem recálculo a partir dos pings
- os pings do servidor só *corrigem o desvio acumulado*, e só quando a discordância passa de um limite
- no `visibilitychange`, o cliente ressincroniza o relógio imediatamente

O resultado é um contador correto em reconexões, abas em segundo plano e desvio de relógio — porque ele
só acompanha um número, e deixa o servidor ajustar esse número em vez de substituí-lo.

## Decisão 3 — Uma fila vazia é um produto morto

Matchmaking parece problema de algoritmo. É problema de produto.

A abordagem ingênua é "ache alguém do meu nível". Se não tem ninguém, o usuário espera. Aí ele sai. Aí
a fila fica mais vazia, então o próximo espera mais, e sai também. É assim que um produto em tempo real
morre — não com um erro, mas com silêncio.

O matchmaking do Code Royale é uma fila por guerra com **janela de Elo que se alarga**:

```text
t = 0s   : bucket exato de Elo
t = 5s   : ±1 bucket
t = 10s  : ±2 buckets
t = 20s  : ilimitado
t = 30s  : gera um bot no Elo do jogador
```

Duas coisas importam aqui. Primeiro, a janela *se alarga ao longo do tempo* — uma partida um pouco
injusta é melhor do que partida nenhuma. Segundo, o **fallback de bot faz parte da funcionalidade, não
é tratamento de erro.** O motor de batalha trata um bot exatamente como um humano: mesmo caminho de
código, mesmas mensagens, mesmo timer. A única diferença é o que está do outro lado do socket.

Essa escolha de design compensa várias vezes. O bot mantém o jogo jogável às 3 da manhã com zero
usuários online, dá ao novato uma primeira partida em vez de um lobby vazio, e custa quase nada porque
reaproveita todo o caminho do humano.

A generalização: **decida de antemão quando parar de procurar e começar a jogar.** Degradar com
elegância não é um fallback que você prega depois; é um comportamento projetado, com um limite.

## Decisão 4 — Uma identidade, várias escadas

A primeira versão tinha um Elo único por jogador. Estava errado, e o motivo vale ser dito.

Uma nota única mistura habilidades sem relação. Um jogador forte em Go não recebe crédito por isso
quando entra numa batalha de SQL, e uma derrota num tópico que ele nunca estudou puxa para baixo a nota
"de verdade". O número para de significar algo, então a escada para de motivar qualquer um.

A correção é uma linha `player_war_elo` por (jogador, guerra). A mesma conta carrega uma nota diferente
em cada tópico de programação, calculada de forma independente a partir das batalhas daquele tópico.
Quais batalhas contam é determinado por participação numa tabela de junção, não por adivinhação a partir
de prefixo de ID — uma decisão pequena de schema que mantém os dados honestos.

A consequência de produto é grande: **um tópico novo é uma nova escada para subir, não um reset de tudo
o que você conquistou.** Adicionar um domínio vira convite, em vez de punição.

## O banco de desafios é um problema de correção

A lição menos glamourosa, e a mais importante para qualquer coisa movida a conteúdo.

O banco de desafios é dado. Dado pode estar errado. Três exemplos reais deste projeto:

- uma questão de múltipla escolha cujas duas melhores alternativas são ambas defensáveis
- um prompt de análise de código cuja saída esperada depende de um espaço no começo que o HTML colapsa —
  então duas respostas diferentes *renderizam idênticas* e a questão fica impossível de responder
- um desafio ligado ao tópico errado, então ele aparece onde não deveria

Nenhum desses derruba a aplicação. Sem exceção, sem log de erro. Eles só tornam o jogo injusto em
silêncio — e injustiça é a única coisa que um produto competitivo não sobrevive.

Então o banco é gerenciado como artefato de software, não como planilha:

- tipos de desafio bem definidos, com formato validado
- participação por guerra numa tabela de junção explícita
- uma passada de auditoria que confere a correção contra o gabarito real
- ferramenta de correção em massa para ajustes mecânicos, como recalcular todas as saídas esperadas de uma vez

A regra à qual eu sempre volto: **uma "resposta certa" errada é pior do que um crash.** Um crash é
barulhento e é consertado. Um gabarito errado é silencioso e corrói a confiança partida a partida.

## O que generaliza para além de um jogo

O Code Royale é um jogo, mas essas decisões não são específicas de jogo. Elas aparecem sempre que um
produto precisa concordar consigo mesmo em tempo real:

- **Onde está a fonte única da verdade do placar, e do tempo?** Se dois sistemas podem calcular o mesmo
  valor, uma hora eles vão discordar. Escolha um dono.
- **O que acontece entre uma intenção e sua confirmação?** Esse intervalo é decisão de produto, não
  detalhe de UI. Otimista parece rápido; pessimista parece honesto. Escolha de propósito.
- **Quando a fila está vazia, o produto degrada ou morre?** Silêncio é indisponibilidade. Projete o
  fallback como funcionalidade com limite, não como tratamento de erro.
- **O conteúdo está realmente correto, ou apenas presente?** Produtos movidos a conteúdo falham na
  correção, não na renderização.

Nada disso exige um motor de jogo. Exige decidir, de antemão, quais falhas são inaceitáveis — e então
projetar para que elas não possam acontecer em silêncio.

## Para onde ir agora

Se você quiser se aprofundar no código e no estudo de caso:

- o [estudo de caso completo do Code Royale](/pt/projects/code-royale/) — arquitetura, trade-offs e
  exercícios de estudo
- [Paralelismo vs. Concorrência](/pt/artigos-tecnicos/paralelismo-vs-concorrencia/) — o modelo mental
  por trás do timer e das goroutines do motor de batalha
- [Cache Affinity](/pt/artigos-tecnicos/cache-affinity/) — o modelo de custo por trás de estado de
  servidor de baixa latência, e por que onde seus dados vivem importa tanto quanto o que seu código faz

Se for para levar uma frase: num produto em tempo real, **o relógio faz parte do contrato.** Projete
para ele no momento em que projeta seu estado, ou ele vai criar as próprias regras sem você.
