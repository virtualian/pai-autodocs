---
title: Fabric Patterns Reference
description: Catalog of commonly used Fabric patterns — what each one does, when to use it, and example prompts.
diataxis_type: reference
---

Fabric includes over 200 patterns. This reference covers the most commonly used patterns, organised by purpose. For the full list, see the [Fabric repository](https://github.com/danielmiessler/fabric).

## Content analysis

| Pattern | What it does | Example prompt |
|---------|-------------|----------------|
| `extract_wisdom` | Extracts key ideas, insights, quotes, habits, facts, and recommendations | "Extract the wisdom from this article" |
| `extract_article_wisdom` | Optimised extraction for written articles specifically | "Extract article wisdom from this blog post" |
| `extract_insights` | Focuses on non-obvious insights and implications | "What are the key insights in this?" |
| `analyze_claims` | Identifies claims and evaluates the evidence supporting them | "Analyze the claims in this article" |
| `extract_references` | Pulls all references, citations, and mentioned works | "Extract all the references from this paper" |

## Summarisation

| Pattern | What it does | Example prompt |
|---------|-------------|----------------|
| `create_summary` | Multi-level summary: one sentence, one paragraph, key points, detailed | "Summarise this with Fabric" |
| `summarize` | Standard concise summary | "Summarise this article" |
| `create_micro_summary` | Ultra-concise summary in a few sentences | "Give me a micro summary of this" |
| `summarize_paper` | Academic paper summarisation with methodology and findings | "Summarise this research paper" |
| `summarize_meeting` | Meeting notes to decisions, action items, and key points | "Summarise these meeting notes" |

## Security and threat analysis

| Pattern | What it does | Example prompt |
|---------|-------------|----------------|
| `analyze_threat_model` | Structured threat model with attack vectors, risks, and mitigations | "Analyze the threat model for our auth system" |
| `analyze_threat_model_stride` | STRIDE-based threat modelling | "STRIDE analysis of this architecture" |
| `create_threat_scenarios` | Generates specific attack scenarios | "What are the threat scenarios for this API?" |
| `analyze_incident` | Post-incident analysis with root cause and lessons learned | "Analyze this security incident" |

## Quality evaluation

| Pattern | What it does | Example prompt |
|---------|-------------|----------------|
| `rate_content` | Evaluates content quality across clarity, evidence, originality, and actionability | "Rate the quality of this blog post" |
| `rate_ai_response` | Evaluates the quality of an AI-generated response | "Rate this AI response" |
| `analyze_presentation` | Evaluates a presentation for clarity, structure, and impact | "Analyze this presentation" |

## Writing and prompting

| Pattern | What it does | Example prompt |
|---------|-------------|----------------|
| `improve_prompt` | Analyzes and improves an AI prompt | "Improve this prompt I wrote" |
| `improve_writing` | Identifies weaknesses in writing and suggests improvements | "How can I improve this writing?" |
| `write_essay` | Structured essay generation from a topic or outline | "Write an essay about [topic]" |
| `create_tags` | Generates relevant tags and categories for content | "Create tags for this article" |

## Decision support

| Pattern | What it does | Example prompt |
|---------|-------------|----------------|
| `analyze_pros_cons` | Structured pros and cons analysis | "Analyze the pros and cons of this decision" |
| `create_better_frame` | Reframes a problem for clearer thinking | "Help me reframe this problem" |
| `analyze_debate` | Analyzes both sides of a debate with strengths and weaknesses | "Analyze both sides of this debate" |

## Technical analysis

| Pattern | What it does | Example prompt |
|---------|-------------|----------------|
| `analyze_tech_impact` | Evaluates the impact of a technology on an industry or domain | "Analyze the impact of [tech] on [domain]" |
| `explain_code` | Explains what code does in plain language | "Explain this code" |
| `explain_docs` | Simplifies technical documentation | "Explain this documentation in simple terms" |
| `find_hidden_message` | Identifies unstated assumptions and hidden messages in content | "What's the hidden message in this?" |

## Personal development

| Pattern | What it does | Example prompt |
|---------|-------------|----------------|
| `extract_book_ideas` | Extracts the most valuable ideas from a book or book summary | "Extract the key ideas from this book" |
| `create_reading_plan` | Generates a structured reading plan for a topic | "Create a reading plan for [topic]" |
| `extract_recommendations` | Pulls actionable recommendations from any content | "What does this recommend I do?" |

## Pattern conventions

All Fabric patterns follow these conventions:

| Convention | Detail |
|-----------|--------|
| **Input** | Any text content — articles, transcripts, documents, code |
| **Output** | Structured Markdown with consistent sections |
| **Naming** | Lowercase with underscores (e.g., `extract_wisdom`) |
| **Idempotent** | Same input produces same structure (content varies with model) |
| **Composable** | Patterns can be chained: extract then analyze then summarise |

## What to read next

- [Your First Fabric Pattern](/user/first-fabric-pattern/) -- guided tutorial
- [Use Fabric Patterns](/user/use-fabric-patterns/) -- how-to guide
- [Fabric Patterns](/user/fabric/) -- conceptual overview
