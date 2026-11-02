---
title: Code Royale
description: 'Um estudo de caso em engenharia de produto competitivo em tempo real: batalhas autoritativas por WebSocket, Elo por guerra, bots programáveis e um banco de desafios bilíngue num monorepo Go + Next.js.'
---

# Code Royale

## O que é este projeto

**Code Royale** é um jogo de programação competitivo 1v1 em tempo real — o "Clash Royale da tecnologia."

![Interface do Code Royale](/assets/images/code-royale.png)

Dois jogadores encaram os mesmos desafios de programação ao mesmo tempo. Responda mais rápido e com mais acerto, encha sua barra de energia primeiro e vence a rodada. As rodadas são transmitidas continuamente por uma conexão WebSocket até alguém atingir a pontuação-alvo. O Elo é atualizado por "guerra" de programação, então sua nota em Go é independente da sua nota em SQL.

É um jogo, e isso torna o problema de engenharia bem mais difícil do que parece.

Jogos são implacáveis de um jeito que um CRUD não é: o estado muda a cada poucas centenas de milissegundos, dois clientes precisam concordar sobre o que aconteceu, e uma única mensagem perdida quebra a experiência. O Code Royale existe para estudar exatamente isso — como construir um produto em que *o tempo* faz parte do contrato.

## Que problema ele resolve

Aprender a programar é, na maior parte, uma atividade solitária e entediante. Ler documentação e fazer exercícios não dá loop de feedback, não coloca pressão, não dá motivo para voltar amanhã.

O Code Royale transforma a prática em partida:

- um adversário de verdade, no lugar de um exercício estático
- um relógio que obriga a decidir, no lugar de rolar a página para sempre
- uma nota que se move, então o progresso fica visível
- bots que preenchem a fila na hora, então você nunca espera sozinho

O produto responde a uma pergunta concreta: **a pressão competitiva faz as pessoas praticarem mais, e essa prática consegue se manter honesta?**

## Por que este caso é valioso para quem programa

A maioria dos projetos "em tempo real" de portfólio são chats ou dashboards — estados que toleram alguns segundos de atraso. O Code Royale é o oposto. Toda decisão de design deriva de uma única restrição: **os dois jogadores nunca podem discordar sobre o placar, o relógio ou de quem é a vez.**

Essa restrição única te empurra para um terreno genuinamente interessante:

- um **servidor autoritativo** que é dono de todo o estado, porque o cliente não é confiável
- um **modelo de relógio** que sobrevive a aba em segundo plano, reconexão e desvio de relógio
- **matchmaking** que degrada com elegância, de "ache meu par exato" até "me dê um bot em vez de me fazer esperar"
- **notas por guerra** que mantêm uma identidade única significativa em nove domínios diferentes
- um **banco de desafios** que precisa estar correto — uma "resposta certa" errada é pior do que um crash

Cada um desses é um estudo de caso por si só.

## O que estudar aqui como desenvolvedor

### 1. Estado autoritativo sobre WebSocket

O cliente nunca calcula o placar. Ele renderiza o que o servidor disse por último e envia intenções (`submit_answer`, `forfeit_battle`). É o mesmo modelo de um servidor de jogo, e é justamente o que separa um brinquedo de um produto em tempo real que dá para colocar no ar.

A parte interessante não é "usar WebSocket". É decidir **o que o servidor possui**, **o que o cliente pode prever** e **como a interface se comporta no intervalo entre enviar uma intenção e receber a resposta.** O Code Royale só trava a resposta de múltipla escolha depois que o socket confirma o envio — o botão é pessimista, não otimista, porque um "acertei!" falso que depois é revertido destrói a confiança mais rápido do que meio segundo de espera.

### 2. Um relógio que diz a verdade

Um contador regressivo parece trivial e não é. Se o cliente arredonda para cima enquanto o servidor arredonda para baixo, o número visivelmente oscila entre N e N−1 várias vezes por segundo. Se o cliente recalcula do zero a cada ping do servidor, ele treme. Se a aba vai para segundo plano, o navegador estrangula os timers para cerca de uma vez por minuto e o relógio congela.

O modelo que sobrevive aos três: o cliente é dono de **um** prazo absoluto e deriva o segundo exibido a partir dele, batendo exatamente com o arredondamento do servidor. Os pings do servidor só *corrigem o desvio acumulado*, e apenas quando discordam por mais de um segundo. E no `visibilitychange`, o cliente reposiciona o relógio na hora.

### 3. Matchmaking que nunca te deixa esperando

Uma fila vazia é um produto morto. Aqui o matchmaking é uma fila por guerra no Redis com janela de Elo que se alarga — bucket exato nos primeiros segundos, depois ±1, depois ±2, depois ilimitado — e um **fallback para bot** após 30 segundos. O mesmo caminho de código serve humano ou bot, então o motor de batalha nunca trata o adversário como caso especial.

A lição tem forma de produto, não de algoritmo: **o fallback faz parte da funcionalidade, não é tratamento de erro.** Decidir quando parar de procurar e começar a jogar é o design inteiro.

### 4. Notas por guerra, uma identidade

Um Elo global único mistura habilidades sem relação. Ser forte em Go não diz nada sobre seu SQL. O Code Royale mantém uma linha `player_war_elo` por (jogador, guerra), e a mesma conta carrega uma nota diferente em cada uma das nove guerras.

É uma decisão pequena de schema com uma consequência grande de produto: faz com que uma guerra nova seja *uma nova escada para subir*, em vez de zerar tudo o que você conquistou.

### 5. O banco de desafios como problema de correção

O banco de desafios é dado, e dado pode estar errado. Uma questão de múltipla escolha com duas alternativas plausíveis, um prompt de análise de código cuja saída esperada depende de um detalhe de espaço em branco que a interface colapsa, um desafio ligado à guerra errada — nada disso derruba a aplicação. Isso corrói a confiança em silêncio.

Tratar o banco como artefato de software — tipos de desafio bem definidos, participação por guerra numa tabela de junção, uma passada de auditoria sobre a correção, ferramenta de correção em massa para saídas esperadas — é o trabalho sem glamour que faz o jogo parecer justo.

## Arquitetura em resumo

```text
Navegador (Next.js 15 + Vercel)
  ├── REST   → api.coderoyale.site   (Go)
  └── WebSocket → wss://…/ws/battle

Backend Go (AWS, Docker)
  ├── Router HTTP (todas as rotas REST + middleware)
  ├── Hub WebSocket (em memória, por instância)
  ├── Motor de batalha (estado em memória + timer wheel)
  ├── Fila de matchmaking + convites (Redis)
  └── PostgreSQL (jogadores, batalhas, desafios,
                  guerras, Elo por guerra, votos, badges)

Frontend
  ├── Store Zustand — fonte única do estado de batalha
  ├── useBattleSocket — ciclo de vida do WS, identidade, reconexão
  └── NextAuth — OAuth GitHub + X/Twitter, além de convidados
```

O backend segue Clean Architecture: `domain → usecase → handler → repository → infrastructure`. O frontend concentra o estado de batalha numa única store Zustand e trata o banco de desafios como conteúdo de propriedade do servidor.

## O modelo mental de uma batalha

```text
Entrar / aceitar convite
        |
        v
Matchmaking (fila Redis, janela de Elo que se alarga)
        |
        v
Batalha começa — os dois recebem a mesma rodada
        |
        v
Rodada: desafio chega por WS → respostas travam na confirmação
        |
        v
Placar atualiza → barra de energia se move → próxima rodada
        |
        v
Alguém atinge o alvo → Elo atualiza por guerra → batalha salva
```

## Trade-offs interessantes

### Empolgação versus justiça

Um jogo vive de empolgação, e empolgação quer velocidade: fila rápida, rodadas rápidas, feedback vistoso. A justiça quer o contrário: relógio autoritativo, nenhuma resposta otimista, nenhum placar confiado ao cliente.

O Code Royale resolve isso fazendo o *servidor* ser a fonte da verdade e então empurrando a percepção de velocidade para o cliente — feedback visual imediato, barra de energia animada, revelação da resposta correta ao fim de cada rodada. A velocidade que o jogador sente é real; o placar em que ele confia não é dele para calcular.

### Frescor versus custo

Manter um hub WebSocket em memória é barato e simples, mas prende uma batalha a uma instância. É uma escolha deliberada: o projeto aceita o hub em memória e projeta em volta dele (aceitar convite e operações de bot precisam cair na instância que segura a conexão) em vez de partir para pub/sub antes de precisar.

### Disciplina de escopo

O jogo incluía, no começo, desafios de código executável avaliados por um runner externo. Foi desativado. O produto manteve só o que conseguia rodar de forma confiável e justa — rodadas de múltipla escolha e de análise de código. Remover uma funcionalidade que não dava para confiar foi melhoria de produto, não perda.

### Localização como recurso de primeira classe

Títulos e enunciados são traduzidos (PT-BR e ES), enquanto o código permanece em inglês. Uma batalha pode acontecer entre dois jogadores lendo idiomas diferentes. Tratar i18n como parte do estado do jogo, e não como algo pregado depois na interface, é o que torna isso possível.

## Como transformar este caso em estudo ativo

Exercícios fortes que você pode construir a partir dele:

1. modele a batalha como máquina de estados e defina exatamente o que o servidor possui
2. projete o contador de tempo para ficar correto em reconexões e abas em segundo plano
3. implemente uma janela de matchmaking que se alarga, e depois um fallback de bot
4. projete notas por guerra e explique por que um Elo único seria pior
5. escreva a regra que mantém o banco de desafios correto e a faça valer

Cada um força uma decisão sobre estado, tempo ou confiança — as três coisas das quais produtos em tempo real são feitos.

## Perguntas fortes para se fazer

- Onde está a fonte única da verdade do placar, e onde está a fonte única da verdade do tempo?
- O que acontece na interface entre uma intenção e sua confirmação?
- Quando a fila está vazia, o produto degrada ou morre?
- Dá para adicionar um novo domínio sem zerar o histórico do jogador?
- O conteúdo está correto, ou apenas presente?

## Comparações úteis

Compare este caso com:

- [SportPulse.today](/pt/projects/sportpulse/), para a pressão de *dados* em tempo real, em contraste com a de *interação*
- [Wheel Of List](/pt/projects/wheel-of-list/), para um utilitário enxuto no cliente, onde todo o estado é local e descartável

## Próximos passos

1. Reveja [Paralelismo vs. Concorrência](/pt/artigos-tecnicos/paralelismo-vs-concorrencia/) pensando no timer e no modelo de goroutines do motor de batalha.
2. Leia [Cache Affinity](/pt/artigos-tecnicos/cache-affinity/) para o modelo de custo por trás de estado de servidor de baixa latência.
3. Abra [Lógica de Programação](/pt/reference/logica-de-programacao/) se quiser raciocinar sobre a máquina de estados da batalha desde os primeiros princípios.

## Links

- Projeto ao vivo: [coderoyale.site](https://coderoyale.site)
- Código-fonte: [github.com/dionisioedu/code-royale](https://github.com/dionisioedu/code-royale)
- Voltar para [Projetos](/pt/projects/)
