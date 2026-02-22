---
title: Giving Effective Feedback
description: How to rate responses and provide feedback that makes your AI better over time.
diataxis_type: how-to
---

Your feedback is the fuel that powers PAI's self-improvement. Without it, PAI is a capable AI assistant. With it, PAI becomes an AI assistant that is specifically tuned to how you think, what you value, and how you work.

This guide covers how to give feedback that makes the biggest difference.

## Why your feedback matters

PAI captures two things from every interaction: what it did, and how well it worked. The "what it did" part is automatic. The "how well it worked" part depends on you.

When you rate a response, you are not just expressing satisfaction. You are providing a training signal that PAI uses to adjust its approach for future tasks. Low ratings trigger deep analysis of what went wrong. High ratings reinforce successful patterns. Over time, your accumulated ratings create a detailed map of what works and what does not -- specific to you.

Without feedback, PAI has to guess whether its approach is working. With feedback, it knows.

## How to rate a response

After any PAI response, type a number from 1 to 10 as your next message. That is all it takes.

```
You: Summarize this article for me
PAI: [provides summary]
You: 8
```

PAI registers the rating and moves on. No confirmation dialog, no follow-up questions. One number, one second.

## What each rating means

Use this scale consistently so PAI can interpret your feedback accurately.

| Rating | Meaning | What PAI does with it |
|--------|---------|----------------------|
| **9-10** | Exceptional. Exceeded your expectations. | Captures the approach as a strong positive example. Notes the format, depth, style, and reasoning for reuse. |
| **7-8** | Good. Met your expectations. Solid work. | Reinforces the general approach. Minor patterns noted but no corrective action taken. |
| **5-6** | Adequate. Got the job done but could be better. | Flagged for improvement. If multiple 5-6 ratings cluster around a skill or task type, PAI investigates why. |
| **3-4** | Below expectations. Missed the point or approach was wrong. | Triggers a detailed review. PAI captures what you asked for versus what it delivered and identifies the gap. |
| **1-2** | Serious failure. Fundamentally wrong approach or output. | Triggers the deepest analysis. PAI performs a full review of the interaction -- your request, its reasoning, and where things went wrong -- to prevent similar failures. |

:::note
You do not need to rate every single response. But the more consistently you rate, the faster PAI adapts to your preferences. Think of it like training -- irregular sessions still help, but consistent practice produces faster results.
:::

## Adding context to your ratings

A number alone is useful. A number with an explanation is significantly more valuable.

Compare these two pieces of feedback:

| Feedback | Value to PAI |
|----------|-------------|
| `7` | PAI knows the response was good. That is about it. |
| `7 -- good analysis but the table was missing a comparison column for cost` | PAI knows the response was good AND learns that you expected a cost comparison. Next time, it includes cost analysis by default. |

The pattern is simple: **rating -- explanation**. The dash separator is not required, but it reads cleanly.

Here are more examples of feedback with context:

- `3 -- completely wrong format, I needed bullet points not a narrative essay`
- `9 -- perfect level of detail, exactly the depth I needed`
- `5 -- the research was fine but you missed the most recent data from 2025`
- `4 -- too much jargon, this was supposed to be for a non-technical audience`
- `8 -- good but next time include code examples alongside the explanation`

Each of these gives PAI something specific to act on. The rating sets the severity. The explanation pinpoints the issue.

## Implicit feedback

You do not always need to type a number. PAI reads your tone and reacts accordingly.

**Signals PAI detects as negative feedback:**
- "This is completely wrong"
- "That's not what I asked for"
- "No, I meant the opposite"
- "This is way too long / too short"
- Repeated rephrasing of the same request (suggesting the response missed the point)

**Signals PAI detects as positive feedback:**
- "This is exactly what I needed"
- "Perfect, thanks"
- "This is great work"
- Building directly on the response without corrections

Implicit feedback is less precise than explicit ratings, but it adds up over time. PAI combines both types to build its understanding of your preferences.

:::tip
Implicit feedback is convenient, but explicit ratings are more actionable. When a response is notably good or bad, take one second to type a number. That single digit is worth more than ten implicit signals.
:::

## What happens with low ratings

When you give a rating of 1 to 3, PAI does more than just record a negative signal. It performs a structured review.

**The deep review process:**

<pre class="mermaid">
graph TD
    A["⭐ Low rating received"] --> B["📋 Context capture"]
    B --> C["🔍 Gap analysis"]
    C --> D["🔗 Pattern matching"]
    D --> E["🎯 Root cause identified"]
    E --> F["⚙️ Skill or preference updated"]

    style A fill:#ef4444,stroke:#dc2626,color:#ffffff
    style B fill:#f59e0b,stroke:#d97706,color:#ffffff
    style C fill:#06b6d4,stroke:#0891b2,color:#ffffff
    style D fill:#8b5cf6,stroke:#6d28d9,color:#ffffff
    style E fill:#3b82f6,stroke:#1e40af,color:#ffffff
    style F fill:#10b981,stroke:#059669,color:#ffffff
</pre>

1. **Context capture** -- PAI saves the full interaction: your original request, any clarifications, its response, and your rating with explanation
2. **Gap analysis** -- identifies specifically where the response diverged from what you needed
3. **Pattern matching** -- checks whether this failure resembles previous low-rated interactions
4. **Root cause identification** -- determines whether the issue was wrong approach, wrong format, wrong depth, missing information, or something else
5. **Improvement action** -- updates the relevant skill, preference, or decision pattern to prevent the same failure

This is why a rating of 3 with explanation is one of the most valuable things you can give PAI. It triggers a thorough learning process that makes future interactions measurably better.

## Tips for getting the most out of feedback

### Rate consistently, not just when frustrated

If PAI only receives ratings when you are unhappy, it gets a distorted picture of your preferences. It knows what you dislike but not what you like. Rate the good responses too -- even a quick `8` tells PAI to keep doing what it just did.

### Be specific about what was good or bad

"Bad" is less useful than "bad because the tone was too casual for a business audience." "Good" is less useful than "good because you included concrete examples." Specificity gives PAI actionable information.

### Rate the output, not the effort

If PAI goes through an elaborate process but produces a mediocre result, rate the result. A 5 is a 5 regardless of how much work went into it. Conversely, if a simple quick response is exactly what you needed, give it the 9 it deserves.

### A 3 with explanation beats a silent 7

This is worth repeating. One detailed low rating teaches PAI more than ten context-free acceptable ratings. When something genuinely fails, invest the five seconds to explain why.

### Use the full scale

Some people default to 6-8 for everything. This compresses PAI's ability to distinguish between "okay" and "great." If you use the full 1-10 range, PAI gets much clearer signals about your actual preferences.

## The accumulation effect

Individual ratings are useful. Accumulated ratings over weeks and months are transformative.

After a few sessions, PAI starts recognizing patterns: you prefer tables over prose, concise answers over thorough ones, practical examples over theoretical explanations. After a few weeks, these patterns are well-established and PAI's defaults align closely with your preferences.

After a few months, the effect compounds. PAI knows not just your general preferences but your domain-specific ones. You might want detailed technical depth for security topics but high-level summaries for business strategy. You might prefer formal tone in reports but conversational tone in emails. PAI learns these nuances because your feedback provides the evidence.

The system you use on day one is good. The system you use on day ninety is yours.

## What to read next

- [Your AI Gets Better](/user/self-improvement/) -- the full picture of PAI's learning and improvement system
- [Working With Skills](/user/working-with-skills/) -- how skills improve based on your feedback
- [Skills Catalog](/user/skills-catalog/) -- explore all the capabilities you can rate and improve
