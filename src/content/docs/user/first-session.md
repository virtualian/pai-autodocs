---
title: "Your First PAI Session"
description: See what makes PAI different in your very first conversation.
sidebar:
  order: 3
---

Your first session with PAI feels different from other AI tools. Here's what to expect and what to notice.

Most AI tools wait for you to type something, generate a response, and move on. PAI does something fundamentally different: it *thinks about your problem* before it starts working on it, defines what success looks like, picks the right approach, checks its own work, and then remembers what it learned. All of this happens in a single conversation turn.

Let's walk through it.

---

## Starting PAI

Open your terminal and run:

```bash
pai
```

That's it. When PAI starts up, it loads your context automatically -- your goals, your preferences, your recent work. You don't need to remind it who you are or re-explain your project every time. It already knows.

This is the first thing that feels different. You're not starting from scratch. You're picking up where you left off, with an AI that has been paying attention.

---

## Give it a real task

Don't start with "hello" or a toy question. Give PAI something you actually care about. Something where quality matters and where you'd notice the difference between a lazy answer and a thoughtful one.

Try something like:

- "Help me plan a presentation on our quarterly results for the leadership team"
- "I need to write a project proposal for migrating our database -- help me think through the risks"
- "Review this pull request and tell me what I'm missing"

Pick a task that benefits from structured thinking. The kind of thing where you'd normally spend twenty minutes organizing your thoughts before you even started writing.

Press Enter and watch carefully. What happens next is what sets PAI apart.

---

## What you'll notice

PAI doesn't just jump straight to an answer. It runs through a structured process, and you can see every step. Here's what to pay attention to.

### PAI thinks about what you actually need

Before generating anything, PAI reverse-engineers your request. It considers what you asked for, what you *implied*, and what you probably want to avoid. If you asked for a presentation plan for leadership, it understands you need something concise and executive-friendly -- not a 40-slide deep dive with footnotes. You didn't have to say that. PAI figured it out.

### It creates success criteria for itself

This is the part that surprises people the most. Before doing any work, PAI defines what a good answer looks like. These aren't vague aspirations -- they're concrete, checkable conditions. Things like "covers all key quarterly metrics" or "appropriate for executive audience." PAI writes these down and commits to them before it starts.

Think of it like a contractor who writes up the spec before picking up a hammer. You can see exactly what PAI is aiming for, and you can course-correct before it does the work instead of after.

### It picks the right approach

Not every task needs the same treatment. PAI decides whether your request calls for deep research, creative brainstorming, multiple competing perspectives, or just a straightforward answer. A presentation plan gets a direct, structured approach. A controversial architectural decision might get a multi-perspective debate. PAI picks the right tool for the job, every time.

### It checks its own work

Before delivering anything to you, PAI goes back to those success criteria it set earlier and verifies its output against each one. Did it actually cover all the key metrics? Is the tone right for an executive audience? Is it under ten slides? You can see exactly what it checked and whether each criterion passed.

This is what makes PAI's output verifiable. It's not just "here's what the AI came up with." It's "here's what the AI came up with, here's what it was trying to achieve, and here's proof that it met those goals."

### It captures what it learned

At the end of every response, PAI notes what worked and what to adjust next time. Maybe it learned that you prefer concise slide decks over detailed ones. Maybe it noticed that this kind of task works best with a direct approach rather than a debate. These observations feed into PAI's long-term memory, so it gets better at working with you specifically over time.

---

## How it all fits together

Here's the process PAI follows for every meaningful request:

<pre class="mermaid">
graph LR
    A["👁️ Observe"] --> B["🧠 Think"]
    B --> C["📋 Plan"]
    C --> D["🔨 Build"]
    D --> E["✅ Verify"]
    E --> F["📚 Learn"]

    style A fill:#3b82f6,stroke:#1e40af,color:#ffffff
    style B fill:#8b5cf6,stroke:#6d28d9,color:#ffffff
    style C fill:#06b6d4,stroke:#0891b2,color:#ffffff
    style D fill:#f59e0b,stroke:#d97706,color:#ffffff
    style E fill:#10b981,stroke:#059669,color:#ffffff
    style F fill:#ec4899,stroke:#db2777,color:#ffffff
</pre>

Each step builds on the last. By the time you get the output, it has been observed, planned, built, and verified. Not just generated.

## A simplified example

Here's roughly what you'll see when you give PAI a task. The exact content varies, but the structure looks like this:

```
🤖 PAI ALGORITHM ═══════════
🗒️ TASK: Plan presentation on quarterly results

👁️ OBSERVE — Understands you need slides, not a script. Notes this is for executives.
🧠 THINK — Decides a direct approach works. No need for multiple perspectives.
📋 PLAN — Outlines 6 slides with key points for each.
🔨 BUILD — Creates the slide outline with talking points.
⚡ EXECUTE — Delivers the complete plan.
✅ VERIFY — Checks: executive-appropriate? Covers key metrics? Under 10 slides?
📚 LEARN — Notes your preference for concise slide decks.
```

Each phase builds on the last. By the time you get to the output, it's been observed, planned, built, and verified. Not just generated.

---

## The wow moments

Your first session will have a few moments where you stop and think, "wait, that's different."

Notice how it figured out what you *didn't* say? You asked for a presentation plan, but you didn't say "keep it under ten slides" or "make it executive-friendly." PAI inferred those requirements from context and built them into its success criteria.

See how it verified its own work before delivering? Most AI tools generate an answer and hand it over. PAI audits itself first. If something doesn't meet the bar, it fixes the issue before you ever see it.

That learning note at the end? It'll remember that next time. The next presentation you ask for will already reflect your preferences. You won't have to repeat yourself.

---

## Not everything gets the full treatment

PAI is smart about how much effort to invest. A simple greeting gets a simple greeting back. A quick factual question gets a quick answer. The full structured approach -- with success criteria, verification, and learning -- kicks in when the task actually warrants it.

You don't have to think about this. PAI reads the complexity of your request and adapts automatically. But it's worth knowing: if you ask something simple and don't see all seven phases, that's by design. PAI matches its depth to what the task demands.

---

## What to read next

Now that you've seen PAI in action, explore what makes it powerful over time:

- **[Your AI Remembers](/user/memory/)** -- how context and memory work across sessions
- **[Your AI Gets Better](/user/self-improvement/)** -- how feedback and learning drive continuous improvement
- **[Working With Skills](/user/working-with-skills/)** -- what your AI can do and how to extend it
