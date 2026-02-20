---
title: Tools Reference
description: CLI tools inventory — Inference, background removal, transcription, and more.
sidebar:
  order: 15
---

<!-- Source: ~/.claude/skills/PAI/Tools/ -->

PAI includes CLI tools written in TypeScript and Python. These handle deterministic operations -- file processing, API calls, media transcription, secret scanning. Each tool is callable from the command line and from within hooks and workflows.

## Inference.ts

Unified AI inference with three speed/intelligence tiers. The primary tool for hooks and workflows that need AI reasoning.

**Location:** `~/.claude/skills/PAI/Tools/Inference.ts`

**CLI usage:**

```bash
echo "Is this a question or a command?" | bun ~/.claude/skills/PAI/Tools/Inference.ts --level fast --system "Classify as question or command"
```

**Programmatic usage:**

```typescript
import { inference } from '../skills/PAI/Tools/Inference';

const result = await inference({
  systemPrompt: 'Classify this input as positive, negative, or neutral.',
  userPrompt: inputText,
  level: 'fast',
  expectJson: true,
});
```

**Run levels:**

| Level | Model | Timeout | Use when |
|-------|-------|---------|----------|
| `fast` | haiku | 15s | Classification, yes/no decisions, simple extraction |
| `standard` | sonnet | 30s | Summarization, analysis, structured output |
| `smart` | opus | 90s | Complex reasoning, architectural review |

**Env:** `ANTHROPIC_API_KEY` (required).

---

## RemoveBg.ts

Remove backgrounds from images using the remove.bg API.

**Location:** `~/.claude/skills/PAI/Tools/RemoveBg.ts`

```bash
bun ~/.claude/skills/PAI/Tools/RemoveBg.ts --input photo.jpg --output transparent.png
```

| Flag | Description |
|------|-------------|
| `--input` | Path to input image (JPG, PNG, WebP) |
| `--output` | Path for output PNG with transparency |

**Env:** `REMOVE_BG_API_KEY` (required).

---

## AddBg.ts

Add a solid background color to a transparent PNG.

**Location:** `~/.claude/skills/PAI/Tools/AddBg.ts`

```bash
bun ~/.claude/skills/PAI/Tools/AddBg.ts --input transparent.png --output final.png --color "#FFFFFF"
```

| Flag | Description |
|------|-------------|
| `--input` | Path to transparent PNG |
| `--output` | Path for output image |
| `--color` | Hex color code for the background |

Common workflow: RemoveBg to isolate a subject, then AddBg to place it on a new background.

---

## GetTranscript.ts

Extract transcripts from YouTube videos using yt-dlp. Retrieves auto-generated or manual captions as plain text.

**Location:** `~/.claude/skills/PAI/Tools/GetTranscript.ts`

```bash
bun ~/.claude/skills/PAI/Tools/GetTranscript.ts --url "https://youtube.com/watch?v=VIDEO_ID" --output transcript.txt
```

| Flag | Description |
|------|-------------|
| `--url` | YouTube video URL |
| `--output` | Optional file path to save transcript |
| `--lang` | Language code for subtitles (default: `en`) |

**Dependency:** `yt-dlp` (`brew install yt-dlp`).

---

## extract-transcript.py

Local audio/video transcription using faster-whisper. Runs entirely on-device.

**Location:** `~/.claude/skills/PAI/Tools/extract-transcript.py`

```bash
python3 ~/.claude/skills/PAI/Tools/extract-transcript.py --input recording.mp3 --model large-v3
```

| Flag | Description |
|------|-------------|
| `--input` | Path to audio or video file (MP3, WAV, MP4, M4A) |
| `--output` | Optional file path for transcript |
| `--model` | Whisper model size: `tiny`, `base`, `small`, `medium`, `large-v3` |

**Dependency:** `faster-whisper` Python package.

:::note
This is one of the few Python tools in PAI. It exists because faster-whisper's Python bindings are significantly more mature than any TypeScript alternative for local transcription.
:::

For YouTube videos, prefer GetTranscript.ts (faster, uses existing captions). Use this tool for local audio/video files -- meeting recordings, voice memos, podcasts.

---

## YouTubeApi.ts

Query YouTube channel and video statistics via the YouTube Data API.

**Location:** `~/.claude/skills/PAI/Tools/YouTubeApi.ts`

```bash
bun ~/.claude/skills/PAI/Tools/YouTubeApi.ts --channel "CHANNEL_ID" --stats
bun ~/.claude/skills/PAI/Tools/YouTubeApi.ts --video "VIDEO_ID"
```

| Flag | Description |
|------|-------------|
| `--channel` | YouTube channel ID |
| `--video` | YouTube video ID |
| `--stats` | Return channel statistics |
| `--videos` | List recent videos |
| `--limit` | Number of videos to return (default: 5) |

**Env:** `YOUTUBE_API_KEY` (required).

---

## Voice Server API

Text-to-speech notifications via a local ElevenLabs-powered voice server.

**Endpoint:** `POST http://localhost:8888/notify`

```bash
curl -X POST http://localhost:8888/notify \
  -H "Content-Type: application/json" \
  -d '{"message":"Task completed","voice_id":"VOICE_ID","title":"PAI"}'
```

| Field | Required | Description |
|-------|----------|-------------|
| `message` | Yes | Text to speak (8-16 words optimal) |
| `voice_id` | No | ElevenLabs voice ID. Omit for default. |
| `title` | No | Display title for the notification |

**Env:** `ELEVENLABS_API_KEY` (required by the voice server process).

:::caution
Always wrap voice server calls in try/catch. The voice server is a convenience service -- it may not be running, and its absence must never cause hook failures.
:::

---

## TruffleHog

Secret scanning tool that detects exposed credentials in code and configuration files.

**Location:** System tool (`brew install trufflehog`)

```bash
trufflehog filesystem ~/.claude/ --only-verified
trufflehog git file://. --since-commit HEAD~1 --only-verified
```

| Flag | Description |
|------|-------------|
| `--only-verified` | Only report confirmed-active credentials |
| `--since-commit` | Scan commits after this ref |
| `--json` | Output as JSON |
| `--fail` | Non-zero exit if secrets found |

PAI runs TruffleHog automatically during integrity audits. Use it manually before committing sensitive configuration changes.

---

## Tool selection guide

| Need | Tool |
|------|------|
| AI reasoning in a hook | Inference.ts |
| Remove image background | RemoveBg.ts |
| Add background to transparent image | AddBg.ts |
| YouTube video transcript | GetTranscript.ts |
| Local audio/video transcript | extract-transcript.py |
| YouTube channel data | YouTubeApi.ts |
| Speak a notification | Voice Server API |
| Scan for secrets | TruffleHog |

## What to read next

- [CLI-First Architecture](/contributor/cli-first/) -- The philosophy behind building deterministic tools first
- [Write Hooks](/developer/write-hooks/) -- How to use these tools inside hooks
- [Agent Types Reference](/developer/agent-types/) -- How agents select and invoke these tools
