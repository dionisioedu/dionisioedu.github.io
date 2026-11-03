---
title: "A fake job interview on the path to Binance’s billion-dollar attack"
description: "A job opening, a coding test, and billions at stake. Follow Binance’s reported timeline, the role of permissions, and the questions still unanswered."
publishedAt: 2026-11-03
author: Dionisio
tags:
  - News
  - Security
  - Architecture
  - DevOps
cover: /assets/images/binance-permission-boundary.png
coverAlt: Editorial illustration of a laptop connected through access gates to a signing mechanism beside a key protected inside a vault
---

<section class="ae-feature">
  <img src="/assets/images/binance-permission-boundary.png" alt="A permission path connects a laptop to a signing stamp while a key remains protected inside a vault" loading="eager" width="1727" height="911" fetchpriority="high" decoding="async" />
  <div class="ae-feature-copy">
    <p class="ae-kicker">News · Security · Architecture</p>
    <h2>The assignment was code. The job was a trap.</h2>
    <p>A fake interview appears in Binance’s reconstruction of the attack. To understand its connection to billions in cryptoassets, we need to go back several months.</p>
    <div class="ae-meta"><span>November 3, 2026</span><span>Incident timeline</span><span>Investigation ongoing</span></div>
  </div>
</section>

You receive a job opportunity. Talk to a recruiter. Make it to the next round. Then comes the technical assessment: download a project and get it running.

So far, a familiar experience for developers. But this sequence is part of Binance’s account of the October 29 attack. The company pledged more than **$6.34 billion** of its own funds to cover the impact. [Sources: recruitment reconstruction](https://www.theblock.co/news/business/2026-11-03-binance-hack-incident-report-north-korea-fake-job-interview-ai-tool-432406) and [Binance’s financial statement](https://www.binance.com/en-TR/support/announcement/detail/d3306d9dca5243548c813b605e1d1751).

**How does a conversation about work enter a billion-dollar story?** The timeline below explains that connection. You do not need a crypto background to follow it.

## Before the timeline: who’s who

- **Binance:** the exchange where customers trade cryptoassets.
- **Wallet:** the mechanism used to control and move those assets.
- **Credential:** proof of access, such as a password or a token used by software.

Think of a company with several doors: entering the building, accessing the operations room, and authorizing a transfer should require different permissions. This story is about the path between those doors.

**Now, the events in order.** All times below are UTC.

The internal timeline still relies on the company’s account. Blockchain observations and the FBI’s attribution have their own sources below. A [Portuguese version](/pt/artigos-tecnicos/binance-incidente-seguranca-2026/) is available.

## June — a tampered installer opens the first front

According to Binance’s account, reported by The Block, a Wallet DevOps engineer downloaded a tampered Homebrew installation while setting up an AI coding tool. The company says it detected the issue, replaced the device, and rotated credentials. [Source: The Block, November 3.](https://www.theblock.co/news/business/2026-11-03-binance-hack-incident-report-north-korea-fake-job-interview-ai-tool-432406)

The story therefore starts before the financial transfers. Its first setting is a development environment. Homebrew installs software; the reported issue here was the tampered version that was downloaded.

## September — the job opportunity was a trap

Another engineer was approached on a legitimate job platform. Interviews with supposed company representatives led to a coding assignment. The repository downloaded onto the work computer contained malware, according to the exchange. [Source: The Block.](https://www.theblock.co/news/business/2026-11-03-binance-hack-incident-report-north-korea-fake-job-interview-ai-tool-432406)

Recruiter, interview, technical assessment: a familiar sequence for developers. Here, it delivered hostile code to an employee’s machine.

## October 20 — access spreads internally

Binance says an internal AI tool provided a bridge to other engineers and a deployment token. [Source: preliminary report.](https://www.binance.bh/en/blog/community/3229153443759566763)

The mechanism is not sufficiently detailed to establish prompt injection or a model vulnerability.

In plain terms, the account involves access to more people and permission to put software into operation. Saying “AI stole the money” skips steps the investigation still needs to explain.

## October 29, 17:15–19:56 — a container is deployed

Stolen credentials were used to deploy a container and execute a malicious script, the company says. [Source: Binance.](https://www.binance.bh/en/blog/community/3229153443759566763)

A *container* packages the environment an application needs to run. *Deployment* puts it into operation. The question here is who could use that capability — and what they could run.

## October 29, 20:05–20:09 — documented outflows begin

Five wallets sent 233.46 million XRP to an attacker address, Binance reports. [Source: Binance.](https://www.binance.bh/en/blog/community/3229153443759566763)

Chainalysis’s on-chain investigation describes movements across multiple networks. On Ethereum, it identified signed authorizations allowing a wallet to execute attacker code; other wallets made ordinary signed transfers. [Source: Chainalysis.](https://www.chainalysis.com/blog/binance-exploit-latest-findings-and-response/)

*Hot wallets* support online operations. They are central to this part of the story.

> A valid signature establishes something about cryptographic authorization. It does not, by itself, prove the business wanted the operation.

## Later on October 29 — the race to freeze assets begins

Chainalysis places the start of freezes by 5:14 p.m. Eastern Time, equivalent to **21:14 UTC** on that date. It also observed stablecoins being swapped for ETH during containment. [Source: Chainalysis.](https://www.chainalysis.com/blog/binance-exploit-latest-findings-and-response/)

The distinction matters: issuers can freeze certain tokens. That does not reverse every transfer or immediately recover all assets.

Stablecoins aim to track a reference value, often a currency such as the US dollar. ETH is Ethereum’s native asset. Swapping one for the other changes the available freezing options.

## 23:56 and 00:10 — final transfer and revocation

Binance places the final unauthorized transfer at **23:56 on October 29** and delegation removal at **00:10 on October 30**. [Source: Binance.](https://www.binance.bh/en/blog/community/3229153443759566763)

For context, [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) allows an Ethereum account to execute delegated code. Authorization can persist until changed or cleared. Closing a withdrawal interface and revoking on-chain authority are separate actions.

## October 30 — the company promises to cover losses

Binance announced it would use SAFU and its corporate treasury to absorb the impact. It said it had reserved more than **$6.34 billion** of its own funds. This is the company’s statement about financial coverage, not confirmation that all stolen money was recovered. [Source: October 30 update.](https://www.binance.com/en-TR/support/announcement/detail/d3306d9dca5243548c813b605e1d1751)

## October 31 — the FBI attributes the attack to North Korea

The FBI held North Korea responsible for stealing more than $6 billion and identified the activity as **TraderTraitor**. Alongside the Secret Service and IRS-CI, it reported observing stolen assets being converted primarily into Ether. [Source: FBI.](https://www.fbi.gov/investigate/cyber/alerts/2026/north-korea-responsible-for-6-billion-binance-attack)

That is the US investigation’s attribution.

## November 3 — the report arrives; the investigation continues

Binance published initial findings and announced independent review. [Source: Binance.](https://www.binance.bh/en/blog/community/3229153443759566763)

The timeline has more detail, but it is not a final post-mortem. The technical path through the AI tool and independent assessment of controls remain points to follow.

## Why this story reaches beyond crypto

The engineering question is short: **how many boundaries can a compromised credential cross?**

A coding assignment, a development environment, an internal tool, and a deployment are everyday elements for many readers of this site. Review how they connect — and where a high-impact operation requires independent approval.

For job candidates, there is a concrete takeaway: running an unfamiliar project means running someone else’s code. For team leaders, the question is broader: if one machine is compromised, what prevents the problem from spreading?

**The coding test evaluates you. You also need to evaluate what it asks you to run.**

Know someone interviewing or hiring developers? This is a useful case to discuss before the next coding challenge. What is your team’s rule for running projects received from outside?

That is the author’s analysis, not a finding about specific controls missing at Binance.

*Updated November 3, 2026. Sources are linked at each step. The image is a conceptual illustration, not a reconstruction of the attack.*
