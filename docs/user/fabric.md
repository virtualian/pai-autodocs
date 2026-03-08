---
title: "Fabric Patterns"
description: How PAI integrates with Daniel Miessler's Fabric — a curated library of AI prompts for structured analysis.
diataxis_type: explanation
---

[Fabric](https://github.com/danielmiessler/fabric) is an open-source project created by [Daniel Miessler](https://github.com/danielmiessler) — the same person who created PAI. It is a curated library of over 200 AI prompt patterns, each designed for a specific analytical task.

PAI integrates Fabric directly, giving you access to these patterns without needing to install or manage Fabric separately.

## What Fabric patterns do

A Fabric pattern is a structured prompt that tells the AI exactly how to approach a specific type of analysis. Instead of asking an AI to "summarize this article" and hoping for good results, a Fabric pattern like `extract_wisdom` defines precisely what to extract: key ideas, insights, quotes, references, and recommendations — in a consistent, structured format.

Examples of what Fabric patterns can do:

| Pattern | What it does |
|---------|-------------|
| `extract_wisdom` | Pulls key insights, ideas, quotes, and recommendations from any content |
| `analyze_threat_model` | Produces a structured threat model for a system or proposal |
| `create_summary` | Summarizes content at multiple levels of detail |
| `extract_article_wisdom` | Extracts the most valuable insights from articles |
| `improve_prompt` | Analyzes and improves an AI prompt |
| `rate_content` | Evaluates content quality with structured criteria |

There are patterns for security analysis, content creation, decision-making, coding, research, and dozens of other domains. Each one encodes expert-level thinking into a repeatable format.

## How PAI uses Fabric

When you ask PAI to analyze content, extract insights, or apply a structured analysis, PAI can activate its Fabric skill to run the appropriate pattern. You do not need to know pattern names or syntax.

**Natural language works:**
- "Extract the wisdom from this article"
- "Summarize this with Fabric"
- "Analyze this from a security perspective using Fabric patterns"
- "What are the key takeaways from this video transcript?"

PAI matches your intent to the right pattern and runs it. The output follows Fabric's structured format — consistent, thorough, and reproducible.

## Why Fabric matters

Fabric solves a real problem: most people do not know how to prompt AI effectively. A vague prompt produces a vague result. Fabric patterns encode *how experts would ask the question* — the right structure, the right extraction criteria, the right output format.

By integrating Fabric, PAI gives you access to this expertise automatically. You describe what you want in plain language, and PAI applies the pattern that an expert would use.

## Fabric and PAI: the relationship

Fabric and PAI come from the same creator and the same philosophy, but they serve different purposes:

- **Fabric** focuses on *what to ask* — curated patterns for specific analytical tasks
- **PAI** focuses on *how your AI operates* — persistent memory, structured problem-solving, goal context, and self-improvement

PAI is, in a sense, the evolution of Fabric's ideas into full infrastructure. Where Fabric gives you better prompts, PAI gives you a better AI system. And because PAI integrates Fabric, you get both.

## What to read next

- [Working With Skills](/user/working-with-skills/) -- how Fabric fits alongside PAI's other skills
- [Skills Catalog](/user/skills-catalog/) -- find Fabric and every other skill in the full reference
- [What is PAI?](/user/what-is-pai/) -- the broader vision that connects Fabric and PAI
