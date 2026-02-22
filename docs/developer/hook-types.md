---
title: Hook Types Reference
description: Complete reference for all PAI hook event types, their data payloads, and configuration options.
diataxis_type: reference
---

<!-- Source: ~/.claude/skills/PAI/SYSTEM/THEHOOKSYSTEM.md -->

This is the complete reference for all 8 hook event types in PAI. Each entry covers the event trigger, stdin payload, and PAI's production hooks for that event.

## Configuration format

Hooks are registered in `~/.claude/settings.json` under the `hooks` key:

```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "ToolName",
        "hooks": [
          { "type": "command", "command": "${PAI_DIR}/hooks/my-hook.ts" }
        ]
      }
    ]
  }
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `type` | Yes | Always `"command"` |
| `command` | Yes | Path to hook script. Supports `${PAI_DIR}` and other env vars. |
| `matcher` | No | Tool name filter. Only applies to `PreToolUse` and `PostToolUse`. |

**Matcher values:** A specific tool name (e.g., `"Bash"`), `"*"` for all tools, or omit for all events of this type.

**Execution order:** Hooks within the same event execute sequentially in array order. Non-zero exit codes do not abort the chain.

**Environment variables:** Hooks inherit `PAI_DIR`, `PROJECTS_DIR`, `ELEVENLABS_API_KEY`, and other variables from `settings.json`'s `env` section.

:::caution
Hooks must exit quickly -- target under 500ms. For slow operations, spawn a background process and exit immediately. A hanging hook will freeze Claude Code.
:::

---

## Common payload fields

Every hook event receives JSON on stdin. All events share these base fields:

| Field | Type | Description |
|-------|------|-------------|
| `session_id` | string | Unique identifier for the current conversation |
| `transcript_path` | string | Path to the session transcript file |
| `hook_event_name` | string | The event type name (e.g., `"Stop"`, `"PreToolUse"`) |

Additional fields vary by event type, documented below.

---

## SessionStart

Fires when a new Claude Code conversation begins.

**Additional fields:** `cwd` (string) -- the working directory where the session was launched.

**PAI hooks:** LoadContext (loads skills, memory, TELOS context), CheckVersion (verifies PAI version).

---

## SessionEnd

Fires when a Claude Code conversation ends.

**Payload fields:** `conversation_id` (string), `timestamp` (ISO 8601 string). Note: uses `conversation_id` rather than `session_id`.

**PAI hooks:** SessionSummary (generates session summary, persists to `MEMORY/WORK/`).

---

## UserPromptSubmit

Fires when the user submits a prompt (presses Enter).

**Additional fields:** `prompt` (string) -- the raw text the user submitted.

**PAI hooks:** ExplicitRatingCapture (detects numeric 1-10 ratings), ImplicitSentimentCapture (AI-powered frustration/satisfaction detection), UpdateTabTitle (sets terminal tab title from prompt content).

:::tip
The `prompt` field contains exactly what the user typed. This is the most useful field for hooks that analyze or react to user input.
:::

---

## Stop

Fires when the main agent completes a response.

**Additional fields:** None beyond the base fields.

**PAI hooks:** StopOrchestrator (coordinates voice notifications, work capture, and tab state updates).

The StopOrchestrator dispatches to sub-handlers for voice output (ElevenLabs TTS), response capture (persisting work items to memory), and tab state management.

---

## SubagentStop

Fires when a subagent (spawned via the Task tool) completes its work.

**Additional fields:** None beyond the base fields.

**PAI hooks:** AgentOutputCapture (writes subagent output to `MEMORY/RESEARCH/`).

:::note
SubagentStop fires for every subagent completion. If you launch 5 parallel agents, this event fires 5 times.
:::

---

## PreToolUse

Fires before a tool executes. This is the primary event type for `matcher` filtering.

**Additional fields:**

| Field | Type | Description |
|-------|------|-------------|
| `tool_name` | string | Tool about to execute (e.g., `"Bash"`, `"Write"`, `"Read"`) |
| `tool_input` | object | Input arguments being passed to the tool |

**PAI hooks:**

| Hook | Matcher | Purpose |
|------|---------|---------|
| SecurityValidator | `Bash` | Validates bash commands against security rules |
| SetQuestionTab | `AskUserQuestion` | Updates tab state when Claude asks a question |

**Configuration example:**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": "${PAI_DIR}/hooks/security-validator.ts" }
        ]
      },
      {
        "matcher": "AskUserQuestion",
        "hooks": [
          { "type": "command", "command": "${PAI_DIR}/hooks/set-question-tab.ts" }
        ]
      }
    ]
  }
}
```

---

## PostToolUse

Fires after a tool completes execution.

**Additional fields:**

| Field | Type | Description |
|-------|------|-------------|
| `tool_name` | string | Name of the tool that executed |
| `tool_input` | object | Input arguments that were passed |
| `tool_output` | string/object | The tool's output |
| `error` | string/null | Error message if the tool failed, `null` otherwise |

**PAI hooks:** Not currently configured. Available for custom hooks.

---

## PreCompact

Fires before Claude Code performs context compaction (when the conversation exceeds the context window).

**Additional fields:** None beyond the base fields.

**PAI hooks:** Not currently configured.

:::note
PreCompact is useful for persisting critical state before context compression. If you have data that must survive compaction, save it in this event.
:::

---

## Quick reference table

| Event | Fires When | `prompt` | `tool_name` | `tool_output` | `matcher` |
|-------|------------|:--------:|:-----------:|:-------------:|:---------:|
| `SessionStart` | Conversation begins | -- | -- | -- | -- |
| `SessionEnd` | Conversation ends | -- | -- | -- | -- |
| `UserPromptSubmit` | User presses Enter | Yes | -- | -- | -- |
| `Stop` | Main agent finishes | -- | -- | -- | -- |
| `SubagentStop` | Subagent finishes | -- | -- | -- | -- |
| `PreToolUse` | Before tool runs | -- | Yes | -- | Yes |
| `PostToolUse` | After tool runs | -- | Yes | Yes | Yes |
| `PreCompact` | Before compaction | -- | -- | -- | -- |

## What to read next

- [Write Hooks](/developer/write-hooks/) -- How-to guide for creating and registering hooks
- [Write Your First Hook](/developer/first-hook/) -- Step-by-step tutorial for building your first hook
- [Architecture](/contributor/architecture/) -- How hooks fit into the broader PAI system
