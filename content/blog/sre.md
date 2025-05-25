---
title: O Que é SRE?
description: A Arte de Manter Sistemas em Pé Quando Tudo Quer Cair
author: Edu Dionisio
tags: [sre, reliability, carreira]
---
Se você é dev e nunca ouviu falar de **Site Reliability Engineering**, ou já ouviu mas acha que é só mais um termo da moda, chegou a hora de entender o que está por trás dessa sigla que virou um pilar das grandes empresas de tecnologia.

Imagine isso:
Você trabalha em uma fintech que lida com bilhões de reais por dia. Tudo parece bem... até que, de repente, a API de pagamentos cai. O time de Dev está dormindo, o de Ops está apagando incêndios às cegas, e o CEO está gritando no Slack.
Quem entra em cena?

O SRE.

## O que é SRE?

**Site Reliability Engineering** (SRE) é uma disciplina de engenharia de software aplicada à **infraestrutura e operações**. \
Criado pelo Google nos anos 2000, o objetivo do SRE é **aumentar a confiabilidade de sistemas complexos** usando **automação, métricas, engenharia de software e pensamento sistêmico**.

SRE é a ponte entre **desenvolvimento e operação**. Mas não é "DevOps". DevOps é a filosofia. SRE é a **implementação prática**.

## Por que SRE é tão importante?

Porque sistemas grandes falham. E falham de maneiras que você nem imagina.

O SRE nasce da premissa de que **falhas são inevitáveis**, mas o caos não precisa ser. \
Se o seu sistema é crítico, global, e está crescendo, você precisa tratar confiabilidade como uma feature.

> “Hope is not a strategy.” – dita famosa no SRE handbook do Google.

## Os Fundamentos de SRE

Vamos direto aos conceitos que você precisa dominar:

### 1. SLI (Service Level Indicator)
É uma **métrica real** que mede a performance de um serviço. \
Exemplo: porcentagem de requisições HTTP 200 nos últimos 30 dias.

```
SLI = requests OK / total requests
```

### 2. SLO (Service Level Objective)
É o **alvo que você quer atingir** com o SLI. \
Exemplo: 99.9% das requisições devem ser bem-sucedidas.

Isso define o que é "bom o suficiente". E o que não for, vira dívida de confiabilidade.

### 3. SLA (Service Level Agreement)
É o que você promete para o cliente, com possíveis penalidades. \
**SLA = contrato, SLO = objetivo interno, SLI = métrica real.**

### 4. Error Budget
Essa é a parte mais linda do SRE. \
Se seu SLO é 99.9%, então **0.1% de falhas é aceitável**. Esse 0.1% é seu orçamento de erro. \
Você pode usá-lo para inovar, lançar features arriscadas, fazer deploys ousados. \
**Mas se o erro estoura o budget, os lançamentos são congelados.** \
Simples. Rígido. Justo.

## As Práticas do SRE
Aqui começa a engenharia de verdade. O SRE vive em três mundos ao mesmo tempo:

### 🛠️ 1. Engenharia de Software
* Automatização de tarefas (scripts, bots, ferramentas)
* Desenvolvimento de pipelines de CI/CD
* Integração com observabilidade (Prometheus, Grafana, ELK)
* Resiliência por design (circuit breakers, retries, backoff)

### 🔥 2. Gerenciamento de Incidentes
* Detecção (alertas, logs, health checks)
* Resposta rápida (playbooks, escalonamento)
* Post-mortems sem culpados (blameless)
* Correções com foco na causa raiz

### 📊 3. Observabilidade
* Métricas: para saber "quanto"
* Logs: para saber "o que"
* Traces: para saber "onde"
* Dashboards: para ver "como está agora"

## Exemplos Práticos de Atuação SRE
### ☁️ No Cloud
* Definir a arquitetura de alta disponibilidade
* Monitorar instâncias com auto-scaling e failover
* Otimizar custos via right-sizing e spot instances

### 🧪 Em Testes
* Testes de carga e estresse
* Chaos Engineering (Netflix: Chaos Monkey)
* Testes automatizados de rollback e deploys canary

### 🔐 Em Segurança
* Monitorar tráfego anômalo
* Automatizar regras de firewall
* Implementar rate limits e circuit breakers

## Como ser um bom SRE?
Você precisa:
* **Pensar como engenheiro e agir como bombeiro**
* **Automatizar tudo que for manual**
* **Ler logs como quem lê poesia**
* **Não entrar em pânico (mesmo com o CEO no telefone)** \
E claro:
> “Ser SRE é ser a última linha de defesa entre o caos e o sistema funcionando.”

## Ferramentas Comuns
* **Prometheus + Grafana** – métricas e dashboards
* **ELK (Elasticsearch, Logstash, Kibana)** – logs estruturados
* **PagerDuty, OpsGenie** – gerenciamento de incidentes
* **Terraform, Ansible, Helm** – IaC (Infrastructure as Code)
* **Kubernetes** – orquestração moderna (com seus próprios dragões)
* **Sentry, Datadog, New Relic** – APMs e monitoramento profundo

## Conclusão: SRE é o novo DevOps?
Não. É a evolução. \
DevOps uniu Dev e Ops com uma filosofia de colaboração. \
**SRE entrega isso na prática com engenharia, métrica e automação.** \
Se você está cansado de apagar incêndio sem saber a causa… \
Se sua aplicação quebra e ninguém entende por quê… \
Se você quer escalar sem perder noites de sono… \
> Você precisa de um SRE. Ou virar um.

Se curtiu esse artigo, compartilha. Se discordou, me chama pra conversar. E se quer aprender mais: cola aqui.