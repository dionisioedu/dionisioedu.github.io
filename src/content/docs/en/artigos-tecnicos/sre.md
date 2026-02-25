---
title: What is SRE? Site Reliability Engineering
description: Understand Site Reliability Engineering and how to implement reliability in critical systems
---

If you're a developer and have never heard of **Site Reliability Engineering**, or heard of it but think it's just another buzzword, it's time to understand what lies behind this acronym that became a pillar of big tech companies.

## The Classic Story

Imagine this: You work at a fintech dealing with billions of reais per day. Everything seems fine… until suddenly, the payments API crashes.

- The Dev team is sleeping
- The Ops team is fighting fires in the dark
- The CEO is yelling on Slack

**Who enters the scene? The SRE.**

## What is SRE?

Site Reliability Engineering (SRE) is a **discipline of software engineering applied to infrastructure and operations**.

Created by Google in the 2000s, the goal of SRE is to **increase the reliability of complex systems using**:
- Automation
- Metrics
- Software engineering
- Systems thinking

**SRE is the bridge between development and operations.** But it's not "DevOps".

> DevOps is the **philosophy**. SRE is the **practical implementation**.

## Why is SRE so important?

Because **large systems fail. And they fail in ways you can't even imagine.**

SRE is born from the premise that **failures are inevitable, but chaos doesn't have to be**.

If your system is critical, global, and growing, you need to treat reliability as a feature, not an extra.

> "Hope is not a strategy." – Famous quote from Google's SRE handbook

## The Fundamentals of SRE

Here are the concepts you NEED to master:

### 1. SLI (Service Level Indicator)

It's a **real metric that measures the performance of a service**.

Example: percentage of successful HTTP 200 requests in the last 30 days.

```
SLI = successful requests / total requests
```

### 2. SLO (Service Level Objective)

It's the **target you want to achieve with the SLI**.

Example: 99.9% of requests should be successful.

This defines what is "good enough". Anything else becomes a reliability debt.

### 3. SLA (Service Level Agreement)

It's what you **promise to the customer**, with possible penalties.

**SLA** = contract
**SLO** = internal objective
**SLI** = real metric

### 4. Error Budget (The SRE Treasure)

This is the most beautiful part of SRE.

If your SLO is **99.9%**, then **0.1% failures are acceptable**. That 0.1% is your **error budget**.

You can use it for:
- Innovating
- Launching risky features
- Making bold deployments

**But if the error exceeds the budget, launches are frozen.**

Simple. Rigid. Fair.

## SRE Practices

Here's where real engineering begins. The SRE lives in three worlds at once:

### 🛠️ Software Engineering

- Automation of tasks (scripts, bots, tools)
- Development of CI/CD pipelines
- Integration with observability (Prometheus, Grafana, ELK)
- Resilience by design (circuit breakers, retries, backoff)

### 🔥 Incident Management

- Detection (alerts, logs, health checks)
- Quick response (playbooks, escalation)
- Blameless post-mortems
- Root cause focused corrections

### 📊 Observability

The observability triad:

- **Metrics**: to know "how much"
- **Logs**: to know "what"
- **Traces**: to know "where"
- **Dashboards**: to see "how is it now"

## Practical Examples of SRE Work

### ☁️ In the Cloud

- Define high availability architecture
- Monitor instances with auto-scaling and failover
- Optimize costs via right-sizing and spot instances

### 🧪 In Testing

- Load and stress testing
- Chaos Engineering (Netflix: Chaos Monkey)
- Automated rollback and canary deployment tests

### 🔐 In Security

- Monitor anomalous traffic
- Automate firewall rules
- Implement rate limits and circuit breakers

## How to be a Good SRE?

You need to:

- **Think like an engineer and act like a firefighter**
- Automate everything that's manual
- **Read logs like you read poetry**
- Don't panic (even with the CEO on the phone)

> "Being SRE is being the last line of defense between chaos and a working system."

## Common Tools in the SRE Ecosystem

- **Prometheus + Grafana** – metrics and dashboards
- **ELK** (Elasticsearch, Logstash, Kibana) – structured logs
- **PagerDuty, OpsGenie** – incident management
- **Terraform, Ansible, Helm** – IaC (Infrastructure as Code)
- **Kubernetes** – modern orchestration (with its own dragons 🐉)
- **Sentry, Datadog, New Relic** – APMs and deep monitoring

## Is SRE the new DevOps?

No. It's the evolution.

**DevOps** united Dev and Ops with a collaboration philosophy.

**SRE** delivers that in practice with engineering, metrics, and automation.

If you are:
- Tired of fighting fires without knowing the cause?
- Watching your application break without understanding why?
- Wanting to scale without losing sleep?

**You need an SRE. Or become one.**

If you liked this article, share it. If you disagreed, hit me up to chat.
