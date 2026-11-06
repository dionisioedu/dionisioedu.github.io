---
title: "Jev Engineering: roteiro completo em 10 passos para dar um segundo cérebro ao seu agente de IA, do zero"
description: "Configure o Jev e crie seu primeiro agente de triagem. Aprenda a escolher ações, medir confiança e conectar IA a pesquisa, conteúdo, suporte e operações."
publishedAt: 2026-11-05
author: Dionisio
tags:
  - AI
  - Jev
  - Agentes de IA
  - Automação
cover: /assets/images/jev-switch.webp
coverAlt: Uma alavanca de latão seleciona um entre três trilhos numa mesa de desenho.
---

<section class="ae-feature">
  <img src="/assets/images/jev-switch.webp" alt="Uma alavanca de latão seleciona um entre três trilhos numa mesa de desenho." width="1400" height="732" loading="eager" fetchpriority="high" decoding="async" />
  <div class="ae-feature-copy">
    <p class="ae-kicker">Inteligência artificial · Guia prático</p>
    <h2>Quem deve cuidar da próxima mensagem?</h2>
    <p>Transforme uma decisão que você toma todo dia em uma pergunta que seu software consegue fazer e verificar.</p>
  </div>
</section>

Imagine abrir a caixa de entrada depois de publicar um tutorial. Um leitor quer saber se dá para exportar um único projeto. Outro mandou o número da conta junto com um pedido de ajuda. Um terceiro sugere um assunto para o próximo vídeo. Antes de escrever qualquer resposta, você já tomou uma decisão para cada mensagem. Onde ela vai parar?

É esse o trabalho que o Jev pode assumir como “segundo cérebro” de um agente. O modelo da TypeSafe lê o estado do sistema e responde a perguntas cujas saídas você define. O modelo de linguagem pesquisa ou redige quando a tarefa pede. O código move o item, chama uma ferramenta e confere o resultado. A ideia vem do guia de @0xCodila. Aqui vamos construir uma mesa de triagem que você consegue abrir no seu próprio computador e inspecionar, arquivo por arquivo. [Referência original](https://x.com/0xCodila/status/2100984487802708306) · [Apresentação do Jev pela TypeSafe](https://typesafe.ai/blog/introducing-system-one-models-and-jev).

## 1. Escolha uma decisão que se repete

Pegue dez mensagens recentes que chegaram pelo mesmo canal. Para cada uma, anote o primeiro destino que você daria a ela e o trecho que justificou a escolha. Se duas pessoas experientes discordarem, guarde o caso. Ele ajuda a definir quando pedir revisão.

Nosso laboratório tem três destinos. `docs` recebe perguntas respondidas pela documentação disponível. `research` recebe perguntas concretas que exigem pesquisa. `review` recebe pedidos ambíguos ou sensíveis. Você já tem o que precisa para avaliar o primeiro resultado: um conjunto de escolhas possíveis e uma expectativa escrita antes de chamar o modelo.

## 2. Faça uma escolha no Playground

Abra o Playground da TypeSafe e crie uma pergunta `Choice` com os três destinos. Use esta mensagem fictícia: “Consigo exportar só um projeto? Na tela de backup só achei a exportação do espaço inteiro.” Forneça também o trecho da documentação: “O backup inclui todos os projetos do espaço.”

Escolha sua fila antes de rodar o teste. Imagine que você é o leitor e tem cinco minutos para entregar aquele projeto. Qual trecho da documentação você aceitaria como resposta?

<details>
<summary>Comparar minha escolha com a do autor</summary>

Eu escolheria <code>research</code>. O manual explica como exportar tudo. O leitor pode já ter passado a manhã procurando como exportar uma coisa só. Mandar o mesmo trecho de volta consumiria mais uma rodada de suporte sem resolver a dúvida.

Agora acrescente ao manual uma única frase: “No menu do projeto, escolha Exportar este projeto.” Rode de novo. Minha expectativa muda para <code>docs</code>. Se a sua também mudou, você acaba de escrever, em linguagem comum, um teste de regressão para o agente.

</details>

[Experimentar no Playground](https://docs.typesafe.ai/introduction/quickstart).

## 3. Prepare o acesso e o ambiente

O Jev roda como serviço hospedado. Para seguir o exemplo, gere uma chave no console da TypeSafe, configure saldo para a API e use Python 3.10 ou superior. O AI Gateway da Vercel também oferece Jev e tem configuração própria. [Console da TypeSafe](https://console.typesafe.ai) · [Jev na Vercel](https://vercel.com/ai-gateway/models/jev).

Em uma pasta nova, escolha os comandos do seu terminal. No **PowerShell 7.1 ou posterior**:

```powershell
py -3 -m venv .venv
.\.venv\Scripts\python.exe -m pip install typesafe-sdk
$env:TYPESAFE_API_KEY = Read-Host -MaskInput "TypeSafe API key"
```

No **Bash**, em Linux, macOS ou WSL:

```bash
python3 -m venv .venv
.venv/bin/python -m pip install typesafe-sdk
read -rs -p 'TypeSafe API key: ' TYPESAFE_API_KEY
export TYPESAFE_API_KEY
```

## 4. Descreva o que você observou

Mantenha o identificador na aplicação para recuperar a mensagem. Envie ao serviço só o trecho necessário da pergunta e da documentação. Para experimentar com uma caixa de entrada real, substitua nomes, números de conta e segredos por marcadores antes da chamada. A classificação de sensibilidade acontece depois que o serviço recebe o texto. Um campo como `pesquisa_concluida = true` esconde justamente o dado que o modelo precisa julgar. Uma frase da documentação permite comparar o que foi perguntado com o que a fonte realmente cobre.

Defina a política na descrição de cada opção. Outra pessoa deve conseguir pegar o mesmo estado, ler essas descrições e entender por que aquele caso vai para pesquisa. Se nem a equipe concorda sobre o significado de “urgente”, começar ajustando a confiança vai custar algumas tardes.

## 5. Combine escolha, nota e probabilidade numa chamada

Para escolher a fila, usamos `Choice`. Para avaliar quanto detalhe o leitor forneceu, usamos `Score`, com três níveis descritos em palavras. Para detectar a presença de dados privados, usamos `Noul`, que devolve a probabilidade da afirmação. A nota de detalhe ajuda a equipe a priorizar. A probabilidade de conteúdo sensível interfere diretamente no destino. [Primitivas da TypeSafe](https://docs.typesafe.ai/introduction).

Salve como **triage.py**. O exemplo usa dados fictícios em inglês para que os leitores das duas edições possam comparar o mesmo experimento.

```python
from pathlib import Path
from typesafe_sdk import Choice, Score, Noul, TypeSafeClient

message_id = "demo-001"
state = {
    "message": "Can I export just one project? I only found a full backup.",
    "docs_excerpt": "The backup screen exports every project in the workspace.",
}

with TypeSafeClient(model="jev-latest") as client:
    result = client.system_one(state=state, questions={
        "route": Choice(
            instructions="Choose the next desk for this reader message.",
            criteria={
                "docs": "The excerpt directly answers the reader.",
                "research": "A concrete question needs more evidence.",
                "review": "The request is ambiguous or sensitive.",
            }),
        "detail": Score(
            instructions="How precisely does the reader describe the problem?",
            criteria=["No question", "Topic only", "Concrete goal and obstacle"]),
        "sensitive": Noul(
            instructions="The message includes private account information."),
    })

route = result.choices["route"]
decision = route.choice
if route.confidence < 0.85 or result.nouls["sensitive"].noul >= 0.5:
    decision = "review"

queue = Path("queue") / decision
queue.mkdir(parents=True, exist_ok=True)
artifact = queue / (message_id + ".txt")
artifact.write_text(state["message"], encoding="utf-8")
print(decision, route.confidence, result.scores["detail"].score, artifact)
```

## 6. Execute e siga a mensagem até a fila

Rode `.\.venv\Scripts\python.exe triage.py` no PowerShell ou `.venv/bin/python triage.py` no Bash. O terminal mostra a fila escolhida, a confiança da escolha, a nota de detalhe e o caminho do arquivo. Abra esse arquivo e confira a mensagem. O valor 0,85 é um ponto de partida ilustrativo para o laboratório.

Repita o teste da etapa 2 alterando `docs_excerpt`. Use outro `message_id` para cada caso. Depois, experimente um pedido vago como “me ajuda com isso?”. Compare a decisão com sua expectativa e registre as divergências. Se receber HTTP 401, confira a chave no terminal que executou o script. Um 402 indica que é preciso verificar o saldo. [Cobrança e créditos](https://help.typesafe.ai/articles/5187202169-how-much-does-jev-cost).

**Desafio de um minuto.** Suponha que o Jev sugeriu `docs` com confiança 0,94 e que `sensitive` retornou 0,61. Em que pasta você procuraria a mensagem?

<details>
<summary>Conferir o caminho do arquivo</summary>

Abra <code>queue/review/demo-001.txt</code>. Com esses valores simulados, a primeira condição do <code>if</code> é falsa, mas a segunda é verdadeira. O <code>or</code> basta para encaminhar a mensagem à revisão. Agora troque 0,61 por 0,49 no papel. O destino muda para <code>docs</code>. Esse par de casos é um bom teste para guardar quando alguém alterar a política.

</details>

A nota de detalhe vai de 0 a 2 neste exemplo e admite frações. Um resultado de 1,6 situa a mensagem entre os dois últimos níveis da rubrica. Já o limite de 0,85 se aplica à confiança da escolha de fila. Para descobrir quantas decisões acertam acima desse limite, conte os acertos em mensagens rotuladas. [Como interpretar o Score](https://docs.typesafe.ai/primitives/score).

## 7. Ligue cada fila à ferramenta certa

A pasta `queue/research` é o ponto de entrada de um pesquisador que procura outra fonte. A pasta `queue/docs` pode alimentar um redator que prepara uma resposta citando a documentação. `queue/review` abre trabalho para uma pessoa. Em um serviço real, passe o identificador e recupere a evidência original junto com a mensagem. O editor recebe o rascunho para aprovar o envio.

Em um agente de navegador, o menu muda a cada tela. Se a página oferece “filtrar”, “avançar” e “voltar”, construa uma `Choice` com essas ações, execute a selecionada e leia a tela novamente. Um agente de jogo pode fazer o mesmo com os movimentos legais em cada turno. O código que conhece o estado é quem monta o menu.

## 8. Decida como parar e como retomar

Defina limites por tarefa para chamadas, tempo e gasto. Encaminhe falhas persistentes ou decisões incertas para revisão. Se a próxima ação publica, envia, apaga ou paga, registre a aprovação de uma pessoa antes da execução.

O arquivo do laboratório serve para enxergar a decisão. Uma fila de produção precisa de uma regra adicional. Use o identificador da operação para deduplicar, salve o progresso e confira o efeito no destino antes de repetir uma ação interrompida. Se o processo cai depois de enviar um e-mail e antes de gravar “enviado”, a retomada precisa consultar o provedor ou reutilizar uma chave de idempotência aceita por ele. Só gravar o progresso depois do envio deixa essa janela aberta.

## 9. Encontre a próxima aplicação pela evidência disponível

| Fluxo | Evidência para o Jev | Decisão que vale experimentar |
| --- | --- | --- |
| E-mail e propostas comerciais | Remetente, domínio conhecido, assunto e pedido | Separar cobrança, possível phishing e patrocínio. Pedir ao redator uma resposta só para a fila selecionada. |
| YouTube e comunidades | Comentário, trecho do vídeo, perguntas anteriores sem resposta | Priorizar ajuda, sugerir uma pauta ou mandar um possível abuso à moderação. |
| Feed e mesa editorial | Post, fonte primária e novidade em relação à cobertura existente | Abrir pesquisa, preparar nota curta ou arquivar. A publicação fica com o editor. |
| Reuniões e notas de voz | Trecho transcrito, responsável e data mencionados | Distinguir compromisso, ideia e pendência. Criar uma tarefa quando houver dono verificável. |
| Cortes de vídeo | Transcrição da abertura e duração do trecho | Selecionar candidatos para o editor assistir antes de produzir título e miniatura. |
| Contratos e oportunidades | Cláusula original ou escopo, prazo e orçamento da proposta | Destacar um trecho para o especialista ou encaminhar uma oportunidade ao responsável. |
| Suporte e moderação | Mensagem, contexto e regra da comunidade | Usar uma macro, preparar uma resposta ou submeter um caso ambíguo à revisão. |
| Pesquisa de mercado em simulador | Série histórica, spread e horário da sessão | Classificar cenários para replay. Limites de exposição ficam em código determinístico. |

Na sua primeira semana, escolha uma linha para a qual você já tem exemplos e alguém capaz de dizer quando o sistema errou. Isso vale mais do que começar com cinco integrações.

## 10. Meça o custo da tarefa concluída

![Dois cartões perfurados sobrepostos permitem comparar duas decisões e localizar uma divergência.](/assets/images/jev-evidence.webp)

Rode as decisões em paralelo com a operação atual, inicialmente sem executar as ações sugeridas. Separe exemplos para ajustar o limite e outros para a avaliação final. Em 100 mensagens hipotéticas, se 80 seguiram automaticamente e 72 chegaram ao destino correto, a cobertura foi de **80%** e o acerto das decisões automáticas foi de **90%**. Examine os oito erros. Um patrocínio arquivado e uma mensagem privada enviada à fila pública têm consequências diferentes.

Na tarifa direta consultada em 5 de novembro de 2026, dez mil chamadas com mil tokens de entrada cada somam dez milhões de tokens. A US$ 0,042 por milhão e com saída gratuita, a inferência sai por **US$ 0,42**. Some o custo do redator, das ferramentas, das tentativas repetidas e do tempo de revisão. Meça também o tempo até o resultado e observe os 5% de tarefas mais lentas. [Preço oficial da TypeSafe](https://help.typesafe.ai/articles/5187202169-how-much-does-jev-cost).

Volte às dez mensagens da primeira etapa. Em quais delas você deixaria o sistema agir amanhã? Se consegue apontar a evidência, o destino e o caminho de recuperação para cada uma, já tem um primeiro fluxo que dá para operar. É aí que eu começaria o segundo.

[Read in English](/en/artigos-tecnicos/jev-engineering/)
