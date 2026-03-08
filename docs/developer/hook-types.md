---
title: Hook Types Reference
description: Complete reference for all PAI hook event types, their data payloads, and production hooks.
diataxis_type: reference
---

<!-- Source: ~/.claude/PAI/THEHOOKSYSTEM.md -->

This is the complete reference for PAI's 7 hook event types and 21 production hooks. Each entry covers the event trigger, stdin payload, and the hooks configured for that event.

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
| `command` | Yes | Path to hook script. Supports `${PAI_DIR}` and other env vars from `settings.json`. |
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
| `transcript_path` | string | Path to the session transcript file (JSONL) |
| `hook_event_name` | string | The event type name (e.g., `"Stop"`, `"PreToolUse"`) |

Additional fields vary by event type, documented below.

---

## SessionStart

Fires when a new Claude Code conversation begins.

**Additional fields:** `cwd` (string) -- the working directory where the session was launched.

**PAI hooks (2):**

| Hook | Purpose |
|------|---------|
| `KittyEnvPersist.hook.ts` | Persists Kitty terminal env vars to disk and resets tab title to clean state |
| `LoadContext.hook.ts` | Injects dynamic context (relationship, learning, work summary) as `<system-reminder>` at session start |

---

## SessionEnd

Fires when a Claude Code conversation ends.

**Payload fields:** Uses `conversation_id` (string) and `timestamp` (ISO 8601 string) instead of the standard `session_id`.

**PAI hooks (5):**

| Hook | Purpose |
|------|---------|
| `WorkCompletionLearning.hook.ts` | Reads PRD frontmatter and ISC criteria status, captures learning to `MEMORY/LEARNING/` for significant sessions |
| `SessionCleanup.hook.ts` | Marks PRD status as completed, sets timestamp, clears session state, resets tab |
| `RelationshipMemory.hook.ts` | Captures relationship context (observations, behaviours) to `MEMORY/RELATIONSHIP/` |
| `UpdateCounts.hook.ts` | Refreshes system counts (skills, hooks, signals, workflows) for the startup banner |
| `IntegrityCheck.hook.ts` | Runs cross-reference and system integrity checks |

---

## UserPromptSubmit

Fires when the user submits a prompt (presses Enter).

**Additional fields:** `prompt` (string) -- the raw text the user submitted.

**PAI hooks (3):**

| Hook | Purpose |
|------|---------|
| `RatingCapture.hook.ts` | Unified rating detection -- handles both explicit ratings ("7", "8 - good work") and implicit sentiment via Haiku inference. Writes to `MEMORY/SIGNALS/ratings.jsonl`. Low ratings (<6) auto-capture as learning opportunities. |
| `UpdateTabTitle.hook.ts` | Updates Kitty terminal tab title with task summary and sets orange working state. Uses Haiku inference to generate a context-appropriate gerund. |
| `SessionAutoName.hook.ts` | Infers a short descriptive name for the session from the first substantive prompt. Updates `MEMORY/STATE/session-names.json`. |

:::tip
The `prompt` field contains exactly what the user typed. This is the most useful field for hooks that analyse or react to user input.
:::

---

## Stop

Fires when the main agent completes a response.

**Additional fields:** None beyond the base fields.

**PAI hooks (5):**

| Hook | Purpose |
|------|---------|
| `LastResponseCache.hook.ts` | Caches the last assistant message to `MEMORY/STATE/last-response.txt` for RatingCapture to reference on the next UserPromptSubmit |
| `ResponseTabReset.hook.ts` | Resets Kitty tab title and colour after response -- converts working gerund to past tense, sets completed/awaiting/error colour state |
| `VoiceCompletion.hook.ts` | Sends completion message to ElevenLabs TTS voice server. Gated to main sessions only -- subagents have no kitty-sessions file, so voice is blocked. |
| `DocIntegrity.hook.ts` | Runs cross-reference and semantic drift checks on system files. Self-gating: returns instantly when no system files were modified. |
| `AlgorithmTab.hook.ts` | Shows Algorithm phase and progress counter in Kitty tab title by reading `work.json` for the most recently updated active session |

---

## PreToolUse

Fires before a tool executes. This is the primary event type for `matcher` filtering.

**Additional fields:**

| Field | Type | Description |
|-------|------|-------------|
| `tool_name` | string | Tool about to execute (e.g., `"Bash"`, `"Write"`, `"Read"`) |
| `tool_input` | object | Input arguments being passed to the tool |

**PAI hooks (4):**

| Hook | Matcher | Purpose |
|------|---------|---------|
| `SecurityValidator.hook.ts` | `Bash`, `Edit`, `Write`, `Read` | Validates operations against security patterns. Configured on 4 separate matchers for dangerous commands, sensitive file protection, and sensitive path access. |
| `SetQuestionTab.hook.ts` | `AskUserQuestion` | Updates tab state to "awaiting input" when Claude asks a question |
| `AgentExecutionGuard.hook.ts` | `Task` | Validates agent spawning against execution policies |
| `SkillGuard.hook.ts` | `Skill` | Prevents false skill invocations (e.g., blocks keybindings-help unless explicitly requested) |

**Configuration example:**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": "${PAI_DIR}/hooks/SecurityValidator.hook.ts" }
        ]
      },
      {
        "matcher": "AskUserQuestion",
        "hooks": [
          { "type": "command", "command": "${PAI_DIR}/hooks/SetQuestionTab.hook.ts" }
        ]
      },
      {
        "matcher": "Task",
        "hooks": [
          { "type": "command", "command": "${PAI_DIR}/hooks/AgentExecutionGuard.hook.ts" }
        ]
      },
      {
        "matcher": "Skill",
        "hooks": [
          { "type": "command", "command": "${PAI_DIR}/hooks/SkillGuard.hook.ts" }
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

**PAI hooks (2):**

| Hook | Matcher | Purpose |
|------|---------|---------|
| `QuestionAnswered.hook.ts` | `AskUserQuestion` | Captures the question and answer after the user responds. Used for analytics and learning from user preferences. |
| `PRDSync.hook.ts` | `Write`, `Edit` | Syncs PRD frontmatter (status, title, effort) to `MEMORY/STATE/work.json` after any Write or Edit to files in `MEMORY/WORK/`. Non-blocking, fire-and-forget. |

---

## PreCompact

Fires before Claude Code performs context compaction (when the conversation exceeds the context window).

**Additional fields:** None beyond the base fields.

**PAI hooks:** Not currently configured.

:::note
PreCompact is useful for persisting critical state before context compression. If you have data that must survive compaction, save it in this event.
:::

---

## Quick reference

| Event | Fires When | Hook Count | `prompt` | `tool_name` | `tool_output` | `matcher` |
|-------|------------|:----------:|:--------:|:-----------:|:-------------:|:---------:|
| `SessionStart` | Conversation begins | 2 | -- | -- | -- | -- |
| `SessionEnd` | Conversation ends | 5 | -- | -- | -- | -- |
| `UserPromptSubmit` | User presses Enter | 3 | Yes | -- | -- | -- |
| `Stop` | Main agent finishes | 5 | -- | -- | -- | -- |
| `PreToolUse` | Before tool runs | 4 | -- | Yes | -- | Yes |
| `PostToolUse` | After tool runs | 2 | -- | Yes | Yes | Yes |
| `PreCompact` | Before compaction | 0 | -- | -- | -- | -- |

**Total:** 21 production hooks across 7 event types.

## What to read next

- [Write Hooks](/developer/write-hooks/) -- How-to guide for creating and registering hooks
- [Your First Hook](/developer/first-hook/) -- Step-by-step tutorial for building your first hook
- [Architecture](/contributor/architecture/) -- How hooks fit into the broader PAI system
