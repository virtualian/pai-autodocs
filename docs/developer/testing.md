---
title: Test PAI Components
description: Write and run tests for skills, hooks, and CLI tools in PAI.
diataxis_type: how-to
---

<!-- Source: PAI testing practices, Bun test runner, hook event simulation -->

# Test PAI Components

PAI components — tools, hooks, and skills — each require different testing strategies. Tools are the most testable (deterministic I/O), hooks are testable via stdin simulation, and skills require manual acceptance testing. This guide covers all three.

## Test CLI tools

Tools produce JSON on stdout and use exit codes. This makes them straightforward to test with either Bun's test runner or simple bash assertions.

### Bash assertions

```bash
# Test expected output structure
result=$(bun ~/.claude/skills/QuickNote/Tools/WordCount.ts test-file.md)
echo "$result" | jq '.words'   # should output a number
echo "$result" | jq '.lines'   # should output a number
echo "$result" | jq '.file'    # should output the file path

# Test exit code on success
bun ~/.claude/skills/QuickNote/Tools/WordCount.ts test-file.md
echo $?  # should be 0

# Test exit code on missing file
bun ~/.claude/skills/QuickNote/Tools/WordCount.ts /nonexistent 2>/dev/null
echo $?  # should be 1

# Test usage output with no arguments
bun ~/.claude/skills/QuickNote/Tools/WordCount.ts 2>&1 | grep -q "Usage"
echo $?  # should be 0
```

### Bun test runner

For tools that warrant more structured tests, create a test file alongside the tool:

```typescript
// Tools/WordCount.test.ts
import { describe, it, expect } from 'bun:test';
import { $ } from 'bun';

const TOOL = `${import.meta.dir}/WordCount.ts`;

describe('WordCount', () => {
  it('counts words in a file', async () => {
    await Bun.write('/tmp/test-wc.md', 'one two three four five');
    const result = await $`bun ${TOOL} /tmp/test-wc.md`.json();
    expect(result.words).toBe(5);
    expect(result.lines).toBe(1);
  });

  it('exits 1 on missing file', async () => {
    const proc = Bun.spawn(['bun', TOOL, '/nonexistent'], {
      stderr: 'pipe',
    });
    const code = await proc.exited;
    expect(code).toBe(1);
  });

  it('exits 1 with no arguments', async () => {
    const proc = Bun.spawn(['bun', TOOL], { stderr: 'pipe' });
    const code = await proc.exited;
    expect(code).toBe(1);
  });
});
```

Run with:

```bash
bun test ~/.claude/skills/QuickNote/Tools/WordCount.test.ts
```

## Test hooks

Hooks receive session context as JSON on stdin. Simulate this by piping JSON directly:

```bash
# Simulate a Stop event
echo '{"session_id":"test-123","transcript_path":"/tmp/test.jsonl","hook_event_name":"Stop"}' \
  | bun ~/.claude/hooks/my-hook.ts
```

For hooks that read the transcript file, create a minimal transcript first:

```bash
# Create a minimal transcript
echo '{"role":"user","message":"test prompt"}' > /tmp/test.jsonl
echo '{"role":"assistant","message":"test response"}' >> /tmp/test.jsonl

# Run the hook with a transcript reference
echo '{"session_id":"test-456","transcript_path":"/tmp/test.jsonl","hook_event_name":"Stop"}' \
  | bun ~/.claude/hooks/my-hook.ts
```

Verify hook behavior by checking:

- Exit code (0 = success)
- Any files the hook creates or modifies
- Any stdout output the hook produces (shown to the user in session)

## Test skills

Skills involve AI reasoning, so they require manual acceptance testing. The process is:

1. **Start a PAI session** in Claude Code.
2. **Enter a prompt** that matches the skill's `USE WHEN` triggers.
3. **Verify activation** — confirm the skill was selected during the THINK phase. The Algorithm output will show which skills were activated.
4. **Verify workflow selection** — confirm the correct workflow was routed to.
5. **Verify output** — confirm the skill produced the expected result (files created, content generated, actions taken).

### What to check during skill testing

| Check | How to verify |
|-------|---------------|
| Skill activates on matching prompt | THINK phase output lists the skill |
| Skill does NOT activate on unrelated prompt | THINK phase output omits the skill |
| Correct workflow selected | Algorithm output shows the expected workflow file |
| Tools execute successfully | No error output, expected files/data produced |
| Customizations applied | Output reflects user-specific overrides from `SKILLCUSTOMIZATIONS/` |

## Test workflows

Workflows are markdown files describing sequential steps. Test them by verifying each step can execute independently:

1. **Read the workflow file** and list every step.
2. **Check file paths** — every file path referenced in the workflow must exist or be creatable.
3. **Check tool references** — every tool called in the workflow must exist and be executable.
4. **Check output format** — if the workflow specifies an output format, verify an example matches the spec.
5. **Run tools in isolation** — execute each tool referenced in the workflow with sample inputs and verify JSON output.

```bash
# Example: verify all tools in a skill are executable
for tool in ~/.claude/skills/QuickNote/Tools/*.ts; do
  if [ -x "$tool" ]; then
    echo "OK: $tool"
  else
    echo "FAIL: $tool is not executable"
  fi
done

# Verify all tools have companion help files
for tool in ~/.claude/skills/QuickNote/Tools/*.ts; do
  help="${tool%.ts}.help.md"
  if [ -f "$help" ]; then
    echo "OK: $help"
  else
    echo "FAIL: missing $help"
  fi
done
```

## Common mistakes

| Mistake | Symptom | Fix |
|---------|---------|-----|
| Tool not made executable | `Permission denied` when skill runs tool | `chmod +x Tools/ToolName.ts` |
| Missing `.help.md` companion | PAI cannot determine tool usage; may call it incorrectly | Create `ToolName.help.md` alongside `ToolName.ts` |
| Invalid JSON in `settings.json` | Skill fails to load or behaves unexpectedly | Validate with `cat settings.json \| jq .` |
| Hook not registered in `settings.json` | Hook never fires despite correct code | Add hook entry to `~/.claude/settings.json` under the appropriate event |
| Tool outputs non-JSON to stdout | Skill cannot parse tool result | Ensure only `JSON.stringify()` output goes to stdout; use `console.error()` for messages |
| Testing with stale skill cache | Old version of skill activates | Start a new session — the routing table is built fresh each time |

## Structured testing approach

Layer your testing from most to least automatable:

1. **Unit test tools** — Fully automatable. Test with Bun's test runner or bash assertions. Run these on every change.
2. **Integration test hooks** — Semi-automatable. Simulate events by piping JSON to stdin. Verify side effects (files created, output produced).
3. **Acceptance test skills** — Manual. Start a session, trigger the skill, verify end-to-end behavior. Run these when changing skill routing or workflows.

This layering means most of your test effort goes into the most testable components (tools), while skills get lighter but still deliberate verification.

## What to read next

- **[Your First Skill](/developer/first-skill/)** — Build a skill to practice testing against.
- **[Write Hooks](/developer/write-hooks/)** — Understand hook structure so you can test hooks effectively.
- **[Your First Hook](/developer/first-hook/)** — Step-by-step hook tutorial with testable output.
