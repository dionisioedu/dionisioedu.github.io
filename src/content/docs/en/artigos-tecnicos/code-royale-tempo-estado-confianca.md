---
title: "What Building a Real-Time Coding Game Taught Me About Time, State, and Trust"
description: "A 1v1 real-time coding battle is not a CRUD app. Authoritative WebSocket state, a countdown that survives background tabs, matchmaking that never leaves you waiting — the engineering behind a game where the clock is part of the contract."
publishedAt: 2026-10-14
author: Dionisio
tags:
  - WebSocket
  - Real-Time
  - Go
  - Next.js
  - Architecture
  - Systems
cover: /assets/images/code-royale.png
coverAlt: Two players connected to an authoritative Go server, with matchmaking, Elo and bots labelled
---

<section class="ae-feature">
  <img src="/assets/images/code-royale.png" alt="Two players connected to an authoritative Go server, with matchmaking, Elo and bots labelled" loading="eager" />
  <div class="ae-feature-copy">
    <p class="ae-kicker">Real-Time · WebSocket · Game Engineering</p>
    <h2>When the clock is part of the contract, "it works on my machine" stops being good enough</h2>
    <p>
      I built a 1v1 real-time coding game. It looked like a fun side project. It turned into
      the hardest lesson I have had on state, time, and trust — because in a game, two players
      must never disagree about what just happened.
    </p>
    <div class="ae-meta">
      <span>Authoritative State</span>
      <span>Countdown Drift</span>
      <span>Matchmaking</span>
      <span>Per-War Elo</span>
    </div>
  </div>
</section>

Most "real-time" projects I see are chat apps or dashboards. They are real-time in the sense that
data eventually shows up. That is a forgiving problem: if a message arrives two seconds late, nobody
loses anything.

A competitive game is not forgiving. Two players are looking at two screens, and if those screens
disagree about the score, the clock, or whose turn it is, the game is broken — no matter how pretty
the UI is.

Code Royale is a 1v1 coding battle game. Both players get the same challenge at the same time,
answer as fast and as accurately as they can, and whoever fills their energy bar first wins the
round. Rounds stream until someone hits the target score, and Elo updates per programming topic.
[You can read the full case study here](/en/projects/code-royale/). This article is about the four
engineering decisions that game forced on me, and what they generalize to.

## Decision 1 — The server owns everything; the client owns nothing

The first instinct when you write a multiplayer game is to make the client smart. The client has the
challenge, it knows the answer, so let it check the answer and tell the server. Faster, right?

Wrong, and dangerously so. The moment the client decides the score, you have two problems:

1. **Cheating** — anyone can open devtools and submit "correct" without answering.
2. **Divergence** — two clients compute subtly different states and drift apart with no way to reconcile.

So the architecture is the opposite of a CRUD app. The **server is the only source of truth.** The
client does not compute the score; it renders the last state the server sent and sends *intents*:

```text
client -> server:  { type: "submit_answer", challengeId, choice }
server -> client:  { type: "answer_result", correct, scores, energy }
client -> server:  { type: "forfeit_battle" }
```

This is exactly the model of a game server, and it is the single decision that separates a toy from
something you can ship. Once the server owns the state, everything downstream — reconnect, anti-cheat,
spectating, bots — becomes a variation on the same theme instead of a special case each time.

The subtle part is not the socket. It is the **gap** between sending an intent and hearing back. Do
you show "correct!" immediately, or wait for the server?

For multiple-choice answers, Code Royale waits. The button is *pessimistic*. An optimistic "correct!"
that later gets rolled back is worse than half a second of waiting, because the player learns to
distrust the game's own feedback. Trust is the product; latency you can hide, a lie you cannot.

## Decision 2 — A countdown is harder than it looks

A ticking clock seems like the simplest thing on the screen. It is where most real-time apps quietly
break.

Three failure modes showed up in testing, all of them visible to the player:

**Rounding mismatch.** If the client floors and the server ceils (or vice versa), the displayed number
bounces between N and N−1 several times per second. The player sees a number that can't make up its
mind. The fix is boring and mandatory: both sides use the *same* rounding, in the *same* direction.

**Ping-driven jitter.** A naive implementation recomputes "time left" from scratch on every server
message. Each ping lands a few milliseconds off, so the seconds stutter. The fix is to stop deriving
the clock from the server: the client owns **one absolute deadline** and derives every displayed
second from it locally.

**Background throttling.** This is the one that surprises people. When a tab goes to the background,
browsers throttle timers down to roughly once per minute. Your countdown freezes while the player is
away — and the player comes back to a clock that is simply wrong.

The model that survives all three:

- the client holds one absolute deadline, computed once at round start
- the displayed second is derived from it every frame, no recomputation from server pings
- server pings only *correct accumulated drift*, and only when the disagreement exceeds a threshold
- on `visibilitychange`, the client re-syncs the clock immediately

The result is a countdown that is correct across reconnects, background tabs, and clock skew — because
it only ever tracks one number, and it lets the server nudge that number instead of replacing it.

## Decision 3 — An empty queue is a dead product

Matchmaking looks like an algorithm problem. It is a product problem.

The naive approach is "find me a player at my rating." If nobody is there, the user waits. Then they
leave. Then the queue is emptier, so the next user waits longer, and leaves too. That is how a
real-time product dies — not with an error, but with silence.

Code Royale's matchmaking is a per-war queue with a **widening Elo window**:

```text
t = 0s   : exact Elo bucket
t = 5s   : ±1 bucket
t = 10s  : ±2 buckets
t = 20s  : unlimited
t = 30s  : spawn a bot at the player's Elo
```

Two things matter here. First, the window *widens over time* — a slightly unfair match beats no match.
Second, the **bot fallback is part of the feature, not an error handler.** The battle engine treats a
bot exactly like a human: same code path, same messages, same timer. The only difference is what is
on the other end of the socket.

That design choice pays off repeatedly. The bot keeps the game playable at 3 a.m. with zero users
online, it gives new players a first match instead of an empty lobby, and it costs almost nothing
because it reuses the entire human path.

The generalization: **decide up front when to stop searching and start playing.** Degrading gracefully
is not a fallback you bolt on later; it is a designed behavior with a threshold.

## Decision 4 — One identity, many ladders

The first version had a single Elo per player. It was wrong, and the reason is worth stating.

A single rating conflates unrelated skills. A player who is strong in Go gets no credit for it when
they queue for a SQL battle, and a loss in a topic they have never studied drags down their "real"
rating. The number stops meaning anything, so the ladder stops motivating anyone.

The fix is a `player_war_elo` row per (player, war). The same account carries a different rating in
each programming topic, computed independently from battles in that topic. Which battles count is
determined by membership in a junction table, not by guessing from an ID prefix — a small schema
decision that keeps the data honest.

The product consequence is large: **a new topic is a new ladder to climb, not a reset of everything
you earned.** Adding a domain becomes an invitation instead of a punishment.

## The bank of challenges is a correctness problem

The least glamorous lesson, and the most important one for anything content-driven.

The challenge bank is data. Data can be wrong. Three real examples from this project:

- a multiple-choice question whose two best answers are both defensible
- a code-analysis prompt whose expected output depends on a leading space that the HTML collapses —
  so two different answers *render identically* and the question becomes unanswerable
- a challenge attached to the wrong topic, so it shows up where it does not belong

None of these crash the app. No exception, no error log. They just quietly make the game unfair, and
unfair is the one thing a competitive product cannot survive.

So the bank is managed like a software artifact, not a spreadsheet:

- typed challenge kinds with validated shapes
- per-war membership in an explicit junction table
- an audit pass that checks correctness against the actual answer key
- bulk-fix tooling for mechanical corrections, like recomputing every expected output at once

The rule I keep coming back to: **a wrong "correct answer" is worse than a crash.** A crash is loud and
gets fixed. A wrong answer key is silent and erodes trust one match at a time.

## What generalizes beyond a game

Code Royale is a game, but these decisions are not game-specific. They show up any time a product
has to agree with itself in real time:

- **Where is the single source of truth for score, and for time?** If two systems can compute the same
  value, they will eventually disagree. Pick one owner.
- **What happens between an intent and its acknowledgement?** That gap is a product decision, not a
  UI detail. Optimistic feels fast; pessimistic feels honest. Choose deliberately.
- **When the queue is empty, does the product degrade or die?** Silence is an outage. Design the
  fallback as a feature with a threshold, not as an error handler.
- **Is the content actually correct, or merely present?** Content-driven products fail on correctness,
  not on rendering.

None of these require a game engine. They require deciding, in advance, which failures are unacceptable
— and then designing so they cannot happen silently.

## Where to go next

If you want to dig into the code and the deeper case study:

- the full [Code Royale case study](/en/projects/code-royale/) — architecture, trade-offs, and study
  exercises
- [Gamifying a Coding Game](/en/artigos-tecnicos/code-royale-gamificacao/) — the progression layer:
  streaks, XP, server-side mission payouts and the rebuilt world ranking
- [Parallelism vs. Concurrency](/en/artigos-tecnicos/paralelismo-vs-concorrencia/) — the mental model
  behind the battle engine's timer and goroutines
- [Cache Affinity](/en/artigos-tecnicos/cache-affinity/) — the cost model behind low-latency server
  state, and why where your data lives matters as much as what your code does

If there is one sentence to take away: in a real-time product, **the clock is part of the contract.**
Design for it the moment you design your state, or it will design its own rules without you.
