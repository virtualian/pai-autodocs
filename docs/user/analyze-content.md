---
title: Analyze Content
description: How to extract insights, key takeaways, and structured analysis from articles, videos, podcasts, and documents.
diataxis_type: how-to
---

PAI can take any content — articles, YouTube videos, podcast transcripts, documents — and extract structured insights from it. This goes beyond summarisation: PAI pulls out the ideas that matter, the arguments being made, and the actionable takeaways.

## Extract wisdom from content

The most common pattern: give PAI content and ask it to extract what matters.

```
Extract the wisdom from this article: [URL or paste]
```

```
What are the key insights from this video? [YouTube URL]
```

```
Analyze this podcast transcript and give me the main takeaways
```

PAI activates its content analysis capabilities and returns structured output: key ideas, insights, quotes, recommendations, and references.

## Summarise at different levels

### Executive summary

```
Summarise this in 3 bullet points for a busy executive
```

### Detailed summary

```
Give me a thorough summary of this, preserving the key arguments
```

### Custom focus

```
Summarise this article, focusing on the implications for our industry
Summarise this, but only the parts relevant to data privacy
```

## Analyze specific content types

### Articles and blog posts

```
Analyze this article: [URL]
What's the main argument in this piece and how well is it supported?
Extract the key claims and evidence from this article
```

### YouTube videos

```
Analyze this YouTube video: [URL]
What are the key takeaways from this talk?
Summarise this video and list the actionable advice
```

### Documents and PDFs

```
Analyze this document [paste or attach]
Extract the key decisions and action items from these meeting notes
What are the main findings in this report?
```

## Use Fabric patterns for structured analysis

For more structured output, you can explicitly invoke [Fabric patterns](/user/fabric/):

```
Extract the wisdom from this using Fabric
Analyze this with the threat model pattern
Rate the quality of this content using Fabric
```

Fabric patterns produce consistent, structured output — the same extraction criteria every time. See [Use Fabric Patterns](/user/use-fabric-patterns/) for details.

## Compare and cross-reference

```
Analyze these three articles and tell me where they agree and disagree
Compare the arguments in [source A] vs [source B]
I've read these two perspectives — which has stronger evidence?
```

## Tips

- **Provide the content directly when possible.** Pasting text or giving a URL is better than describing what you read. PAI works with the actual content, not your recollection of it.
- **State what you care about.** "Analyze this article" gets a general analysis. "Analyze this article — I'm evaluating whether to adopt this technology" gets analysis focused on your decision.
- **Chain analysis into action.** After extracting insights, follow up: "Now help me write a brief based on these findings" or "Turn these takeaways into action items for my team."

## What to read next

- [Use Fabric Patterns](/user/use-fabric-patterns/) -- apply structured analysis patterns
- [Research a Topic](/user/research-topics/) -- when you need to gather information, not analyze existing content
- [Think Through Decisions](/user/think-through-decisions/) -- when analysis leads to a decision
