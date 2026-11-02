---
title: "Gamifying a Coding Game: Streaks, XP and a Ranking Worth Chasing"
description: "A game without progression is a demo. Here is how Code Royale earned its gamification layer — daily missions paid out server-side, a streak you can actually lose, XP that means something, and the world ranking I just rebuilt."
publishedAt: 2026-10-15
author: Dionisio
tags:
  - Game Design
  - Gamification
  - Next.js
  - Go
  - Product
  - Systems
cover: /assets/images/code-royale-gamification.png
coverAlt: A loop of battle, streak and mission chips feeding a gold rank badge, on a dark terminal grid
---

<section class="ae-feature">
  <img src="/assets/images/code-royale-gamification.png" alt="A loop of battle, streak and mission chips feeding a gold rank badge, on a dark terminal grid" loading="eager" width="1200" height="630" fetchpriority="high" decoding="async" />
  <div class="ae-feature-copy">
    <p class="ae-kicker">Game Design · Progression · Retention</p>
    <h2>A game without progression is just a demo with a scoreboard</h2>
    <p>
      Players do not come back for the code. They come back for the streak they would break,
      the mission that resets in three hours, the rank someone took from them last night.
      This is how Code Royale grew that layer — and why every reward is decided by the server.
    </p>
    <div class="ae-meta">
      <span>Daily Missions</span>
      <span>Streaks</span>
      <span>XP &amp; Levels</span>
      <span>World Ranking</span>
    </div>
  </div>
</section>

The first version of Code Royale was a fair game. Two players, one challenge, an energy bar, a winner. It did exactly what it promised, and players closed the tab the moment they lost.

That is the honest failure mode of a competitive game without progression: it is fun, it is fair, and it gives you no reason to open it tomorrow. A ladder is not decoration on top of a game. For a lot of players, it *is* the game.

So I added one. This post is about the design decisions behind it — the ones that made it work, and the ones that would have quietly broken it.

## Progression is a promise, not a number

The easy version of gamification is a counter that goes up. Play a match, get some points, watch the bar fill. It feels good for about two days.

The reason it dies is that the number is not attached to anything the player cares about. It has no stake. You cannot lose it, so it does not measure anything.

Every mechanic I added is built around a stake:

- **XP** you earn per match, win or lose, but more for a win — so effort always compounds, while winning still matters.
- **A day streak** that goes up when you play and, crucially, *resets to zero* when you do not.
- **Daily missions** with a finite window. They expire. Missing one has a cost.
- **A world ranking** where your position is held by someone else the moment you stop playing.

A number you can lose is worth defending. A number you cannot lose is just telemetry.

## Daily missions, decided by the server

The first instinct with missions is to do the maths in the browser. Player won a match, increment the counter in local state, show the mission progress, mark it complete. It is simpler, it is instant, and it is wrong.

The moment the reward is computed client-side, it is a suggestion. Anyone with a console edits the counter and pays themselves. And the failure is quiet: the UI looks correct the entire time — it is just lying.

So the payout is a server decision. The client reports what happened, and the server:

1. **Re-derives the progress itself** from the battle counters it already trusts. It does not accept a progress figure from the client.
2. **Checks whether the mission was already paid today.** A mission pays once per day, per mission — a second claim returns the same answer as the first.
3. **Credits the reward atomically**, in the same operation that records the claim.

The client is then free to be optimistic, because optimism here is safe: whatever it renders is provisional, and the server is the thing that decides. A display that guesses wrong for 200ms is a bug you can live with. A display that grants XP is not.

## The streak has to be able to break

I nearly shipped a streak that could not be lost. It counted consecutive days you played — and I had a version where missing a day simply did not increment it, rather than resetting.

That version is worthless. If the counter only goes up, the player learns within a week that the streak is a participation trophy. The thing that makes a streak sticky is the fear of losing it: a 12-day streak is not a progress bar, it is a hostage.

So the rule is unforgiving by design. Play today, the streak grows. Do not, and it goes back to zero.

What the interface owes the player in return is *fair warning*. The API exposes both the current streak and the best streak ever achieved, and the profile surfaces both — so the number you are protecting is always visible, and the number you once reached is a record you can see yourself failing to beat. A reset you did not see coming is a punishment. A reset you were watching approach is a decision you made.

## XP and levels behind the scenes

XP earns at a flat rate per match — a win pays more than a loss, but both pay — and a level is a fixed amount of XP. That is the entire system, and the simplicity is the point.

Two details matter more than the formula:

**XP is independent of rank.** Your Elo rating decides who you play; your XP decides how far you have come. If XP were derived from rating, a bad week would erase visible progress and the game would feel like it was punishing you twice for the same loss. Systems that all move together are harder to feel and easier to resent.

**Levels are slow, and that is deliberate.** A fast level curve gives you a burst of reward and then a wall. A slower one keeps the next milestone permanently in view. The number that should be moving fast is the one on the mission — the small, frequent, achievable one. The level is the long arc.

## Rebuilding the ranking

The world ranking page was the last part of the app still wearing the old design, and rebuilding it turned into the most useful UI work of the whole feature — because the first fix had nothing to do with aesthetics.

The table was genuinely misaligned. The header row and the data rows declared different grid definitions — the header carried an extra column for an avatar that was never rendered. Every column in the body was shifted relative to its own heading, and because the shift was small and uniform, it read as "this page looks off" rather than "this table is broken". Once both rows read from a single shared column definition, the layout snapped into place.

That is a general lesson about layout bugs: an alignment error you cannot point at is usually a shared constant that was duplicated instead of referenced.

The rest was design work, and the goal was integration rather than novelty. The page now speaks the same visual language as the home hero — the drifting background grid, the monospace numerals, the accent-coloured kickers — so it reads as a room in the same building instead of a page bolted on from a different site. On top of that:

- **A podium for the top three**, because a ranking's job is to make the top feel reachable and the climb feel visible.
- **Rows that reward reading**: medal tones for the top ranks, win rate tinted green above 50%, a flame on a live streak.
- **Country breakdown** with proportional bars, clickable to filter — the ranking is global, but regional pride is a much stronger motivator than global anonymity.
- **Skeleton states, not blank pages**, so a slow connection never shows an empty table that looks like an error.

## What I would tell you before you build this

Three things survived contact with real players, and they are the ones I would defend:

**Put the rules on the server and the optimism on the client.** Every reward the player cannot verify is a reward a player will eventually fake. Decide the payout where the data is authoritative; render it wherever it is fast.

**Make at least one number losable.** If nothing can go down, nothing is worth protecting, and the progression becomes noise within a week.

**Warn before you punish.** A streak reset, a mission expiring, a rank slipping — surface each one *before* it happens. The mechanic is the stake; the interface is the fairness. Get the second one wrong and the player blames you, not the rule.

Progression is not a feature you bolt on after the game is fun. In a competitive game, it is often the thing that makes it fun tomorrow.

## Keep Reading

- [What Building a Real-Time Coding Game Taught Me About Time, State, and Trust](/en/artigos-tecnicos/code-royale-tempo-estado-confianca/) — the engineering underneath this: authoritative WebSocket state, countdown drift, matchmaking.
- [Time, State and Trust in a Real-Time Game](/en/artigos-tecnicos/code-royale-tempo-estado-confianca/) — also available in [Portuguese](/pt/artigos-tecnicos/code-royale-tempo-estado-confianca/).
- [Big-O in Practice](/en/artigos-tecnicos/bigo/) — the kind of thinking the challenges are built on.
