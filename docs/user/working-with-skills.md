---
title: Working With Skills
description: A practical guide to using PAI's specialized skills — what they do, how to trigger them, and how to get the best results.
diataxis_type: how-to
---

PAI comes with dozens of specialized skills that activate automatically when you ask for help. You do not need to memorize anything or learn special commands. Just describe what you need in plain language, and PAI brings the right expertise to bear.

This guide shows you what is available, gives you prompts you can try right now, and explains how to get the most out of every interaction.

## How skills work

Skills are focused areas of expertise built into PAI. Each one knows how to handle a specific kind of task -- research, security testing, content creation, image generation, structured thinking, and more.

When you make a request, PAI reads your intent and activates the right skill. This happens through meaning, not keywords. You do not need to say any magic words or use specific phrasing.

| What you say | What PAI does |
|---|---|
| "Research the latest trends in renewable energy" | Gathers information from multiple sources, cross-references findings, and delivers a structured analysis |
| "Create a blog post about our product launch" | Runs a full content workflow -- drafting, editing, and formatting |
| "Run a security assessment on our web application" | Performs systematic security testing following professional methodology |
| "Create a header image for my article" | Generates visual content with appropriate style and format |
| "Analyze this from a security perspective" | Provides threat modeling, vulnerability analysis, or risk assessment |
| "I need to think through this decision carefully" | Activates multi-perspective analysis or first-principles reasoning |
| "Test this AI chatbot for prompt injection vulnerabilities" | Runs a systematic AI security assessment |

The pattern is simple: say what you need, and PAI figures out how to deliver it.

## What you can do with skills

PAI ships with dozens of built-in skills organised across several categories. Here is what each one offers -- and what to try.

### Research and intelligence

When you need to investigate a topic, PAI does not just search the web and summarize results. It gathers information from multiple sources in parallel, cross-references findings, extracts key insights, and presents structured analysis. Research that would take hours gets compressed into minutes.

This category also covers open-source intelligence for due diligence, background research, and competitive analysis.

**Try this:**

- "Research the current state of AI regulation in the EU and summarize the key proposals"
- "Do a deep investigation into [company name] -- their funding, leadership, recent news, and market position"
- "Give me a quick overview of the pros and cons of serverless architecture"

### Security and assessment

PAI includes professional-grade security capabilities for web application testing, reconnaissance, and AI security assessment. These follow real penetration testing methodology and produce actionable findings, not surface-level summaries.

If you work in security or need to evaluate an application's security posture, these skills provide structured workflows that cover the full assessment lifecycle.

**Try this:**

- "Run a security assessment on https://example.com and give me a prioritized list of findings"
- "Analyze our authentication flow for common vulnerabilities"
- "Test this chatbot for prompt injection -- here is the URL"

### Thinking and analysis

When you need more than a quick answer, PAI offers structured reasoning modes for complex decisions:

- **Multi-perspective debate** -- several AI viewpoints argue different sides of your question, surfacing angles you might miss
- **Adversarial analysis** -- dedicated opposing viewpoints stress-test your ideas, plans, or claims
- **First-principles reasoning** -- breaks complex problems into fundamental truths and rebuilds from there
- **Creative exploration** -- generates multiple diverse approaches to a problem through extended thinking

These activate when your request involves genuine complexity, ambiguity, or high-stakes decisions.

**Try this:**

- "I need to decide between building this feature in-house or buying a third-party solution. Help me think through both sides."
- "Stress-test this business plan -- what are the weakest assumptions?"
- "Break down the problem of reducing our deployment time from first principles"

### Development and engineering

Skills for building command-line tools, automating browser tasks, and creating custom workflows. If you are a developer, these give you structured approaches to common engineering tasks.

**Try this:**

- "Build me a CLI tool that converts CSV files to JSON"
- "Automate the process of checking these five websites for uptime"

### Content and creative

From writing to visual content, these skills handle creative work. Visual capabilities include illustrations, diagrams, flowcharts, and infographics. Content capabilities cover everything from blog posts to technical documentation.

**Try this:**

- "Write a blog post about our new feature launch, targeting a technical audience"
- "Create a diagram showing how data flows through our system"
- "I need an infographic comparing three pricing plans"

:::tip
You do not need to specify what type of visual content you want. Say "create a diagram showing our architecture" or "I need an illustration for this concept," and PAI selects the right approach automatically.
:::

### Data and scraping

Need data from social media, business directories, or web pages? PAI handles the technical complexity of data extraction. You describe what data you need, and PAI manages the collection, pacing, and formatting.

**Try this:**

- "Scrape the top 20 results from [directory] and put them in a spreadsheet format"
- "Collect the latest posts from [social media account] and summarize the themes"
- "Extract all the pricing information from this competitor's website"

### System and management

Skills for managing PAI itself -- setting up custom agents, configuring voice output, and organizing your goals and projects.

**Try this:**

- "Set up a custom agent that specializes in reviewing legal contracts"
- "Show me my current goals and project status"

## Getting the most out of skills

How you phrase your request affects what PAI delivers. Here are patterns that help you get exactly what you need.

### Control the depth of research

PAI adjusts how deeply it investigates based on your phrasing. Compare these:

| What you say | What you get |
|---|---|
| "Give me a quick overview of quantum computing" | A concise summary -- a few paragraphs, delivered in under a minute |
| "Research quantum computing applications in drug discovery" | A standard investigation -- multiple sources, structured findings, a few minutes |
| "Do a deep investigation into quantum computing's impact on cryptography, including recent papers and expert opinions" | An extensive report -- thorough multi-source analysis, cross-referenced findings, may take several minutes |

Words like "quick," "overview," and "brief" signal a lighter touch. Words like "deep," "thorough," "extensive," and "investigate" signal that you want PAI to go further.

### Ask for multi-perspective analysis

When you face a tough decision, ask PAI to argue multiple sides:

- "Give me three different perspectives on whether we should migrate to microservices"
- "Debate the pros and cons of remote work policies -- I want to hear strong arguments on both sides"
- "Red-team this proposal. What would a skeptic say?"

PAI will bring in structured reasoning that surfaces trade-offs and blind spots you might not consider on your own.

### Chain skills for complex tasks

When your request spans multiple domains, PAI automatically combines skills into a pipeline. You do not need to orchestrate this yourself -- just describe the full outcome you want.

```mermaid
graph LR
    A["🔍 Research<br/>Gather intelligence"] --> B["📊 Visualize<br/>Create charts & diagrams"]
    B --> C["📝 Write<br/>Structure into report"]
    C --> D["✅ Deliver<br/>Polished result"]

    style A fill:#3b82f6,stroke:#1e40af,color:#ffffff
    style B fill:#8b5cf6,stroke:#6d28d9,color:#ffffff
    style C fill:#f59e0b,stroke:#d97706,color:#ffffff
    style D fill:#10b981,stroke:#059669,color:#ffffff
```

For example:

- "Research our top three competitors, then create a comparison report with charts and a summary slide"
- "Analyze the security of this web app, then write up the findings as a client-facing report with diagrams"
- "Gather data on market trends in our industry, visualize the key metrics, and draft an executive briefing"

PAI identifies what needs to happen, sequences the steps, and delivers a combined result.

### Discover what is available

If you are not sure what PAI can do, just ask:

- "What skills do you have?"
- "What can you help me with?"
- "Show me what you can do for security testing"

PAI will describe its capabilities in plain language. For a complete list, see the [Skills Catalog](/user/skills-catalog/).

## What to expect

### Output format

Most skills deliver structured output -- clear sections, headings, bullet points, and summaries. Research results come with source references. Security assessments include severity ratings and remediation steps. Creative content arrives formatted and ready to use or refine.

If you want a specific format, say so. "Give me this as a bullet list," "format this as a table," or "write this in markdown" all work.

### Timing

How long a skill takes depends on what you asked for:

- **Quick lookups and summaries:** Seconds to about a minute
- **Standard research or content creation:** One to three minutes
- **Deep investigations, security assessments, or multi-step tasks:** Three to ten minutes or more

If a task is taking longer than expected, PAI is likely doing thorough work. You can check in by asking "How is that coming along?" or "Give me what you have so far."

### Following up

After PAI delivers a result, you can refine it:

- "Go deeper on the second section"
- "Make the tone more formal"
- "Add more detail about the security findings"
- "Can you turn this into a presentation outline?"

PAI remembers the context of what it just delivered, so follow-up requests build on previous work without starting over.

## Skills grow over time

PAI's skill library expands with updates. New areas of expertise get added regularly without disrupting the skills you already rely on. Each update can bring new capabilities across any domain.

You can also request custom skills for workflows specific to your work. If you have a repeated process -- a way you always approach a certain type of task -- that can become a skill that PAI activates automatically when appropriate.

## What to read next

- [Skills Catalog](/user/skills-catalog/) -- the full list of every built-in skill with descriptions and example prompts
- [How PAI Improves Over Time](/user/self-improvement/) -- how your usage and feedback make PAI better at helping you
- [Giving Effective Feedback](/user/giving-feedback/) -- how to rate outputs so PAI keeps improving
