---
title: Write Hooks
description: Create custom hooks that automate behavior around your PAI sessions.
diataxis_type: how-to
---

<!-- Source: ~/.claude/skills/PAI/SYSTEM/THEHOOKSYSTEM.md -->

This guide shows you how to create, register, and debug hooks in PAI. Hooks are event-driven scripts that run automatically during Claude Code sessions.

## Choose the right event

Select the hook event based on when you want your code to run:

| Event | Fires When | Common Uses |
|-------|------------|-------------|
| `SessionStart` | New conversation begins | Load context, initialize state |
| `UserPromptSubmit` | User submits a prompt | Capture ratings, update UI, preprocess input |
| `Stop` | AI finishes a response | Voice notifications, work capture, tab state |
| `SubagentStop` | A subagent completes | Capture agent output, track workflows |
| `PreToolUse` | Before a tool runs | Security validation, command filtering |
| `PostToolUse` | After a tool runs | Capture results, error tracking |
| `SessionEnd` | Conversation ends | Generate summaries, cleanup state |

## Create the hook script

Place your script in `~/.claude/hooks/`:

```typescript
#!/usr/bin/env bun

interface HookInput {
  session_id: string;
  transcript_path: string;
  hook_event_name: string;
  prompt?: string;          // UserPromptSubmit only
  tool_name?: string;       // PreToolUse/PostToolUse only
  tool_input?: any;         // PreToolUse only
  tool_output?: any;        // PostToolUse only
}

async function main() {
  try {
    const input = await Bun.stdin.text();
    const data: HookInput = JSON.parse(input);

    // Your logic here

  } catch (error) {
    console.error('Hook error:', error);
  }

  process.exit(0);  // Always exit 0
}

main();
```

Make it executable:

```bash
chmod +x ~/.claude/hooks/my-hook.ts
```

## Register in settings.json

Add the hook to the appropriate event in `~/.claude/settings.json`:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${PAI_DIR}/hooks/my-hook.ts"
          }
        ]
      }
    ]
  }
}
```

### Use matchers to filter events

For `PreToolUse` and `PostToolUse`, use a `matcher` to run the hook only for specific tools:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "${PAI_DIR}/hooks/validate-bash.ts"
          }
        ]
      }
    ]
  }
}
```

Matcher values: a specific tool name (e.g., `"Bash"`), `"*"` for all tools, or omit for all events.

## Handle slow operations with background processes

Hooks must complete quickly (under 500ms). For slow work like API calls, launch a background process:

```typescript
import { spawn } from 'child_process';

// Quick work — do it inline
const logLine = `[${new Date().toISOString()}] Event received\n`;
require('fs').appendFileSync(logPath, logLine);

// Slow work — launch background process
spawn('bun', [`${process.env.PAI_DIR}/hooks/slow-processor.ts`, data.session_id], {
  stdout: 'ignore',
  stderr: 'ignore',
  stdin: 'ignore',
  detached: true
});

// Exit immediately
process.exit(0);
```

## Add stdin timeouts

Claude Code writes data to stdin, but timing can vary. Always use a timeout:

```typescript
const decoder = new TextDecoder();
const reader = Bun.stdin.stream().getReader();

const timeoutPromise = new Promise<string>((resolve) => {
  setTimeout(() => resolve('{}'), 500);
});

const readPromise = Bun.stdin.text();
const input = await Promise.race([readPromise, timeoutPromise]);
```

## Use shared libraries

PAI provides shared libraries to avoid duplicating common logic:

```typescript
// Identity (from settings.json)
import { getDAName, getPrincipalName, getVoiceId } from './lib/identity';

// Timestamps in PST
import { getPSTTimestamp, getYearMonth } from './lib/time';

// Learning categorization
import { getLearningCategory, isLearningCapture } from './lib/learning-utils';

// Observability events
import { sendEventToObservability } from './lib/observability';
```

## Use the Inference tool for AI-powered hooks

Hooks that need AI reasoning (sentiment analysis, summarization) use the PAI Inference tool:

```typescript
import { inference } from '../skills/PAI/Tools/Inference';

const result = await inference({
  systemPrompt: 'Classify this prompt as question, command, or statement.',
  userPrompt: data.prompt || '',
  level: 'fast',        // haiku for speed
  expectJson: true,
});

if (result.success && result.parsed) {
  // Use the AI classification
}
```

Inference levels: `fast` (haiku, 15s), `standard` (sonnet, 30s), `smart` (opus, 90s).

## Test your hook

Test without restarting Claude Code by simulating an event:

```bash
# Simulate a UserPromptSubmit event
echo '{"session_id":"test","transcript_path":"/tmp/test.jsonl","hook_event_name":"UserPromptSubmit","prompt":"Test message"}' | bun ~/.claude/hooks/my-hook.ts

# Simulate a Stop event
echo '{"session_id":"test","transcript_path":"/tmp/test.jsonl","hook_event_name":"Stop"}' | bun ~/.claude/hooks/my-hook.ts
```

## Debug a hook that is not working

1. **Check the script is executable:** `ls -la ~/.claude/hooks/my-hook.ts`
2. **Validate settings.json:** `jq . ~/.claude/settings.json`
3. **Test directly:** Run the echo pipe command above and check for errors
4. **Check the path:** Ensure `${PAI_DIR}` resolves correctly in the command
5. **Restart Claude Code:** Hooks are loaded at startup. Changes require a restart.

## Avoid common mistakes

| Mistake | Consequence | Fix |
|---------|-------------|-----|
| Missing `process.exit(0)` | Hook hangs, Claude Code freezes | Always call `process.exit(0)` at the end |
| Throwing errors | Hook crashes, may block other hooks | Wrap everything in try/catch |
| Waiting for slow APIs | Hook blocks Claude Code | Use background processes for slow work |
| No stdin timeout | Hook hangs waiting for input | Add a 500ms timeout on stdin reads |
| Invalid JSON in settings.json | No hooks load at all | Validate with `jq` after editing |
| Exit code 1 | Claude Code treats the hook as failed | Always exit 0, even on errors |

## What to read next

- **[Hook Types](/developer/hook-types/)** — Complete reference of every hook event and its payload
- **[Your First Hook](/developer/first-hook/)** — Guided tutorial if you haven't written a hook yet
- **[Manage Memory](/developer/manage-memory/)** — Hooks often need to read or write memory
