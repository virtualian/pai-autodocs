---
title: "Telos: Your Goals and Context"
description: How PAI understands who you are, what you're working toward, and why that changes everything.
diataxis_type: explanation
---

Most AI tools know nothing about you. Every conversation starts blank. You are a stranger asking questions.

PAI is different because of Telos — a structured representation of who you are, what you care about, and what you are working toward. It is the reason PAI can be goal-oriented rather than just task-oriented.

## What Telos contains

Telos is a set of files that capture your context across ten dimensions:

| File | What it captures |
|------|-----------------|
| **Mission** | Your core purpose and what drives you |
| **Goals** | What you are actively working toward |
| **Projects** | Your active projects and their status |
| **Beliefs** | Core values and principles you hold |
| **Models** | Mental models and frameworks you use |
| **Strategies** | Approaches you prefer for solving problems |
| **Narratives** | Stories and themes that guide your thinking |
| **Learned** | Key lessons and insights you have accumulated |
| **Challenges** | Obstacles you are currently facing |
| **Ideas** | Things you are exploring or considering |

These files live in your personal PAI directory (`~/.claude/skills/PAI/USER/TELOS/`). They are yours — private, portable, and never shared.

## What this means in practice

When Telos is populated, every conversation with PAI happens in context. Here is what that looks like.

**Your goals inform suggestions.** You mention wanting to explore a new project. PAI already knows your active commitments, your timeline, and your capacity. It might flag that the new project conflicts with a deadline you set, or suggest how it fits alongside existing work.

**Your values shape responses.** If your beliefs include "simplicity over complexity" or "bias toward action," PAI factors that into how it approaches problems. You get recommendations that align with how you actually think, not generic advice.

**Your projects carry forward.** You do not re-explain what you are building. PAI knows your active projects, their status, and their dependencies. You can say "update me on the migration" and PAI knows which migration, what stage it is at, and what the next steps are.

**Your mental models get applied.** If you think in terms of specific frameworks — first principles, second-order effects, expected value — PAI applies those frameworks naturally when analyzing problems for you.

## How Telos builds over time

You can populate Telos manually by editing the files directly, or you can build it naturally through conversation. Tell PAI "my main goal this quarter is launching the new product" and it captures that in your Goals file. Mention "I believe in shipping fast and iterating" and it notes that in your Beliefs.

Over time, Telos becomes a rich representation of how you think and what you care about. Early sessions are helpful but generic. After Telos is populated, PAI feels like a collaborator who genuinely understands your context.

## Telos and the Algorithm

Telos is not separate from the Algorithm — it feeds directly into it. When the Algorithm's Observe phase reverse-engineers what you need, it does so in the context of your goals, values, and active projects. When Think selects an approach, it considers your preferred strategies and mental models.

This is what makes PAI fundamentally different from a general-purpose AI: the same question asked by two different people with different Telos contexts produces different responses, because the intent behind the question is different.

## Getting started with Telos

If you have already [installed PAI](/user/install-pai/), you can start building your Telos immediately:

- Tell PAI about your goals: *"My top priority this quarter is..."*
- Share your projects: *"I'm currently working on..."*
- Express your values: *"I believe in..."*
- Or explore what is there: *"Show me my current goals and projects"*

You can also use the Telos skill directly: *"Update my Telos"* or *"Show me my Telos dashboard."*

## What to read next

- [The Algorithm](/user/the-algorithm/) -- how Telos context feeds into PAI's problem-solving loop
- [Your AI Remembers](/user/memory/) -- how session memory complements Telos
- [Architecture](/contributor/architecture/) -- where Telos fits in the broader system
