# Conteúdo, distribuição e medição

## Objetivo

Transformar visitas interessadas em leitura continuada, uso dos materiais, inscrições confirmadas e contato profissional. A trilha inicial está em `/pt/reference/trilha-cpp/` e `/en/reference/trilha-cpp/`. O checklist é gratuito e não exige formulário.

Não há promessa de ganho de tráfego nem dados de audiência neste plano. A prioridade editorial deve ser revista com dados reais de Search Console e GA4.

## Próximas pautas, em ordem

| Artigo proposto (PT / EN) | Pergunta e entrega | Próxima leitura contextual |
| --- | --- | --- |
| RAII na prática: quem fecha o arquivo? / RAII in practice: who closes the file? | Um wrapper pequeno com aquisição, liberação, exceção e testes; explicar quando usar um tipo pronto | Lição de move da trilha; depois artigo dedicado abaixo |
| std::move não move sozinho / std::move does not move by itself | Instrumentar cópia e movimento; explicar `const`, retorno por valor e estado pós-move sem generalizações | Concepts e ranges da trilha |
| Concepts e ranges sem perder o tempo de vida / Concepts and ranges without dangling lifetimes | Filtro e transformação com versões corretas e um caso de view inválida analisado sem executar UB | Cache Affinity existente |
| Layout de dados: AoS e SoA medidos / Data layout: measuring AoS and SoA | Benchmark completo com entrada, checksum, hardware, flags, repetição e resultados específicos da máquina | C++ em HFT existente |
| p99 sem autoengano / Measuring p99 without fooling yourself | Carga, aquecimento, relógio, tamanho da amostra e limites de um microbenchmark; repositório reproduzível | Checklist e trilha para revisão de arquitetura |

As pautas são propostas, não páginas publicadas. Só criar links para cada novo artigo após sua URL existir. Publicar as versões PT/EN juntas, com revisão técnica e exemplos compilados na menor edição indicada. Datas de atualização devem refletir revisão real.

## Ligações e chamadas

- Artigo de versões → trilha: “Escolheu a versão? Aplique com uma sequência de ownership, ranges e performance.”
- Cache Affinity → artigo HFT: “Agora conecte o custo de memória ao orçamento de latência.”
- HFT → trilha/checklist: “Revise ownership, medições e toolchain antes da próxima otimização.”
- Newsletter em conteúdo C++: “Receba exemplos práticos de C++ e performance no seu e-mail.” / “Get practical C++ and performance examples by email.” Não prometer frequência ainda não definida.
- Download: oferecer o checklist diretamente. A inscrição é opcional e separada; clique no download não significa inscrição.

Usar URLs internas sem UTM: atribuição de campanhas deve identificar entrada externa, não navegação dentro do site.

## Distribuição preparada para publicação manual

Cada publicação externa exige revisão e autorização do responsável. Este plano não envia mensagens nem cria posts.

Convenção: valores minúsculos; `utm_source` identifica plataforma; `utm_medium=social` para LinkedIn/X e `video` para YouTube; `utm_campaign=cpp_learning_path`; `utm_content` combina idioma e formato. Não incluir nomes, e-mails ou outros dados pessoais nos parâmetros.

| Canal | Abordagem | Link de exemplo |
| --- | --- | --- |
| LinkedIn | Trecho de código e pergunta “Quem possui esse recurso?”, seguido da tarefa RAII | https://dionisio.dev/pt/reference/trilha-cpp/?utm_source=linkedin&utm_medium=social&utm_campaign=cpp_learning_path&utm_content=pt_raii_example |
| X | Exemplo curto mostrando que copiar `unique_ptr` falha e mover transfere ownership | https://dionisio.dev/en/reference/trilha-cpp/?utm_source=x&utm_medium=social&utm_campaign=cpp_learning_path&utm_content=en_move_example |
| YouTube | Demonstração de compilação dos três exemplos e checklist na descrição | https://dionisio.dev/pt/reference/trilha-cpp/?utm_source=youtube&utm_medium=video&utm_campaign=cpp_learning_path&utm_content=pt_walkthrough |

Preparar uma publicação por assunto, com destino correspondente e idioma consistente. Não distribuir o mesmo resumo genérico em todos os canais. Links com UTM devem continuar resolvendo para uma canonical limpa.

## Linha de base e acompanhamento

1. Registrar a data do deploy e validar eventos reais no DebugView/Tempo real. A presença de JavaScript não prova recebimento no GA4.
2. Confirmar propriedade e acesso ao Search Console e enviar o sitemap existente. Acesso, verificação por DNS e configuração da propriedade exigem o responsável da conta quando indisponíveis nesta sessão.
3. Coletar 28 dias completos após a instrumentação validada. Se houver 28 dias anteriores comparáveis, guardar a comparação; eventos novos não têm histórico retroativo.
4. Separar idioma pelo caminho `/pt/` ou `/en/`, artigo pela URL canônica, e aquisição por origem/mídia/campanha. Excluir testes internos usando a configuração da propriedade, quando apropriado.
5. Comparar com os 28 dias completos seguintes, anotando publicações, campanhas e mudanças de instrumentação. Poucas visitas exigem mais tempo antes de concluir.

| Pergunta | Medida e cuidado |
| --- | --- |
| O conteúdo aparece nas buscas certas? | Search Console: impressões, cliques, CTR e consultas por página/idioma; separar posição, dispositivo e marca quando útil |
| O leitor continua? | Sessões com clique em próxima leitura / sessões elegíveis nas páginas com essa chamada; não confundir cliques com páginas efetivamente carregadas |
| O material é útil o bastante para levar? | Sessões com clique de download / sessões na trilha; o evento comprova a interação, não a leitura do arquivo |
| A newsletter converte? | Inscrições confirmadas pelo fluxo do provedor / sessões elegíveis; cliques no botão separados de sucesso e de double opt-in quando houver |
| Há intenção profissional? | Cliques em contato e produtos por sessão elegível; saída para checkout não é venda |
| A experiência mobile melhorou? | Core Web Vitals por URL/dispositivo quando houver dados de campo; laboratório com condições fixas e várias execuções como diagnóstico |

Percentuais devem declarar o denominador e os números absolutos. Eventos perdidos por bloqueadores ou consentimento limitam a cobertura. Não enviar texto de busca livre, e-mail ou conteúdo dos formulários ao Analytics.

## Critério para a próxima rodada

- Muitas impressões e CTR baixo: conferir intenção da consulta, título e descrição, sem prometer resultado ausente no artigo.
- Entradas orgânicas com pouca continuidade: ajustar a próxima leitura ao problema daquele artigo.
- Cliques de newsletter sem sucesso verificável: investigar o fluxo antes de mudar a chamada.
- Baixo volume: ampliar a janela, conversar com leitores e manter mudanças pequenas; não declarar vencedor sem evidência.
- Mobile lento: identificar o elemento LCP e o custo de scripts de terceiros antes de alterar imagens, anúncios ou embeds.
