---
title: Code Royale
description: 'A case study in real-time competitive product engineering: authoritative WebSocket battles, per-war Elo, programmable bots, and a bilingual challenge bank on a Go + Next.js monorepo.'
---

# Code Royale

## What this project is

**Code Royale** is a real-time 1v1 competitive coding game — the "Clash Royale of technology."

![Code Royale interface](/assets/images/code-royale.png)

Two players face the same programming challenges at the same time. Answer faster and more accurately, fill your energy bar first, and win the round. Rounds stream continuously over a WebSocket connection until someone reaches the target score. Elo updates per programming "war," so your rating in Go is independent from your rating in SQL.

It is a game, which makes it a much harder engineering problem than it looks.

Games are unforgiving in a way CRUD apps are not: state changes every few hundred milliseconds, two clients must agree on what happened, and a single dropped message breaks the experience. Code Royale exists to study exactly that — how to build a product where *time itself* is part of the contract.

## What problem it solves

Learning to code is mostly solo and mostly boring. Reading docs and grinding exercises gives no feedback loop, no pressure, no reason to come back tomorrow.

Code Royale turns practice into a match:

- a real opponent instead of a static exercise
- a clock that forces a decision instead of infinite scrolling
- a rating that moves, so progress is visible
- bots that fill the queue instantly, so you never wait alone

The product is the answer to a concrete question: **can competitive pressure make people practice more, and can that practice stay honest?**

## What makes this case valuable for developers

Most "real-time" side projects are chat apps or dashboards — state that is tolerant of a few seconds of lag. Code Royale is the opposite. Every design decision is downstream of one constraint: **the two players must never disagree about the score, the clock, or whose turn it is.**

That single constraint forces you into genuinely interesting territory:

- an **authoritative server** that owns all state, because the client cannot be trusted
- a **timer model** that survives background tabs, reconnects, and clock drift
- **matchmaking** that degrades gracefully from "find my exact peer" to "give me a bot rather than make me wait"
- **per-war ratings** that keep a single identity meaningful across nine different skill domains
- a **challenge bank** that has to be correct — a wrong "correct answer" is worse than a crash

Each of those is a small case study on its own.

## What to study here as a developer

### 1. Authoritative state over WebSocket

The client never computes the score. It renders what the server last told it and sends intents (`submit_answer`, `forfeit_battle`). This is the same model as a game server, and it is the thing that separates a toy from a shippable real-time product.

The interesting part is not "use WebSocket." It is deciding **what the server owns**, **what the client may predict**, and **how the UI behaves during the gap between sending an intent and hearing back.** Code Royale locks MCQ answers only after the socket confirms the submission — the button is pessimistic, not optimistic, because a false "correct!" that later gets rolled back destroys trust faster than a half-second of waiting.

### 2. A clock that tells the truth

A countdown looks trivial and is not. If the client rounds up while the server floors, the number visibly bounces between N and N−1 several times per second. If the client recomputes from scratch on every server ping, it jitters. If the tab is backgrounded, the browser throttles timers to roughly once a minute and the clock freezes.

The model that survives all three: the client owns **one** absolute deadline and derives the displayed second from it, matching the server's rounding exactly. Server pings only *correct accumulated drift*, and only when they disagree by more than a second. And on `visibilitychange`, the client snaps the clock back into place immediately.

### 3. Matchmaking that never leaves you waiting

An empty queue is a dead product. Matchmaking here is a per-war Redis queue with a widening Elo window — exact bucket for the first few seconds, then ±1, then ±2, then unlimited — and a **bot fallback** after 30 seconds. The same code path serves a human or a bot, so the battle engine never special-cases the opponent.

The lesson is product-shaped, not algorithm-shaped: **the fallback is part of the feature, not an error handler.** Deciding when to stop searching and start playing is the whole design.

### 4. Per-war ratings, one identity

A single global Elo conflates unrelated skills. Being strong in Go says nothing about your SQL. Code Royale keeps a `player_war_elo` row per (player, war), and the same account carries a different rating in each of its nine wars.

This is a small schema decision with a large product consequence: it makes a new war a *new ladder to climb* instead of a reset of everything you earned.

### 5. A challenge bank as a correctness problem

The challenge bank is data, and data can be wrong. A multiple-choice question with two plausible answers, a code-analysis prompt whose expected output depends on a whitespace detail that the UI collapses, a challenge attached to the wrong war — none of these crash the app. They quietly erode trust.

Managing the bank like a software artifact — typed challenge kinds, per-war membership in a junction table, an audit pass over correctness, bulk-fix tooling for expected outputs — is the unglamorous work that makes the game feel fair.

## Architecture at a glance

```text
Browser (Next.js 15 + Vercel)
  ├── REST   → api.coderoyale.site   (Go)
  └── WebSocket → wss://…/ws/battle

Go backend (AWS, Docker)
  ├── HTTP router (all REST routes + middleware)
  ├── WebSocket hub (in-memory, per instance)
  ├── Battle engine (in-memory state + timer wheel)
  ├── Matchmaking queue + invites (Redis)
  └── PostgreSQL (players, battles, challenges,
                  wars, per-war Elo, votes, badges)

Frontend
  ├── Zustand store — single source of battle truth
  ├── useBattleSocket — WS lifecycle, identity, reconnection
  └── NextAuth — GitHub + X/Twitter OAuth, plus guests
```

The backend follows Clean Architecture: `domain → usecase → handler → repository → infrastructure`. The frontend keeps battle state in one Zustand store and treats the challenge bank as server-owned content.

## The mental model of a battle

```text
Join / accept invite
        |
        v
Matchmaking (Redis queue, widening Elo window)
        |
        v
Battle starts — both players get the same round
        |
        v
Round: challenge streams over WS → answers lock on confirm
        |
        v
Scores update → energy bar moves → next round
        |
        v
Someone hits the target → Elo updates per war → battle saved
```

## Interesting trade-offs

### Excitement versus fairness

A game lives on excitement, and excitement wants speed: fast queues, fast rounds, flashy feedback. Fairness wants the opposite: an authoritative clock, no optimistic answers, no client-trusted scores.

Code Royale resolves this by making the *server* the source of truth and then pushing the perception of speed to the client — instant visual feedback, an animated energy bar, a reveal of the correct answer after each round. The speed the player feels is real; the score they trust is not theirs to compute.

### Freshness versus cost

Running a WebSocket hub in memory is cheap and simple, but it pins a battle to one instance. That is a deliberate choice: the project accepts the in-memory hub and designs around it (invite acceptance and bot operations must land on the instance holding the connection) rather than reaching for pub/sub before it is needed.

### Scope discipline

The game originally included executable code challenges judged by an external runner. It was retired. The product kept only what it could run reliably and fairly — multiple-choice and code-analysis rounds. Removing a feature that could not be trusted was a product improvement, not a loss.

### Localization as a first-class feature

Titles and prompts are translated (PT-BR and ES), while code stays in English. A battle can be held between two players reading different languages. Treating i18n as part of the game state, not an afterthought bolted onto the UI, is what makes that possible.

## How to turn this case into active study

Strong exercises you can build from it:

1. model the battle as a state machine and decide exactly what the server owns
2. design the countdown so it is correct across reconnects and background tabs
3. implement a matchmaking window that widens, then a bot fallback
4. design per-war ratings and explain why a single Elo would be worse
5. write the rule that keeps the challenge bank correct, and enforce it

Each forces a decision about state, time, or trust — the three things real-time products are made of.

## Strong questions to ask yourself

- Where is the single source of truth for the score, and where is the single source of truth for time?
- What happens in the UI between an intent and its acknowledgement?
- When the queue is empty, does the product degrade or does it die?
- Can a new skill domain be added without resetting the player's history?
- Is the content correct, or merely present?

## Useful comparisons

Compare this case with:

- [SportPulse.today](/en/projects/sportpulse/), for real-time *data* pressure as opposed to real-time *interaction*
- [Wheel Of List](/en/projects/wheel-of-list/), for a lean client-side utility where all state is local and disposable

## Next actions

1. Revisit [Parallelism vs. Concurrency](/en/artigos-tecnicos/paralelismo-vs-concorrencia/) with the battle engine's timer and goroutine model in mind.
2. Read [Cache Affinity](/en/artigos-tecnicos/cache-affinity/) for the cost model behind low-latency server state.
3. Open [Programming Logic](/en/reference/logica-de-programacao/) if you want to reason about the battle state machine from first principles.

## Links

- Live project: [coderoyale.site](https://coderoyale.site)
- Source: [github.com/dionisioedu/code-royale](https://github.com/dionisioedu/code-royale)
- Back to [Projects](/en/projects/)
