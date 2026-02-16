---
title: How PAI Learns From You
description: How PAI captures feedback, learns from your sessions, and improves over time.
sidebar:
  order: 1
---

Most AI tools have no memory. You start a conversation, get a response, and everything is forgotten by your next session. PAI works differently. Every interaction teaches it something about how to help you better, and that knowledge persists.

## Your AI gets better over time

The first time you use PAI, it knows the basics about you from your goals and preferences. By the tenth session, it knows how you like to work. By the fiftieth, it anticipates what you need before you finish explaining it.

This is not vague "machine learning" happening in the cloud. PAI captures concrete signals from your interactions and uses them to update its own instructions, preferences, and decision-making. The improvement is tangible and specific to you.

## Two types of feedback PAI captures

PAI listens for two kinds of signals during every session.

### Explicit ratings

After any response, you can type a number from 1 to 10 to rate how well PAI did. This is the most direct signal you can give. A rating of 3 tells PAI something went wrong. A rating of 9 tells it to keep doing exactly that.

### Implicit sentiment

PAI also reads between the lines. If you respond with "this is completely wrong, I needed the opposite," PAI detects frustration and treats it as a negative signal. If you say "this is exactly what I was looking for," that enthusiasm registers as a positive signal.

You do not need to consciously give feedback for this to work. Your natural reactions during a session are already informative.

## What happens with your feedback

Your feedback does not just sit in a file somewhere. PAI acts on it through a structured process.

| Signal | What PAI does |
|--------|---------------|
| **Rating of 1-3** | Triggers a deep review of what went wrong. PAI captures the full context -- your request, its response, and what should have been different. |
| **Rating of 4-6** | Noted as an area for improvement. Patterns across multiple mid-range ratings get flagged for analysis. |
| **Rating of 7-8** | Reinforces the approach used. PAI notes what worked so it can repeat the pattern. |
| **Rating of 9-10** | Strong positive signal. The approach, format, and style are captured as examples to follow. |
| **Detected frustration** | Similar to a low rating -- PAI captures the context and flags the interaction for review. |
| **Detected excitement** | Similar to a high rating -- PAI notes the approach that produced the positive reaction. |

### Pattern analysis

PAI does not just react to individual ratings. It looks for patterns across your feedback over time. If you consistently rate research tasks highly but give lower scores to code generation, PAI identifies that gap and focuses improvement efforts where they matter most.

These patterns are analyzed periodically, and the insights feed directly into how PAI approaches future tasks.

## Your AI remembers across sessions

When you come back to PAI after a day, a week, or a month, it does not start from scratch. PAI maintains awareness of:

- **What you have been working on** -- your active projects, recent tasks, and ongoing goals
- **How you prefer to work** -- whether you like concise answers or detailed explanations, tables or prose, formal or conversational tone
- **What has gone well and what has not** -- past successes and failures inform future approaches

This is one of the biggest differences between PAI and a standard AI assistant. You never have to re-explain your preferences or remind it about ongoing work.

## Skills improve based on evidence

PAI does not just remember your preferences -- it literally updates its own instructions based on accumulated evidence. Here is how that works in practice.

If PAI notices that its research skill consistently gets lower ratings when it produces long narrative summaries instead of structured tables, it updates the research skill to prefer structured output by default. The skill evolves based on real evidence from your usage.

This happens across all of PAI's capabilities. Every skill, every workflow, every decision-making pattern is subject to improvement based on what actually works for you.

:::tip
You do not need to manage this process. PAI handles skill improvements automatically based on your accumulated feedback. You just keep using it and rating responses honestly.
:::

## Practical examples

Here are some concrete scenarios showing how PAI learns.

**Scenario 1: Rating a poor response**
You ask PAI to draft an email, and the result is too formal. You type `3 -- way too formal, I needed a casual tone for this audience`. PAI captures that the formality level was wrong, notes your preference for casual email tone, and adjusts future email drafts accordingly.

**Scenario 2: Implicit preference detection**
Over several sessions, PAI notices you always edit its bullet-point lists into tables before using them. Without you ever saying "I prefer tables," PAI starts defaulting to table format for structured information.

**Scenario 3: Skill-level improvement**
You use PAI's content creation capabilities frequently. Over three weeks, your ratings trend upward from an average of 6 to an average of 8 as PAI learns your voice, preferred structure, and level of detail.

## How to give good feedback

The quality of PAI's improvement depends on the quality of your feedback. Here are the most effective practices.

**Be specific when you rate.** Instead of just typing `4`, type `4 -- the research was good but the conclusion contradicted the evidence`. The explanation gives PAI actionable information.

**Rate consistently.** If you only rate when you are frustrated, PAI gets a skewed picture. Rate the good responses too -- a quick `8` takes one second and tells PAI what to keep doing.

**Use the full scale.** Some people default to 7 for everything. That tells PAI nothing. Use 3 when something genuinely misses the mark. Use 9 when something genuinely impresses you.

**Ratings of 1-3 trigger the deepest analysis.** If something truly fails, a low rating with an explanation is the single most valuable piece of feedback you can give. PAI performs its most thorough review on these interactions.

:::note
A 3 with an explanation is more valuable to PAI than a silent 7. The explanation gives PAI specific, actionable information about what to change.
:::

## The learning loop

PAI's improvement is not random. It follows a continuous cycle:

```
You use PAI
    |
    v
You give feedback (ratings + natural reactions)
    |
    v
PAI captures signals (explicit + implicit)
    |
    v
Patterns are analyzed across sessions
    |
    v
System improves (skills update, preferences adjust)
    |
    v
Better responses next time
    |
    v
(cycle continues)
```

Each pass through this loop makes PAI incrementally better at helping you specifically. The system you use after three months is measurably more effective than the one you started with -- not because the underlying AI model changed, but because PAI has built a detailed understanding of what works for you.

## What to read next

- [Giving Effective Feedback](/using-pai/giving-feedback/) -- detailed guide on rating responses and maximizing PAI's learning
- [Working With Skills](/using-pai/working-with-skills/) -- how PAI's specialized capabilities work and improve over time
- [Skills Catalog](/using-pai/skills-catalog/) -- the full list of built-in skills available to you
