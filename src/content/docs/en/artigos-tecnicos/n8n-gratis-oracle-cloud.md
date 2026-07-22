---
title: How to Install n8n Free on Oracle Cloud and Keep It Running 24/7
description: Updated step-by-step guide, tested in July 2026, to deploy n8n on Oracle Cloud Always Free with Docker and public access
publishedAt: 2026-04-16
author: Dionisio
tags:
  - Automation
  - n8n
  - Oracle Cloud
  - Docker
cover: /assets/images/n8n-oracle-cloud-hero.jpg
coverAlt: Laptop on a minimalist desk illustrating an n8n Oracle Cloud setup
sidebar:
  label: n8n Free on Oracle
---

<section class="ae-feature">
  <img src="/assets/images/n8n-oracle-cloud-hero.jpg" alt="Hands typing on a laptop over a minimalist desk" loading="eager" />
  <div class="ae-feature-copy">
    <p class="ae-kicker">Oracle Always Free</p>
    <h2>Your own n8n, running around the clock, without being stuck on platform limits</h2>
    <p>
      If the goal is getting started with AI automation without burning cash right away, this setup
      is still one of the best shortcuts I know. As of July 2026 it's still solid, comes up fast,
      and gives you a real environment to test webhooks, Telegram, GPT, Google Sheets, and
      whatever else you want to plug in.
    </p>
    <div class="ae-meta">
      <span>n8n</span>
      <span>Oracle Cloud</span>
      <span>Docker</span>
      <span>24/7</span>
    </div>
  </div>
</section>

If you're just getting started with automation, or you're already a dev and want an unlimited
Zapier/Make running on your own infrastructure without spending a single dollar a month, this
step-by-step guide is for you.

I use this type of stack daily. It was with a similar foundation that I built a Telegram bot to
convert text to LIBRAS (Brazilian Sign Language) for my son in under 10 minutes. The best part is
simple: it runs 24/7, handles a fair amount on Oracle's Always Free tier, and doesn't lock you
behind execution limits.

## Why Oracle Cloud + n8n Is Such a Great Deal

- Oracle's `Always Free` tier still delivers up to `4 OCPU` and `24 GB RAM` in the `Ampere A1`
  shape.
- `n8n` is open-source, low-code, and very strong for AI integrations.
- You get a real production environment to test workflows, webhooks, queues, bots, integrations
  with GPT, Telegram, Google Sheets, and beyond.
- For anyone studying automation, backend, or applied AI, this becomes a real portfolio piece and
  great interview material.

In practice, you can have everything running in about 20 to 30 minutes.

## 1. Create Your Oracle Cloud Account

Go to `oracle.com/cloud/free`, click `Start for free`, and follow the sign-up.

You'll need:

- a valid email
- to fill in your details
- to register a credit or debit card for verification

> The card is only for account validation on the free tier. The goal here remains using the
> `Always Free` plan.

## 2. Create the Free VM

In the Oracle console, go to `Compute` -> `Instances` -> `Create Instance`.

Use something along these lines:

- **Name:** `n8n-server`
- **Image:** `Ubuntu 22.04` or `Ubuntu 24.04`
- **Shape:** `VM.Standard.A1.Flex`
- **OCPU:** `2` or `4`
- **Memory:** `12 GB` or `24 GB`
- **Networking:** leave the default VCN
- **SSH Keys:** generate a new key or paste your public key

Once the VM status shows `Running`, save the `Public IP`.

> If the `Ampere A1` shape doesn't appear for you, it's usually a region availability issue.

## 3. Open Port 5678

This step matters — without it, n8n runs but you can't access it externally.

In the side menu:

`Networking` -> `Virtual Cloud Networks` -> your VCN -> `Security Lists` -> `Default Security List`

Add an ingress rule with these values:

- **Stateless:** unchecked
- **IP Protocol:** `TCP`
- **Source CIDR:** `0.0.0.0/0`
- **Destination Port Range:** `5678`

SSH port `22` is usually already open by default.

## 4. SSH Into the VM

```bash
ssh -i path/to/your-private-key ubuntu@YOUR_PUBLIC_IP
```

If you generated the key on Windows with PuTTY or another client, use the format it expects. The
key here is logging in as the `ubuntu` user.

## 5. Install Docker and Docker Compose

Run these commands:

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

If `newgrp docker` doesn't take effect in your session, log out and back in.

## 6. Deploy n8n with Docker Compose

Create a project folder:

```bash
mkdir ~/n8n
cd ~/n8n
```

Now create a `docker-compose.yml` file with this content:

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
      - WEBHOOK_URL=http://YOUR_PUBLIC_IP:5678/
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
```

Replace `YOUR_PUBLIC_IP` with the VM's actual IP.

Then bring up the container:

```bash
docker compose up -d
```

Done. If everything went well, n8n is running with data persistence on the `n8n_data` volume.

## 7. Access It in Your Browser

Open:

```text
http://YOUR_PUBLIC_IP:5678
```

On the first visit, n8n will ask you to create an admin user. Once that's done, installation is
complete.

You now have a full, self-hosted, free n8n instance.

## Webhook Headache-Saving Tip

Always configure the `WEBHOOK_URL` variable with your VM's exact IP or with your final domain, if
you have one.

Without this, some webhooks will fail or generate incorrect URLs.

## Want It to Look More Professional?

Not required right now, but worth it later:

- add a domain
- put `Nginx` in front
- enable `HTTPS` with `Let's Encrypt`
- or use `Cloudflare Tunnel` to simplify public exposure

To get started, honestly, `IP + port 5678` already covers most use cases.

## What You Can Do With This Today

- Telegram bot with AI auto-responding
- Lead capture synced with Notion or Google Sheets
- Price monitoring with WhatsApp alerts
- Weekly report generated with GPT and sent via email

This is exactly the path I took to start using n8n as part of my AI Engineering stack.

If you wanted a cheap way to have your own automation in the cloud, this is still one of the
strongest setups to go from zero without getting locked into a monthly plan.
