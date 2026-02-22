---
title: "Write Your First Hook"
description: Create a hook that runs automatically when events happen in your PAI session.
diataxis_type: tutorial
---

<!-- Source: ~/.claude/skills/PAI/SYSTEM/THEHOOKSYSTEM.md -->

In this tutorial, you will create a custom hook that runs automatically when you submit a prompt in Claude Code. By the end, you will understand how PAI's event-driven hook system works and have a working hook you can extend for your own needs.

## What you will learn

- What hooks are and when they run
- The hook lifecycle: event, stdin, execute, exit
- How to create a TypeScript hook from scratch
- How to register a hook in `settings.json`
- How to test and debug hooks

## Prerequisites

- **PAI installed** in `~/.claude/` with a working `pai` command
- **Bun** runtime installed (`bun --version` should return a version)
- Basic familiarity with TypeScript (reading and editing files)

:::note
Hooks run as external scripts invoked by Claude Code. They are not AI prompts — they are deterministic code that executes on specific events.
:::

---

## Step 1: Understand hook events

PAI hooks respond to events in Claude Code sessions. Each event represents something that happened:

| Event | When It Fires |
|-------|---------------|
| **SessionStart** | A new Claude Code conversation begins |
| **UserPromptSubmit** | You submit a prompt |
| **Stop** | The AI finishes a response |
| **SubagentStop** | A spawned subagent finishes |
| **PreToolUse** | Before a tool executes |
| **PostToolUse** | After a tool executes |
| **SessionEnd** | The conversation ends |

For this tutorial, you will hook into **UserPromptSubmit** — the event that fires every time you type something and press Enter.

---

## Step 2: Create the hook script

Create a new file at `~/.claude/hooks/my-prompt-logger.ts`:

```typescript
#!/usr/bin/env bun

interface HookInput {
  session_id: string;
  transcript_path: string;
  hook_event_name: string;
  prompt?: string;
}

async function main() {
  try {
    const input = await Bun.stdin.text();
    const data: HookInput = JSON.parse(input);

    // Only process UserPromptSubmit events
    if (data.hook_event_name !== 'UserPromptSubmit') {
      process.exit(0);
    }

    // Log the prompt to a file
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ${data.prompt}\n`;

    const logPath = `${process.env.HOME}/.claude/MEMORY/prompt-log.txt`;
    const fs = require('fs');
    fs.appendFileSync(logPath, logLine);

  } catch (error) {
    // Log errors but never crash — hooks must exit cleanly
    console.error('Hook error:', error);
  }

  process.exit(0);
}

main();
```

Three things to notice in this code:

1. **stdin input** — Claude Code passes event data as JSON on stdin. The hook reads it with `Bun.stdin.text()`.
2. **try/catch with exit(0)** — Hooks must always exit with code 0. If a hook crashes or hangs, it can freeze Claude Code.
3. **The prompt field** — For `UserPromptSubmit` events, the `prompt` field contains what you typed.

---

## Step 3: Make the hook executable

```bash
chmod +x ~/.claude/hooks/my-prompt-logger.ts
```

---

## Step 4: Register the hook in settings.json

Open `~/.claude/settings.json` and add your hook to the `UserPromptSubmit` event. If there is already a `UserPromptSubmit` section, add your hook alongside the existing ones:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${PAI_DIR}/hooks/my-prompt-logger.ts"
          }
        ]
      }
    ]
  }
}
```

The `${PAI_DIR}` variable is resolved from the `env` section of `settings.json` and typically points to `~/.claude`.

:::caution
`settings.json` must be valid JSON. If you break the syntax, Claude Code will not load any hooks. Use `jq . ~/.claude/settings.json` to validate after editing.
:::

---

## Step 5: Test the hook directly

Before restarting Claude Code, test the hook by simulating an event:

```bash
echo '{"session_id":"test-123","transcript_path":"/tmp/test.jsonl","hook_event_name":"UserPromptSubmit","prompt":"Hello from my test"}' | bun ~/.claude/hooks/my-prompt-logger.ts
```

Check the output:

```bash
cat ~/.claude/MEMORY/prompt-log.txt
```

You should see a line like:

```
[2026-02-16T00:30:00.000Z] Hello from my test
```

If you see the log entry, the hook works. If not, check for errors in the script.

---

## Step 6: Test in a live session

Restart Claude Code to pick up the new hook configuration:

```bash
pai
```

Type any prompt and press Enter. After the response completes, check your log:

```bash
cat ~/.claude/MEMORY/prompt-log.txt
```

You should see your prompt logged with a timestamp.

---

## Step 7: Extend the hook

Now that you have a working hook, try extending it. Here are some ideas:

### Count prompts per session

```typescript
const countPath = `${process.env.HOME}/.claude/MEMORY/STATE/prompt-count.json`;
const fs = require('fs');

let counts: Record<string, number> = {};
if (fs.existsSync(countPath)) {
  counts = JSON.parse(fs.readFileSync(countPath, 'utf-8'));
}

counts[data.session_id] = (counts[data.session_id] || 0) + 1;
fs.writeFileSync(countPath, JSON.stringify(counts, null, 2));
```

### Filter by prompt content

```typescript
if (data.prompt && data.prompt.toLowerCase().includes('deploy')) {
  // Log deployment-related prompts separately
  fs.appendFileSync(deployLogPath, logLine);
}
```

### Send a notification

```typescript
// Send to PAI voice server (if running)
await fetch('http://localhost:8888/notify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: `New prompt received`,
    title: 'PAI Hook'
  })
}).catch(() => {
  // Voice server may not be running — fail silently
});
```

---

## What you have learned

In this tutorial, you:

- **Created a TypeScript hook** that runs on every prompt submission
- **Registered it** in `settings.json` under the `UserPromptSubmit` event
- **Tested it** both directly (simulated input) and in a live session
- **Understood the hook contract**: read stdin, do work, exit 0

The hook system is how PAI automates behavior around your sessions. The built-in hooks handle voice notifications, sentiment capture, tab titles, work tracking, and more — all using the same pattern you just learned.

## Next steps

- **[Write Hooks](/developer/write-hooks/)** — Detailed how-to for creating hooks with matchers, timeouts, and background processes
- **[Hook Types Reference](/developer/hook-types/)** — Complete reference for all hook events and their data payloads
- **Explore built-in hooks** — Read the scripts in `~/.claude/hooks/` to see production hook patterns
