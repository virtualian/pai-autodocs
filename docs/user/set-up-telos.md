---
title: Set Up Your Telos
description: A guided walkthrough for first-time Telos setup — define your goals, projects, and values so PAI can work in context.
diataxis_type: tutorial
---

This tutorial walks you through setting up Telos for the first time. By the end, PAI will understand your goals, your active projects, and how you think — and every conversation will reflect that context.

## Before you start

You need PAI [installed and working](/user/install-pai/). You should have completed at least [one session](/user/first-session/) so you know how PAI responds.

## Step 1: Start with your mission

Your mission is the one-line answer to "what am I trying to accomplish?" It does not need to be grand. It needs to be honest.

Tell PAI:

```
My mission is to [your mission here].
```

**Examples:**
- "My mission is to build a profitable SaaS product while maintaining work-life balance"
- "My mission is to transition from engineering to engineering leadership"
- "My mission is to grow my consulting practice to 10 steady clients"

PAI stores this in your `TELOS/MISSION.md` file. Every future conversation happens with this context loaded.

## Step 2: Define your goals

Goals are specific things you are working toward. They should be concrete enough that you would know when you have achieved them.

```
My top goals right now are:
1. Launch the beta by April
2. Hire a senior engineer
3. Write the technical blog post series I've been putting off
```

PAI captures these in `TELOS/GOALS.md`. When you ask for help planning your week or prioritising tasks, PAI factors these goals in.

## Step 3: List your active projects

Projects are the vehicles for your goals. Each one has a status and context that PAI should know about.

```
My active projects are:
- Product beta: building the auth flow and onboarding, targeting April launch
- Hiring pipeline: two candidates in final rounds
- Blog series: outlined 5 posts, first draft in progress
```

PAI stores these in `TELOS/PROJECTS.md`. Now when you say "how's the beta going" or "what should I focus on today," PAI knows what is on your plate.

## Step 4: Share your values and beliefs

This is optional but powerful. Your beliefs shape how PAI approaches problems for you.

```
Things I believe in:
- Ship fast, iterate based on feedback
- Simplicity over cleverness
- Direct communication, no corporate fluff
- Data over opinions
```

PAI stores these in `TELOS/BELIEFS.md`. When it generates a plan or recommendation, these values influence the approach.

## Step 5: Add your mental models (optional)

If you think in terms of specific frameworks, tell PAI. This helps it structure analysis the way you would.

```
Frameworks I use:
- First principles thinking for big decisions
- Expected value calculations for investments
- Jobs-to-be-done for product decisions
```

## Step 6: Verify your Telos

Ask PAI to show you what it knows:

```
Show me my Telos dashboard
```

PAI will display a summary of your mission, goals, projects, beliefs, and any other Telos files you have populated. Review it and correct anything that is off.

## What you have now

After this setup, PAI has a structured understanding of:

- **What drives you** (mission)
- **What you are aiming for** (goals)
- **What you are working on** (projects)
- **How you think** (beliefs, models)

Every conversation from here forward happens in this context. You do not need to re-explain your situation. PAI already knows.

## Keeping Telos current

Telos is not a one-time setup. As your goals shift, projects complete, and new priorities emerge, update your Telos:

- "I finished the beta launch — update my projects"
- "Add a new goal: prepare for the Series A"
- "Remove the blog series from my projects, I'm deprioritising it"

See [Manage Your Goals](/user/manage-goals/) for ongoing Telos maintenance.

## What to read next

- [Telos: Your Goals](/user/telos/) -- understand what Telos is and why it matters
- [Manage Your Goals](/user/manage-goals/) -- ongoing goal and project management
- [Telos Reference](/user/telos-reference/) -- full reference for all 10 Telos files
