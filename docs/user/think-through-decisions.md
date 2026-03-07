---
title: Think Through Decisions
description: How to use PAI's structured thinking modes for complex decisions — multi-perspective debate, red-teaming, and first-principles analysis.
diataxis_type: how-to
---

When you face a genuinely complex decision — one with trade-offs, uncertainty, or high stakes — PAI offers structured thinking modes that go beyond a single AI opinion. These modes surface angles you might miss and stress-test assumptions you might not question.

## Multi-perspective analysis

Get several viewpoints arguing different sides of your question.

```
Give me three different perspectives on whether we should migrate to microservices
```

```
I'm deciding between building in-house or buying a third-party solution. Argue both sides.
```

```
Debate the pros and cons of remote work policies — I want to hear strong arguments on both sides
```

PAI activates its Council thinking tool, which generates distinct perspectives that genuinely disagree with each other. This is not "here are some things to consider" — it is structured debate where each side makes its strongest case.

## Red-team your ideas

Have PAI actively try to find flaws in a plan, proposal, or assumption.

```
Red-team this business plan. What would a skeptic say?
```

```
Stress-test this proposal — what are the weakest assumptions?
```

```
I think we should bet on this technology. Try to convince me I'm wrong.
```

Red-teaming uses PAI's adversarial analysis mode. It is not balanced — it deliberately takes the opposing view and looks for weaknesses. Use this when you want your ideas challenged, not validated.

## First-principles reasoning

Break a complex problem down to its fundamental truths and rebuild from there.

```
Break down the problem of reducing our deployment time from first principles
```

```
I want to rethink our pricing model from scratch. Help me reason from first principles.
```

```
Deconstruct this problem: why are our customers churning after month 3?
```

First-principles thinking strips away assumptions and conventions. It asks "what do we know to be true?" and builds up from there. Use this when existing approaches are not working and you need a fresh perspective.

## Creative exploration

Generate multiple diverse approaches to a problem.

```
I need creative approaches to reducing our customer onboarding time
```

```
Brainstorm 10 different ways we could monetise this API
```

```
Think divergently about how we could solve the cold-start problem
```

This mode maximises variety. It generates ideas that are genuinely different from each other, not minor variations on the same theme.

## Combine thinking modes

For the most thorough analysis, chain modes together:

```
First, break this down from first principles. Then, take the best approach and red-team it.
```

```
Give me multiple perspectives on this decision, then stress-test whichever one we lean toward.
```

```
Brainstorm creative solutions, then evaluate the top 3 against our constraints.
```

## Tips

- **State the stakes.** "Should we use React?" gets a different depth than "We're choosing a frontend framework for a product that will need to scale to 10 million users." Context about consequences drives deeper analysis.
- **Share your current leaning.** "I'm 70% sure we should go with option A" gives PAI something specific to challenge or validate, rather than starting from zero.
- **Ask for a recommendation.** After multi-perspective analysis, ask: "Given everything we've discussed, what would you actually recommend and why?" PAI will synthesise the perspectives into a concrete suggestion.
- **Use for decisions, not validation.** These thinking modes are most valuable when you genuinely do not know the answer. If you have already decided and want confirmation, you will get less value.

## What to read next

- [The Algorithm](/user/the-algorithm/) -- how structured thinking fits into PAI's problem-solving loop
- [Research a Topic](/user/research-topics/) -- gather information before making a decision
- [Give Feedback](/user/giving-feedback/) -- rate the analysis so PAI learns your decision-making preferences
