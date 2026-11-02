---
title: "Gamificando um Jogo de Programação: Ofensiva, XP e um Ranking que Vale Perseguir"
description: "Um jogo sem progressão é uma demonstração. Veja como o Code Royale ganhou sua camada de gamificação — missões diárias pagas no servidor, uma ofensiva que pode acabar, XP que significa algo e o ranking mundial que acabei de reconstruir."
publishedAt: 2026-10-16
author: Dionisio
tags:
  - Game Design
  - Gamification
  - Next.js
  - Go
  - Product
  - Systems
cover: /assets/images/code-royale-gamification.png
coverAlt: Um ciclo de chips de batalha, ofensiva e missão alimentando um emblema dourado de ranking, sobre uma grade escura de terminal
---

<section class="ae-feature">
  <img src="/assets/images/code-royale-gamification.png" alt="Um ciclo de chips de batalha, ofensiva e missão alimentando um emblema dourado de ranking, sobre uma grade escura de terminal" loading="eager" width="1200" height="630" fetchpriority="high" decoding="async" />
  <div class="ae-feature-copy">
    <p class="ae-kicker">Game Design · Progressão · Retenção</p>
    <h2>Um jogo sem progressão é só uma demo com placar</h2>
    <p>
      Ninguém volta por causa do código. As pessoas voltam pela ofensiva que quebrariam,
      pela missão que reinicia em três horas, pelo ranking que alguém tomou delas ontem à noite.
      Foi assim que o Code Royale construiu essa camada — e por que toda recompensa é decidida no servidor.
    </p>
    <div class="ae-meta">
      <span>Missões Diárias</span>
      <span>Ofensiva</span>
      <span>XP e Níveis</span>
      <span>Ranking Mundial</span>
    </div>
  </div>
</section>

A primeira versão do Code Royale era um jogo justo. Dois jogadores, um desafio, uma barra de energia, um vencedor. Fazia exatamente o que prometia — e as pessoas fechavam a aba no instante em que perdiam.

Esse é o modo de falha honesto de um jogo competitivo sem progressão: é divertido, é justo, e não te dá nenhum motivo para abrir de novo amanhã. Uma escada não é decoração em cima do jogo. Para muita gente, a escada *é* o jogo.

Então construí uma. Este post é sobre as decisões de design por trás dela — as que fizeram funcionar e as que, em silêncio, teriam quebrado tudo.

## Progressão é uma promessa, não um número

A versão fácil de gamificação é um contador que sobe. Joga uma partida, ganha pontos, vê a barra encher. Parece ótimo por uns dois dias.

O que mata esse modelo é que o número não está preso a nada que o jogador se importe. Ele não tem aposta. Você não pode perdê-lo, então ele não mede nada.

Toda mecânica que adicionei gira em torno de uma aposta:

- **XP** que você ganha por partida, ganhando ou perdendo, mas mais por vitória — assim o esforço sempre acumula, e vencer continua importando.
- **Uma ofensiva de dias** que sobe quando você joga e, o ponto central, *volta a zero* quando você não joga.
- **Missões diárias** com janela finita. Elas expiram. Perder uma tem custo.
- **Um ranking mundial** onde sua posição é tomada por outra pessoa no momento em que você para de jogar.

Um número que pode cair vale a pena defender. Um número que nunca cai é só telemetria.

## Missões diárias, decididas no servidor

O primeiro instinto com missões é fazer a conta no navegador. O jogador venceu, incrementa o contador no estado local, mostra o progresso, marca como completa. É mais simples, é instantâneo — e está errado.

No momento em que a recompensa é calculada no cliente, ela vira sugestão. Qualquer um abre o console, edita o contador e paga a si mesmo. E a falha é silenciosa: a interface parece correta o tempo todo — ela só está mentindo.

Por isso o pagamento é decisão do servidor. O cliente relata o que aconteceu, e o servidor:

1. **Recalcula o progresso sozinho**, a partir dos contadores de batalha em que ele já confia. Ele não aceita o número de progresso do cliente.
2. **Verifica se a missão já foi paga hoje.** Uma missão paga uma vez por dia, por missão — uma segunda tentativa devolve a mesma resposta da primeira.
3. **Credita a recompensa de forma atômica**, na mesma operação que registra o resgate.

A partir daí o cliente pode ser otimista, porque aqui otimismo é seguro: o que ele desenha é provisório, e quem decide é o servidor. Um display que erra por 200ms é um bug tolerável. Um display que concede XP não é.

## A ofensiva precisa poder acabar

Eu quase lancei uma ofensiva impossível de perder. Ela contava os dias seguidos em que você jogou — e eu tinha uma versão em que faltar um dia simplesmente não incrementava, em vez de zerar.

Essa versão não vale nada. Se o contador só sobe, o jogador aprende em uma semana que a ofensiva é troféu de participação. O que torna a ofensiva viciante é o medo de perdê-la: uma ofensiva de 12 dias não é uma barra de progresso, é um refém.

Então a regra é dura de propósito. Jogou hoje, a ofensiva cresce. Não jogou, volta a zero.

O que a interface deve ao jogador em troca é *aviso justo*. A API expõe a ofensiva atual e a melhor ofensiva já alcançada, e o perfil mostra as duas — assim o número que você está protegendo está sempre visível, e o número que você já alcançou é um recorde que você vê a si mesmo não conseguindo bater. Um reset que você não viu chegar é um castigo. Um reset que você acompanhou chegar é uma decisão sua.

## XP e níveis nos bastidores

XP rende a uma taxa fixa por partida — vitória paga mais que derrota, mas as duas pagam — e um nível é uma quantidade fixa de XP. É o sistema inteiro, e a simplicidade é o ponto.

Dois detalhes importam mais que a fórmula:

**XP é independente do ranking.** Sua nota de Elo decide contra quem você joga; seu XP decide até onde você chegou. Se o XP derivasse do Elo, uma semana ruim apagaria progresso visível e o jogo pareceria te punir duas vezes pela mesma derrota. Sistemas que se movem todos juntos são mais difíceis de sentir e mais fáceis de ressentir.

**Níveis são lentos, e isso é de propósito.** Uma curva rápida te dá um estouro de recompensa e depois um muro. Uma curva mais lenta mantém o próximo marco sempre à vista. O número que deve se mover rápido é o da missão — o pequeno, frequente, alcançável. O nível é o arco longo.

## Reconstruindo o ranking

A página de ranking mundial era a última parte do app ainda vestindo o design antigo, e reconstruí-la virou o trabalho de UI mais útil de toda a feature — porque o primeiro conserto não tinha nada a ver com estética.

A tabela estava genuinamente desalinhada. O cabeçalho e as linhas de dados declaravam definições de grid diferentes — o cabeçalho carregava uma coluna extra para um avatar que nunca era renderizado. Cada coluna do corpo estava deslocada em relação ao próprio título, e como o deslocamento era pequeno e uniforme, lia-se como "essa página parece estranha" em vez de "essa tabela está quebrada". Quando as duas linhas passaram a ler de uma única definição de colunas compartilhada, o layout encaixou.

É uma lição geral sobre bugs de layout: um erro de alinhamento que você não consegue apontar costuma ser uma constante compartilhada que foi duplicada em vez de referenciada.

O resto foi trabalho de design, e o objetivo era integração, não novidade. A página agora fala a mesma língua visual do herói da home — a grade de fundo à deriva, os numerais monoespaçados, os kickers em cor de destaque — então ela lê como um cômodo do mesmo prédio, e não como uma página parafusada de outro site. Em cima disso:

- **Um pódio para os três primeiros**, porque o trabalho de um ranking é fazer o topo parecer alcançável e a escalada parecer visível.
- **Linhas que recompensam a leitura**: tons de medalha para os primeiros lugares, taxa de vitória tingida de verde acima de 50%, uma chama na ofensiva ativa.
- **Quebra por país** com barras proporcionais, clicáveis para filtrar — o ranking é global, mas orgulho regional motiva muito mais que anonimato global.
- **Estados de carregamento no lugar de páginas em branco**, para que uma conexão lenta nunca mostre uma tabela vazia com cara de erro.

## O que eu diria antes de você construir isso

Três coisas sobreviveram ao contato com jogadores de verdade, e são as que eu defenderia:

**Ponha as regras no servidor e o otimismo no cliente.** Toda recompensa que o jogador não consegue verificar é uma recompensa que ele vai eventualmente forjar. Decida o pagamento onde o dado é autoritativo; desenhe onde for rápido.

**Faça pelo menos um número poder cair.** Se nada pode descer, nada vale proteger, e a progressão vira ruído em uma semana.

**Avise antes de punir.** Reset de ofensiva, missão expirando, posição escorregando — mostre cada uma *antes* de acontecer. A mecânica é a aposta; a interface é a justiça. Erre a segunda e o jogador culpa você, não a regra.

Progressão não é uma feature que se parafusa depois que o jogo ficou divertido. Num jogo competitivo, ela costuma ser o que faz ele ser divertido amanhã.

## Continue Lendo

- [O que Construir um Jogo de Programação em Tempo Real me Ensinou sobre Tempo, Estado e Confiança](/pt/artigos-tecnicos/code-royale-tempo-estado-confianca/) — a engenharia por baixo disso tudo: estado autoritativo via WebSocket, deriva de contagem, matchmaking.
- [Time, State and Trust in a Real-Time Game](/en/artigos-tecnicos/code-royale-tempo-estado-confianca/) — versão em inglês do artigo acima.
- [Big-O na Prática](/pt/artigos-tecnicos/bigo/) — o tipo de raciocínio sobre o qual os desafios são construídos.
