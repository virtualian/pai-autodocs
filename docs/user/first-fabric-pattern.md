---
title: Your First Fabric Pattern
description: A guided walkthrough of running your first Fabric pattern — extract wisdom from a piece of content and see structured analysis in action.
diataxis_type: tutorial
---

This tutorial walks you through running your first Fabric pattern. By the end, you will have extracted structured insights from a piece of content and understood how Fabric patterns produce consistent, repeatable analysis.

## Before you start

You need PAI [installed and working](/user/install-pai/). You should have completed at least [one session](/user/first-session/) so you know how PAI responds. No Fabric-specific setup is needed — PAI includes Fabric integration out of the box.

## Step 1: Pick some content

Choose something you have recently read, watched, or want to analyze. A good first choice is:

- A blog post or article you found interesting
- A YouTube video from a conference talk
- A podcast transcript
- A document or report you need to digest

For this tutorial, we will use an article. Find one you care about — the analysis is more meaningful when the content matters to you.

## Step 2: Run the extract_wisdom pattern

This is the most popular Fabric pattern. It pulls the highest-value insights from any content.

If you have a URL:

```
Extract the wisdom from this article: [paste the URL]
```

If you have the text:

```
Extract the wisdom from this:

[paste the article text]
```

Press Enter and watch what happens.

## Step 3: Read the output

PAI returns structured output with distinct sections. Here is what to expect:

- **Summary** — A concise overview of the content
- **Ideas** — The key ideas presented, distilled to their essence
- **Insights** — Non-obvious connections and implications
- **Quotes** — The most important direct quotes
- **Habits** — Actionable practices mentioned or implied
- **Facts** — Specific data points and claims
- **References** — Sources, people, and works mentioned
- **Recommendations** — Suggested actions based on the content

Notice how this is different from a generic summary. The pattern defines *what to extract* and *how to structure it*. Every time you run extract_wisdom, you get the same categories — making it easy to compare insights across different pieces of content.

## Step 4: Try a different pattern

Now try a different angle on the same content. Ask PAI to summarize it:

```
Summarise this article using Fabric: [same URL or text]
```

Compare the output. The summary pattern produces a different structure — multiple levels of summary from one sentence to detailed breakdown. Same content, different analytical lens.

## Step 5: Try with a different content type

Fabric patterns work across content types. Try a YouTube video:

```
Extract the wisdom from this video: [YouTube URL]
```

Or if you have meeting notes:

```
Extract the key decisions and action items from this: [paste notes]
```

The pattern adapts to the content while maintaining its structured output.

## What you learned

You have now seen how Fabric patterns work:

1. **You describe what you want** — "extract the wisdom," "summarise," "analyze"
2. **PAI selects the right pattern** — matching your intent to a structured prompt
3. **The output is structured and consistent** — same categories every time
4. **Patterns work across content types** — articles, videos, documents, transcripts

## Try these next

Now that you know the basics, experiment with more patterns:

- "Rate the quality of this article using Fabric"
- "Analyze the threat model for [system or proposal]"
- "Improve this prompt I wrote: [your prompt]"
- "What are the key claims in this piece and how well are they supported?"

## What to read next

- [Use Fabric Patterns](/user/use-fabric-patterns/) -- the full how-to guide for applying patterns
- [Fabric Patterns Reference](/user/fabric-patterns-reference/) -- catalog of available patterns
- [Fabric Patterns](/user/fabric/) -- understand what Fabric is and how PAI integrates it
