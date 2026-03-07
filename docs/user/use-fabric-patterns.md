---
title: Use Fabric Patterns
description: How to apply Fabric's curated analysis patterns to your content for structured, repeatable results.
diataxis_type: how-to
---

[Fabric patterns](/user/fabric/) are structured prompts that define exactly how to analyze content. Instead of hoping the AI extracts what matters, a pattern specifies the extraction criteria, output format, and analytical approach. This guide shows you how to use them.

## Basic usage

The simplest way to use Fabric is to ask PAI to analyze content:

```
Extract the wisdom from this article: [URL or paste]
```

```
Summarise this with Fabric: [content]
```

```
Use Fabric to analyze this: [content]
```

PAI matches your request to the appropriate Fabric pattern and runs it. The output follows the pattern's structured format.

## Request specific patterns

If you know which pattern you want, ask for it directly:

```
Run the extract_wisdom pattern on this article
```

```
Apply the analyze_threat_model pattern to our system design
```

```
Use the improve_prompt pattern on this prompt I wrote
```

## Common patterns and when to use them

### Extract wisdom

Pull the most valuable insights from any content.

```
Extract the wisdom from this conference talk: [URL]
```

**Returns:** Key ideas, insights, quotes, recommendations, references — structured and prioritised.

**Use when:** You watched, read, or listened to something and want the signal extracted from the noise.

### Threat model

Produce a structured threat analysis for any system or proposal.

```
Analyze the threat model for our authentication system
```

**Returns:** Threats, attack vectors, mitigations, risk levels — organised by severity.

**Use when:** You need a security perspective on a system, feature, or architecture.

### Summarise

Create a structured summary at a specified depth.

```
Summarise this research paper using Fabric
```

**Returns:** Multi-level summary — one sentence, one paragraph, key points, and detailed breakdown.

**Use when:** You need to quickly understand long content without reading it end to end.

### Rate content

Evaluate the quality of content against structured criteria.

```
Rate the quality of this blog post using Fabric
```

**Returns:** Quality assessment across dimensions like clarity, evidence, originality, and actionability.

**Use when:** You are curating content and need consistent quality evaluation.

### Improve prompt

Analyze and improve an AI prompt.

```
Use the improve_prompt pattern on this: [your prompt]
```

**Returns:** Analysis of the prompt's strengths and weaknesses, plus an improved version.

**Use when:** You are writing prompts and want expert-level prompt engineering feedback.

## Apply patterns to different content types

Fabric patterns work with any content you can give PAI:

```
Extract wisdom from this YouTube video: [URL]
Analyze this PDF with the threat model pattern
Summarise this podcast transcript using Fabric
Rate the quality of this article: [URL]
```

## Chain patterns

Run multiple patterns in sequence for deeper analysis:

```
First extract the wisdom from this article, then rate its quality
```

```
Summarise this paper, then identify the key claims and red-team them
```

## Tips

- **You do not need to memorise pattern names.** Describe what you want and PAI selects the right pattern. "Pull the key insights from this" activates extract_wisdom without you naming it.
- **Fabric patterns produce consistent output.** The same pattern applied to different content follows the same structure. This is valuable when you are processing multiple pieces of content and want comparable results.
- **Combine with other skills.** "Research this topic, then apply the extract_wisdom pattern to the top 3 results" chains research and Fabric together.

## What to read next

- [Fabric Patterns](/user/fabric/) -- understand what Fabric is and how PAI uses it
- [Analyze Content](/user/analyze-content/) -- broader content analysis beyond Fabric
- [Skills Catalog](/user/skills-catalog/) -- find Fabric in the full skills reference
