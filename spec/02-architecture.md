# Architecture: Time Data Structure

## Core Concept: 4-Digit Time ID

Every time is represented as a **4-digit ID** in HHMM format:
- `"0830"` = 8:30 (8 hours, 30 minutes)
- `"1300"` = 13:00 (1:00 PM)
- `"2330"` = 23:30 (11:30 PM)
- `"0000"` = 0:00 (midnight)

## Time Generation Rules

**Difficulty: Easy**
- Hours: 0-23 (any hour)
- Minutes: 0 or 30 only
- Examples: `"0800"`, `"0830"`, `"1300"`, `"1330"`

**Difficulty: Hard**
- Hours: 0-23 (any hour)
- Minutes: 0-59 (any minute)
- Examples: `"0854"`, `"1322"`, `"2307"`

## Data Files Structure

**`data/hours.json`** - Hour building blocks (0-23)
**`data/minutes.json`** - Minute building blocks (0-59)
**`data/patterns.json`** - Expression patterns/rules for combining hours and minutes

**Note:** Difficulty is NOT stored in JSON files - it's only a filter in the app settings.

## Hour Conversion Logic

From 4-digit time ID, determine:
- **24-hour hour**: Extract first 2 digits (0-23)
- **12-hour hour**: Convert 24h to 12h format
  - 0 → 12 (midnight)
  - 1-11 → 1-11 (AM)
  - 12 → 12 (noon)
  - 13-23 → 1-11 (PM)
- **Prefix (gozen/gogo)**: Determined by 24-hour hour
  - 0-11 → "gozen" (AM)
  - 12-23 → "gogo" (PM)

**Examples:**
- `"0830"` → Hour 8 (24h), Hour 8 (12h), Prefix: "gozen"
- `"1300"` → Hour 13 (24h), Hour 1 (12h), Prefix: "gogo"
- `"0000"` → Hour 0 (24h), Hour 12 (12h), Prefix: "gozen"

### Example: `data/hours.json`

Store only 12-hour format (1-12). Convert 24h hour to 12h when looking up:

```json
{
  "01": {
    "hiragana": "いち",
    "romaji": "ichi"
  },
  "02": {
    "hiragana": "に",
    "romaji": "ni"
  },
  "08": {
    "hiragana": "はち",
    "romaji": "hachi"
  },
  "12": {
    "hiragana": "じゅうに",
    "romaji": "juu-ni"
  }
  // ... hours 1-12 (convert 24h hour to 12h when looking up)
}
```

### Example: `data/minutes.json`

```json
{
  "00": {
    "expressions": [
      {
        "hiragana": "",
        "romaji": ""
      }
    ]
  },
  "30": {
    "expressions": [
      {
        "hiragana": "はん",
        "romaji": "han"
      },
      {
        "hiragana": "さんじゅうふん",
        "romaji": "san-juu-fun"
      }
    ]
  },
  "15": {
    "expressions": [
      {
        "hiragana": "じゅうごふん",
        "romaji": "juu-go-fun"
      }
    ]
  },
  "54": {
    "expressions": [
      {
        "hiragana": "ごじゅうよんふん",
        "romaji": "go-juu-yon-fun"
      }
    ]
  }
  // ... all minute values 0-59
}
```

### Example: `data/patterns.json`

Defines how to combine hours and minutes. Patterns specify when they apply based on minute value and prefix requirement.

```json
{
  "patterns": [
    {
      "id": "hour-only",
      "template": "{hour}じ",
      "context": {
        "minute": 0
      }
    },
    {
      "id": "hour-half",
      "template": "{hour}じはん",
      "context": {
        "minute": 30
      }
    },
    {
      "id": "hour-precise-minutes",
      "template": "{hour}じ{minute}",
      "context": {
        "minute": "any"
      }
    },
    {
      "id": "gozen-hour",
      "template": "ごぜん{hour}じ",
      "context": {
        "minute": 0,
        "prefix": "gozen"
      }
    },
    {
      "id": "gozen-hour-half",
      "template": "ごぜん{hour}じはん",
      "context": {
        "minute": 30,
        "prefix": "gozen"
      }
    },
    {
      "id": "gogo-hour",
      "template": "ごご{hour}じ",
      "context": {
        "minute": 0,
        "prefix": "gogo"
      }
    },
    {
      "id": "gogo-hour-half",
      "template": "ごご{hour}じはん",
      "context": {
        "minute": 30,
        "prefix": "gogo"
      }
    }
  ]
}
```

## How It Works: Time ID to Expression

### Step 1: Parse Time ID
Time ID: `"1300"` (1:00 PM)
- Hour (24h): `13`
- Minute: `0`
- Hour (12h): `1` (13 - 12 = 1)
- Prefix: `"gogo"` (13 > 12)

### Step 2: Look Up Components
1. Load `hours.json` → get hour `"1"` → `いち`
2. Load `minutes.json` → get minute `"0"` → empty expression
3. Determine prefix: `"gogo"` (from hour 13, based on app settings for display)

### Step 3: Match Patterns
Load `patterns.json` → find patterns matching:
- Minute: `0`
- Prefix: `"gogo"` (determined from hour, if prefix display is enabled in settings)

Matching patterns:
- `gogo-hour` ✓ (minute: 0, prefix: gogo)
- `hour-only` ✓ (minute: 0, no prefix requirement)

### Step 4: Generate Expressions
For each matching pattern:
- Template: `ごご{hour}じ` or `{hour}じ`
- Replace `{hour}` with `いち`
- Results: `ごごいちじ`, `いちじ`

### Step 5: Filter by Display Settings (App Logic)
- **Prefix display**: If analog clock with prefix enabled, prefer patterns with prefix
- **Difficulty**: Easy mode only allows minutes 0 or 30; Hard mode allows all minutes

## Validation Logic

When user submits input:

1. **Get current time ID** (e.g., `"1300"`)
2. **Parse time ID**:
   - Extract hour (24h): `13`
   - Extract minute: `0`
   - Convert to 12h hour: `1`
   - Determine prefix: `"gogo"` (based on hour and display settings)
3. **Generate all valid expressions**:
   - Load `hours.json` → get hour hiragana/romaji
   - Load `minutes.json` → get minute expressions
   - Load `patterns.json` → match patterns to minute and prefix
   - Build hiragana strings by combining components
4. **Filter by display settings** (app logic, not in JSON):
   - **Difficulty**: Easy mode only allows minutes 0 or 30; Hard mode allows all minutes
   - **Prefix display**: If analog clock with prefix enabled, include/exclude patterns based on prefix requirement
5. **Normalize user input** (remove spaces, handle variations)
6. **Check if user input matches** any valid expression's hiragana
7. **If match found** → correct (green)
8. **Play audio** (separate concern - map expression to audio files by naming convention or separate mapping)

## Audio Handling (Separate from Data)

Audio is handled separately from the data structure. Options:

1. **Naming convention**: Map hiragana components to audio files by name
   - `いち` → `audio/ichi.mp3`
   - `じ` → `audio/ji.mp3`
   - `ごご` → `audio/gogo.mp3`

2. **Separate audio mapping file** (optional):
   ```json
   {
     "いち": "audio/ichi.mp3",
     "じ": "audio/ji.mp3",
     "ごご": "audio/gogo.mp3"
   }
   ```

3. **Programmatic concatenation**: Build audio sequence from expression components
   - Expression: `ごごいちじ`
   - Components: `["ごご", "いち", "じ"]`
   - Audio files: `["audio/gogo.mp3", "audio/ichi.mp3", "audio/ji.mp3"]`
   - Concatenate and play using Web Audio API

**Benefits:**
- ✅ Data files are pure (no audio references)
- ✅ Audio can be updated independently
- ✅ Minimal storage (only component files needed)
- ✅ Can generate audio for any expression on-the-fly

## Complete Example: `"0830"` (8:30 AM)

**Parse Time ID:**
- Hour (24h): `8`
- Minute: `30`
- Hour (12h): `8`
- Prefix: `"gozen"` (8 < 12)

**App Settings:** `{ clockFormat: "analog", prefixDisplay: true, difficulty: "easy" }`

**Generated Expressions:**

1. **Pattern: `gozen-hour-half`**
   - Hiragana: `ごぜんはちじはん`
   - Context match: ✓ (minute: 30, prefix: gozen)
   - Display filter: ✓ (prefix display enabled, analog clock)
   - Difficulty filter: ✓ (minute 30 allowed in easy mode)

2. **Pattern: `hour-half`**
   - Hiragana: `はちじはん`
   - Context match: ✓ (minute: 30, no prefix requirement)
   - Display filter: ✓ (can be used with or without prefix)
   - Difficulty filter: ✓ (minute 30 allowed in easy mode)

**Result:** User can input either `ごぜんはちじはん` or `はちじはん` (both are valid solutions)

## File Structure Summary

```
data/
  ├── hours.json          # Hour building blocks (1-12) - pure hiragana/romaji
  ├── minutes.json        # Minute building blocks (0-59) - pure hiragana/romaji
  └── patterns.json       # Rules for combining hours + minutes

audio/                    # Separate audio files (not referenced in data JSON)
  ├── ichi.mp3
  ├── ni.mp3
  ├── hachi.mp3
  ├── ji.mp3
  ├── han.mp3
  ├── gozen.mp3
  ├── gogo.mp3
  ├── fun.mp3
  └── ...
```

**Note:** Data files are pure - they contain only text (hiragana/romaji). Display logic (analog/digital, gozen/gogo) and audio are handled separately by the application.

## Key Design Decisions

1. **4-digit time ID (HHMM)** - Simple, unambiguous time representation (pure number)
2. **Time is data, display is separate** - Time is a number; how it's displayed (analog/digital, gozen/gogo) is app logic
3. **Multiple expressions per time** - A single time can have multiple valid hiragana solutions
4. **Pure data files** - JSON files contain only hiragana/romaji text, no display logic or audio references
5. **Difficulty is app logic, not data** - Filter expressions by minute value in app code
6. **Gozen/gogo determined by hour** - 0-11 = gozen, 12-23 = gogo (convert to 12h)
7. **Compositional building blocks** - Hours + minutes + patterns = expressions
8. **Audio handled separately** - Audio mapping is separate from data structure
