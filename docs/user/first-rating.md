---
title: Your First Rating
description: A guided walkthrough of rating your first PAI response — see how feedback drives improvement.
diataxis_type: tutorial
---

This tutorial walks you through giving your first rating to a PAI response. By the end, you will understand how the feedback loop works and why even a single number makes a difference.

## Before you start

You need PAI [installed and working](/user/install-pai/). You should have completed at least [one session](/user/first-session/) so you have something to rate.

## Step 1: Give PAI a real task

Ask PAI something where you care about the quality of the result:

```
Help me write an email to my team about the upcoming deadline change
```

Or:

```
Summarise the key trade-offs between REST and GraphQL for our use case
```

Pick something where you will have an opinion about whether the output is good, adequate, or off-target.

## Step 2: Read the response

Before rating, actually read what PAI produced. Consider:

- Did it understand what you were asking for?
- Is the format right? (Too long? Too short? Wrong tone?)
- Did it miss anything important?
- Would you use this as-is, or does it need significant editing?

## Step 3: Type a number

After the response, type a number from 1 to 10 as your next message:

```
8
```

That is it. PAI registers the rating and moves on. No confirmation dialog, no follow-up. One number, one second.

### What the numbers mean

| Rating | Meaning |
|--------|---------|
| **9-10** | Exceptional — exceeded expectations |
| **7-8** | Good — met expectations, solid work |
| **5-6** | Adequate — got the job done but could be better |
| **3-4** | Below expectations — missed the point or wrong approach |
| **1-2** | Serious failure — fundamentally wrong |

## Step 4: Add context (optional but valuable)

A number alone is useful. A number with an explanation is significantly more valuable:

```
7 -- good analysis but I needed it in bullet points, not paragraphs
```

```
9 -- perfect depth, exactly what I needed for the executive audience
```

```
4 -- too technical, this was supposed to be for a non-technical team
```

The pattern is: **rating -- explanation**. The explanation gives PAI something specific to act on next time.

## Step 5: See the effect

Give PAI another similar task. If you rated a previous response and explained what was off, notice whether PAI adjusts. If you said "too long" last time, the next response should be more concise. If you said "wrong format," the next one should match your preference.

The effect compounds. One rating adjusts a single interaction. Consistent ratings over weeks reshape how PAI works with you on everything.

## What you learned

1. **Rating takes one second** — type a number after any response
2. **Context multiplies value** — "7 -- reason" teaches more than just "7"
3. **Low ratings trigger deep analysis** — a 3 with explanation is more valuable than ten silent 7s
4. **Effects compound** — consistent feedback builds a detailed model of your preferences

## What to read next

- [Give Feedback](/user/giving-feedback/) -- the full how-to guide for effective feedback
- [Your AI Gets Better](/user/self-improvement/) -- how feedback drives the improvement loop
- [Your First Session](/user/first-session/) -- more tasks to try and rate
