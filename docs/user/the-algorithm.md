---
title: The Algorithm
description: How PAI thinks through every request — structured problem-solving that goes far beyond "generate a response."
diataxis_type: explanation
---

Most AI tools work like this: you type something, the AI generates a response, done. There is no plan, no verification, no learning. It is a one-shot guess.

PAI works differently. Every meaningful request goes through a structured problem-solving loop called the Algorithm. It is the reason PAI's output feels deliberate rather than generated.

## What you see

When you give PAI a non-trivial task, you will see it move through distinct phases. Here is what each one does for you.

### Observe

PAI reads your request and figures out what you *actually* need — not just what you typed. If you ask for "a presentation for leadership," PAI understands you need something concise and executive-friendly without being told. It identifies what you asked for, what you implied, and what you want to avoid.

Then it writes down success criteria — concrete, testable conditions like "covers all key quarterly metrics" and "appropriate for executive audience." These are defined *before* any work begins.

### Think

PAI decides how to approach the problem. Does this need research? Creative brainstorming? Multiple perspectives debating the options? A straightforward implementation? The approach is selected to match the task, not applied as a one-size-fits-all template.

This is also where PAI decides which [skills](/user/working-with-skills/) and agents to bring in. A security question activates security expertise. A content request activates writing workflows. A complex decision might activate a multi-perspective debate.

### Plan

The approach is locked in. PAI produces a concrete plan: what will be built, in what order, using which tools. You can see exactly what PAI intends to do before it starts doing it.

### Build and Execute

PAI does the work. When tasks are independent — editing multiple files, researching different topics, running parallel analyses — they execute concurrently. Serial execution of independent work is treated as a failure mode.

### Verify

Before delivering anything, PAI goes back to the success criteria it defined in Observe and checks every one against concrete evidence. Did it actually cover all the key metrics? Is the tone right? Is it the right length? You can see exactly what was checked and whether each criterion passed.

This is what makes PAI's output *verifiable*. It is not "here is what the AI came up with." It is "here is what the AI aimed for, here is what it built, and here is proof it hit the target."

### Learn

PAI records what worked and what to adjust next time. These observations persist in memory, so the next similar task benefits from this one. The Algorithm improves with use.

## Why this matters to you

The Algorithm is what separates PAI from a chatbot. Three things it gives you:

**Transparency.** You can see PAI's reasoning at every step. If something is off, you can course-correct during the process rather than after. The success criteria are visible before work starts.

**Consistency.** Because every task follows the same structured process, quality does not vary randomly. Good results are repeatable, and failures are diagnosable.

**Compounding improvement.** The Learn phase feeds into memory. Over time, PAI gets better at the kinds of tasks *you* care about, because it is learning from verified outcomes — not just generating and moving on.

## Not everything gets the full treatment

PAI matches its depth to the task. A simple greeting gets a quick response. A factual question gets a direct answer. The full Algorithm — with success criteria, capability selection, and verification — activates when the task actually warrants it. You do not need to think about this. PAI reads the complexity and adapts automatically.

## What to read next

- [Working With Skills](/user/working-with-skills/) -- the capabilities the Algorithm draws on
- [Your First Session](/user/first-session/) -- see the Algorithm in action
- [The Algorithm (deep dive)](/contributor/the-algorithm/) -- full technical reference for contributors
