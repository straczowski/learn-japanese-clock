# Audio Generation Scripts

Generate audio files from JSON time data using VoiceVox.

## Prerequisites

- Docker installed and running
- `ffmpeg` installed (for audio conversion)

## Steps

### 1. Start VoiceVox Engine

```bash
docker run -it --rm -p 50021:50021 voicevox/voicevox_engine
```

voicevox will be available at `http://localhost:50021`.

### 2. Generate WAV Files

```bash
npm run generate-voice
```

This reads `src/data/hours.json` and `src/data/minutes.json`, generates all time expression combinations, and saves WAV files to `public/sound/voice-wav/`.

### 3. Convert to WebM

```bash
npm run convert-audio
```

This converts all WAV files from `public/sound/voice-wav/` to WebM format in `public/sound/voice/`.

## Output

- WAV files: `public/sound/voice-wav/`
- WebM files: `public/sound/voice/`
