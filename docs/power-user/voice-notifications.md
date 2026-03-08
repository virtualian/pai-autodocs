---
title: Configure Voice and Notifications
description: "Set up voice feedback, adjust notification settings, and test your notification endpoints."
diataxis_type: how-to
---

<!-- Source: PAI notification server, ElevenLabs TTS integration, settings.json -->

# Configure Voice and Notifications

PAI uses ElevenLabs text-to-speech to speak task completions, phase transitions, and summaries aloud. Notifications are fire-and-forget — they never block execution. If the notification server is down or a key is missing, work continues silently.

## Set Up Voice

### 1. Get an ElevenLabs API Key

Create an account at [elevenlabs.io](https://elevenlabs.io), generate an API key, and add it to your PAI environment file:

```bash
# ~/.config/PAI/.env
ELEVENLABS_API_KEY=sk-...
```

### 2. Choose a Voice

Browse the [ElevenLabs voice library](https://elevenlabs.io/voice-library) and copy the voice ID for the voice you want. The voice ID is a string like `fTtv3eikoepIosk8dTZ5`.

### 3. Set the Voice ID

Add the voice ID to your `settings.json` under `daidentity.voiceId`:

```json
{
  "daidentity": {
    "voiceId": "fTtv3eikoepIosk8dTZ5"
  }
}
```

Restart your session for the change to take effect.

## Change Your AI's Voice

Update `daidentity.voiceId` in `settings.json` with the new voice ID and start a new session. No other changes are needed — the notification server picks up the voice ID from the payload each time.

## Test Voice Manually

Send a test notification directly to confirm everything is wired up:

```bash
curl -s -X POST http://localhost:8888/notify \
  -H "Content-Type: application/json" \
  -d '{"message": "Testing voice notifications", "voice_id": "YOUR_VOICE_ID", "voice_enabled": true}'
```

You should hear the message spoken aloud. If you get no audio, check the troubleshooting section below.

## Notification Channels

| Channel | Setup | Used for |
|---------|-------|----------|
| Voice (ElevenLabs) | API key in `.env` + voice ID in `settings.json` | Primary spoken feedback — task completions, phase transitions, summaries |
| Push (ntfy) | ntfy topic URL in settings | Mobile away-from-desk alerts |
| Desktop | OS native (no config needed) | Brief status updates |

## Disable Voice

Two options:

- **Per-payload:** Set `"voice_enabled": false` in the notification JSON. The notification server will skip TTS for that message.
- **Globally:** Remove `daidentity.voiceId` from `settings.json`. Without a voice ID, no TTS requests are made.

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| No audio, no error | `ELEVENLABS_API_KEY` missing from `.env` | Add the key and restart the notification server |
| 4xx error from ElevenLabs | Invalid voice ID | Double-check the voice ID in the ElevenLabs dashboard |
| Connection refused on `localhost:8888` | Notification server not running | Start the notification server — check PAI startup logs |
| Audio plays but wrong voice | Stale voice ID in payload | Confirm `settings.json` has the correct `voiceId`; start a new session |
| Delayed audio | ElevenLabs latency or rate limiting | Normal for longer messages; no action needed unless persistent |

To verify the notification server is running:

```bash
curl -s http://localhost:8888/
```

A response (any response) means the server is up. Connection refused means it is not.

## What to read next

- **[Configuration Reference](/power-user/configuration/)** — All settings files, their locations, and valid values
- **[Customise Your AI](/power-user/customize-your-ai/)** — Tutorial walkthrough of basic PAI customisation
- **[Customise PAI Behaviour](/power-user/customise-behaviour/)** — Add steering rules, adjust response format, and override defaults
