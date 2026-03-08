---
title: Manage Your Memory
description: How to review, correct, and organize what PAI remembers about you and your work.
diataxis_type: how-to
---

PAI's [memory system](/user/memory/) captures context from your sessions — decisions, preferences, project details, and learnings. This guide shows you how to review what PAI remembers, correct mistakes, and keep your memory useful.

## Review what PAI knows

Ask PAI to show you its memory:

```
What do you remember about me?
```

```
What do you know about my current projects?
```

```
Show me what you've learned from our recent sessions
```

PAI summarises the relevant memory files. This is useful for periodic check-ins to make sure PAI's understanding matches reality.

## Correct mistakes

If PAI remembers something wrong or outdated:

```
That's not right — I'm no longer working on the migration project. Update your memory.
```

```
You have my role wrong. I'm a VP of Engineering now, not a senior engineer. Correct that.
```

```
Forget the preference about bullet points. I actually prefer tables now.
```

Be direct about what is wrong and what the correct information is. PAI updates the relevant memory files.

## Add important context

When something matters and you want to make sure PAI remembers it:

```
Remember this: we decided to go with PostgreSQL over MongoDB for the new service.
```

```
Important context: our company was acquired last month. The new parent company is [name].
```

```
Always remember that I prefer British English spelling.
```

PAI stores these in your memory files so they persist across sessions.

## Remove outdated information

As your situation changes, old context becomes noise:

```
I left my previous company. Remove any references to [company name] from active context.
```

```
The Q1 project is done. Archive it from my active work context.
```

```
Clear out any memory about the old tech stack — we've fully migrated.
```

## Organise by topic

If you want PAI to focus on specific areas:

```
What do you remember about my writing preferences?
```

```
Show me all the technical decisions you've captured
```

```
What learnings do you have stored from my security work?
```

This helps you audit specific areas rather than reviewing everything at once.

## Tips

- **Review monthly.** A quick "what do you remember about me?" once a month catches stale context. Outdated memory degrades response quality.
- **Correct immediately.** When PAI gets something wrong in a response, tell it right then. "That's wrong — the actual situation is..." both fixes the current response and updates memory.
- **Be explicit about preferences.** "Remember that I always want code examples in Python, not JavaScript" is clearer than hoping PAI will infer it.
- **Don't worry about duplication.** If you tell PAI something it already knows, it reinforces rather than duplicates. Better to over-communicate than leave gaps.

## What to read next

- [Your AI Remembers](/user/memory/) -- understand how the memory system works
- [Memory Reference](/user/memory-reference/) -- file structure and technical details
- [Give Feedback](/user/giving-feedback/) -- another way PAI learns your preferences
