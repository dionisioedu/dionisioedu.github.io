---
title: Como instalar um n8n de graça na Oracle Cloud e deixar rodando 24/7
description: Passo a passo atualizado, testado em abril de 2026, para subir um n8n no Always Free da Oracle Cloud com Docker e acesso público.
sidebar:
  label: n8n grátis na Oracle
---

<section class="ae-feature">
  <img src="/assets/images/n8n-oracle-cloud-hero.jpg" alt="Mãos digitando em um notebook sobre uma mesa minimalista" loading="eager" />
  <div class="ae-feature-copy">
    <p class="ae-kicker">Oracle Always Free</p>
    <h2>Um n8n seu, rodando o dia inteiro, sem depender de limite chato de plataforma</h2>
    <p>
      Se a ideia é começar em automação com IA sem torrar dinheiro logo de cara, esse setup ainda
      é um dos melhores atalhos que conheço. Em abril de 2026 ele continua redondo, sobe rápido e
      te entrega um ambiente real para testar webhook, Telegram, GPT, Google Sheets e o que mais
      você quiser plugar.
    </p>
    <div class="ae-meta">
      <span>n8n</span>
      <span>Oracle Cloud</span>
      <span>Docker</span>
      <span>24/7</span>
    </div>
  </div>
</section>

Se você está começando agora em automação, ou já é dev e quer um Zapier/Make ilimitado rodando na
sua própria infraestrutura sem gastar 1 real por mês, esse passo a passo é para você.

Eu mesmo uso esse tipo de stack no dia a dia. Foi com uma base parecida que montei um bot de
Telegram para converter texto em LIBRAS para o meu filho em menos de 10 minutos. A melhor parte é
simples: roda 24/7, aguenta bastante coisa no plano Always Free da Oracle e não fica te travando
por número de execuções.

## Por que Oracle Cloud + n8n vale tanto a pena

- O plano `Always Free` da Oracle ainda entrega até `4 OCPU` e `24 GB de RAM` no shape
  `Ampere A1`.
- O `n8n` é open-source, low-code e muito forte para integração com IA.
- Você ganha um ambiente de produção de verdade para testar workflow, webhook, fila, bot,
  integração com GPT, Telegram, Google Sheets e por aí vai.
- Para quem está estudando automação, backend ou IA aplicada, isso vira portfólio de verdade e
  rende papo bom em entrevista.

Na prática, em uns 20 a 30 minutos dá para deixar tudo no ar.

## 1. Crie sua conta na Oracle Cloud

Entre em `oracle.com/cloud/free`, clique em `Start for free` e siga o cadastro.

Você vai precisar:

- usar um e-mail válido
- preencher seus dados
- cadastrar um cartão de crédito ou débito para verificação

> O cartão é só para validação da conta no plano free. O objetivo aqui continua sendo usar o
> `Always Free`.

## 2. Crie a VM gratuita

No console da Oracle, vá em `Compute` -> `Instances` -> `Create Instance`.

Use algo nessa linha:

- **Nome:** `n8n-server`
- **Image:** `Ubuntu 22.04` ou `Ubuntu 24.04`
- **Shape:** `VM.Standard.A1.Flex`
- **OCPU:** `2` ou `4`
- **Memória:** `12 GB` ou `24 GB`
- **Networking:** pode deixar a VCN padrão
- **SSH Keys:** gere uma chave nova ou cole sua chave pública

Quando a VM ficar com status `Running`, guarde o `Public IP`.

> Se o shape `Ampere A1` não aparecer para você, normalmente é questão de disponibilidade da região.

## 3. Libere a porta 5678

Esse passo é importante, senão o n8n sobe mas você não acessa de fora.

No menu lateral:

`Networking` -> `Virtual Cloud Networks` -> sua VCN -> `Security Lists` -> `Default Security List`

Adicione uma regra de entrada com estes valores:

- **Stateless:** desmarcado
- **IP Protocol:** `TCP`
- **Source CIDR:** `0.0.0.0/0`
- **Destination Port Range:** `5678`

A porta `22` do SSH normalmente já vem liberada.

## 4. Entre na VM via SSH

```bash
ssh -i caminho/para/sua-chave-privada ubuntu@SEU_IP_PUBLICO
```

Se você gerou a chave no Windows com PuTTY ou outro cliente, use o formato que ele pedir. O
importante aqui é entrar como usuário `ubuntu`.

## 5. Instale Docker e Docker Compose

Rode estes comandos:

```bash
sudo apt update && sudo apt upgrade -y

sudo apt install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

sudo usermod -aG docker $USER
newgrp docker
```

Se o `newgrp docker` não surtir efeito na sua sessão, faz logout e entra de novo.

## 6. Suba o n8n com Docker Compose

Crie uma pasta para o projeto:

```bash
mkdir ~/n8n
cd ~/n8n
```

Agora crie um arquivo `docker-compose.yml` com este conteúdo:

```yaml
version: "3.8"

services:
  n8n:
    image: docker.n8n.io/n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - GENERIC_TIMEZONE=America/Sao_Paulo
      - TZ=America/Sao_Paulo
      - N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true
      - N8N_HOST=0.0.0.0
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - WEBHOOK_URL=http://SEU_IP_PUBLICO:5678/
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
```

Troque `SEU_IP_PUBLICO` pelo IP real da VM.

Depois suba o container:

```bash
docker compose up -d
```

Pronto. Se tudo correu bem, o n8n já está rodando com persistência de dados no volume `n8n_data`.

## 7. Acesse no navegador

Abra:

```text
http://SEU_IP_PUBLICO:5678
```

Na primeira vez, o n8n vai pedir para criar o usuário admin. Fez isso, acabou a instalação.

Você fica com um n8n completo, self-hosted e gratuito.

## Dica que evita dor de cabeça com webhook

Sempre configure a variável `WEBHOOK_URL` com o IP exato da sua VM ou com o domínio final, se você
tiver um.

Sem isso, uma parte dos webhooks vai falhar ou gerar URL errada.

## Quer deixar com cara de ambiente mais profissional?

Não é obrigatório agora, mas depois vale muito:

- colocar um domínio
- passar um `Nginx` na frente
- ativar `HTTPS` com `Let's Encrypt`
- ou usar `Cloudflare Tunnel` para simplificar a exposição pública

Para começar, sinceramente, `IP + porta 5678` já resolve boa parte dos casos.

## O que dá para fazer com isso hoje

- Bot no Telegram com IA respondendo automático
- Captura de lead e sincronização com Notion ou Google Sheets
- Monitoramento de preço com alerta no WhatsApp
- Relatório semanal gerado com GPT e enviado por e-mail

Foi exatamente por esse caminho que comecei a usar o n8n como parte da minha stack de Engenharia de
IA.

Se você queria um jeito barato de ter automação própria na cloud, esse aqui ainda é um dos setups
mais fortes para sair do zero sem ficar preso em plano mensal.
