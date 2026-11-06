---
title: "Jev Engineering: Full 10-Step Roadmap to Set Up and Use a New Brain for AI (from scratch)"
description: "Set up Jev and build your first triage agent. Learn to choose actions, measure confidence, and connect AI to research, content, support, and operations."
publishedAt: 2026-11-05
author: Dionisio
tags:
  - AI
  - Jev
  - AI Agents
  - Automation
cover: /assets/images/jev-switch.webp
coverAlt: A brass switch chooses one of three tracks on a drafting table.
---

<section class="ae-feature">
  <img src="/assets/images/jev-switch.webp" alt="A brass switch chooses one of three tracks on a drafting table." width="1400" height="732" loading="eager" fetchpriority="high" decoding="async" />
  <div class="ae-feature-copy">
    <p class="ae-kicker">Artificial intelligence · Field guide</p>
    <h2>Who should handle the next message?</h2>
    <p>Turn a decision you make every day into a question your software can ask and check.</p>
  </div>
</section>

Open your inbox after publishing a tutorial. One reader wants to export a single project. Another included an account number in a support request. A third suggests a topic for your next video. Before writing a word back, you already have a decision to make about each message. Where should it go?

That is the job Jev can take on as an agent’s second brain. TypeSafe’s model reads the current state and answers questions whose possible outputs you define. A language model researches or drafts when the task calls for it. Code moves the item, calls a tool, and checks the result. This guide builds on @0xCodila’s introduction. We’ll build a triage desk you can inspect on your own machine, one file at a time. [Original reference](https://x.com/0xCodila/status/2100984487802708306) · [TypeSafe’s introduction to Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev).

## 1. Pick a decision that keeps coming back

Take ten recent messages from the same channel. For each, write down its first destination and the passage that supports your choice. Keep cases where experienced colleagues disagree. They help define when to ask for review.

Our lab has three destinations. Use `docs` when the available documentation answers the question, `research` when a concrete question needs more evidence, and `review` for ambiguous or sensitive requests. You now have a set of possible answers and a written expectation against which to evaluate the first result.

## 2. Make your first choice in the Playground

Open TypeSafe’s Playground and create a `Choice` question with those three destinations. Try this fictional message: “Can I export just one project? I only found a full workspace backup.” Include a documentation excerpt stating that the backup includes every project in the workspace.

Pick your queue before running the test. Put yourself in the reader’s shoes. You have five minutes to deliver that project. Which sentence in the manual would you accept as an answer?

<details>
<summary>Compare my choice with the author’s</summary>

I’d choose <code>research</code>. The manual explains how to export everything. The reader may already have spent the morning looking for a way to export just one project. Sending that same passage back would cost another round of support without answering the question.

Now add one sentence to the manual: “From the project menu, choose Export this project.” Run it again. I’d now expect <code>docs</code>. If your choice changed too, you’ve just written a regression test for the agent in ordinary language.

</details>

[Try it in the Playground](https://docs.typesafe.ai/introduction/quickstart).

## 3. Set up access and a working environment

Jev runs as a hosted service. For this example, create a key in the TypeSafe console, fund your API account, and use Python 3.10 or later. Vercel AI Gateway also offers Jev through its own setup. [TypeSafe console](https://console.typesafe.ai) · [Jev on Vercel](https://vercel.com/ai-gateway/models/jev).

In a new directory, use the commands for your shell. For **PowerShell 7.1 or later**:

```powershell
py -3 -m venv .venv
.\.venv\Scripts\python.exe -m pip install typesafe-sdk
$env:TYPESAFE_API_KEY = Read-Host -MaskInput "TypeSafe API key"
```

For **Bash** on Linux, macOS, or WSL:

```bash
python3 -m venv .venv
.venv/bin/python -m pip install typesafe-sdk
read -rs -p 'TypeSafe API key: ' TYPESAFE_API_KEY
export TYPESAFE_API_KEY
```

## 4. Describe what you observed

Keep the message ID in your application for retrieval. Send the service just the necessary question and documentation excerpts. When experimenting with a real inbox, replace names, account numbers, and secrets with placeholders before the call. Sensitivity classification happens after the service receives the text. A flag such as `research_complete = true` conceals the very evidence the model needs to judge. A sentence from the documentation lets it compare what the reader asked with what the source covers.

Write the policy into each option’s description. A colleague should be able to read the same state and explain why the message goes to research. If the team disagrees on what “urgent” means, tuning a confidence threshold can easily consume an afternoon.

## 5. Ask for a choice, a score, and a probability in one call

Use `Choice` to select a queue. Use `Score` with three descriptive levels to gauge how much detail the reader supplied. Use `Noul` for the probability that the message includes private information. The detail score can help the team prioritize. The privacy answer directly affects routing. [TypeSafe primitives](https://docs.typesafe.ai/introduction).

Save the following as **triage.py**. Both editions use the same synthetic input so readers can compare their experiments.

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

## 6. Run the script and follow the message

Run `.\.venv\Scripts\python.exe triage.py` in PowerShell or `.venv/bin/python triage.py` in Bash. The terminal prints the destination, choice confidence, detail score, and file path. Open that file and check its contents. The 0.85 confidence threshold is an illustrative starting point for the lab.

Repeat the experiment from step 2 by changing `docs_excerpt`. Give each case a fresh `message_id`. Then try a vague request such as “Can you help with this?” Record where the result differs from your expected route. If you receive HTTP 401, check the key in the shell that ran the script. A 402 calls for checking your balance. [Billing and credits](https://help.typesafe.ai/articles/5187202169-how-much-does-jev-cost).

**One-minute challenge.** Suppose Jev returned `docs` with confidence 0.94 and a `sensitive` probability of 0.61. Which directory would you open?

<details>
<summary>Check the file path</summary>

Look in <code>queue/review/demo-001.txt</code>. With these simulated values the first condition in the <code>if</code> is false, but the second is true. The <code>or</code> sends the message to review. Now change 0.61 to 0.49 on paper. The destination changes to <code>docs</code>. Keep that pair of cases for the next time someone changes the policy.

</details>

The detail score ranges from 0 to 2 here and allows fractions. A value of 1.6 places the message between the last two rubric levels. The 0.85 threshold applies to confidence in the queue choice. To find out how often routes above that threshold are correct, count the matches on labeled messages. [How to read a Score](https://docs.typesafe.ai/primitives/score).

## 7. Connect each queue to its worker

The `queue/research` directory feeds a researcher who looks for another source. A writer can consume `queue/docs` to draft answers citing the documentation. A person handles `queue/review`. In a service, pass the ID and retrieve the original evidence alongside the message. The editor gets the draft for approval before delivery.

A browser agent’s menu changes on every screen. If a page offers “filter,” “next,” and “back,” build a choice from those actions, execute the selection, and read the page again. A game agent can do the same with legal moves on each turn. The code that knows the current state constructs the menu.

## 8. Decide how to stop and how to resume

Cap calls, elapsed time, and spending per task. Route persistent errors and uncertain decisions to review. When the next operation publishes, sends, deletes, or pays, record human approval before execution.

The lab’s file lets you inspect a routing decision. A production queue needs one more rule. Deduplicate on the operation ID, save progress, and check the destination before repeating an interrupted action. If a process crashes between sending an email and recording “sent,” recovery must query the provider or reuse an idempotency key the provider recognizes. A checkpoint written after delivery leaves that window open.

## 9. Choose another use case based on the evidence you have

| Workflow | Evidence to give Jev | Decision to try |
| --- | --- | --- |
| Email and inbound offers | Sender, known domain, subject, request | Separate billing, suspected phishing, and sponsorship. Draft replies only for selected queues. |
| YouTube and community posts | Comment, video excerpt, unanswered questions | Prioritize assistance, suggest a future episode, or flag abuse for moderation. |
| Social feeds and publishing | Post, primary source, novelty relative to past coverage | Open research, prepare a short note, or archive. An editor publishes. |
| Meetings and voice notes | Transcript excerpt, named owner, stated date | Identify commitments, ideas, and open questions. Create a task when ownership can be verified. |
| Video clips | Opening transcript and segment duration | Shortlist clips for an editor to watch before commissioning titles and thumbnails. |
| Contracts and leads | Original clause or proposed scope, deadline, budget | Highlight wording for specialist review or route a qualified opportunity to its owner. |
| Support and moderation | Message, thread context, applicable rule | Use a macro, draft a reply, or send an ambiguous case to a reviewer. |
| Market research in simulation | Historical series, spread, session time | Classify scenarios for replay. Keep exposure limits in deterministic code. |

For the first week, pick a row where you already have examples and someone who can identify a bad call. That gives you a better starting point than five integrations.

## 10. Measure the cost of a completed task

![Two punched cards aligned to compare decisions and locate a difference.](/assets/images/jev-evidence.webp)

Replay decisions alongside your current workflow, initially with execution disabled. Reserve separate cases for threshold tuning and final evaluation. In a hypothetical batch of 100 messages, suppose 80 went through automatically and 72 reached the right destination. That gives **80% coverage** and **90% accuracy among automatic decisions**. Inspect the eight errors. An archived sponsor offer and a private message routed to a public queue have different consequences.

At TypeSafe’s direct price checked on November 5, 2026, ten thousand requests with a thousand input tokens each total ten million tokens. At $0.042 per million with free output, that costs **$0.42 for inference**. Add writing, tools, retries, and reviewer time. Measure time to completion and examine the slowest five percent of tasks. [Official TypeSafe pricing](https://help.typesafe.ai/articles/5187202169-how-much-does-jev-cost).

Return to your ten messages. Which ones would you let the system route tomorrow? If you can point to the evidence, destination, and recovery path for each one, you have a first workflow you can operate. That’s where I’d start the next one.

[Leia em português](/pt/artigos-tecnicos/jev-engineering/)
