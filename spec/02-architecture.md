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
- Examples: `"0800"`, `"1300"`

**Difficulty: Hard**
- Hours: 0-23 (any hour)
- Minutes: 0-59 (any minute)
- Examples: `"0854"`, `"1322"`, `"2307"`

## Data Files Structure

**`data/hours.json`** - Hour building blocks (0-23)
**`data/minutes.json`** - Minute building blocks (0-59)

**Note:** Difficulty is NOT stored in JSON files - it's only a filter in the app settings.

## Example for Data Structure (Expressions)

```json
{
  //...
  "15": {
    "expressions": [
      {
        "hiragana": "じゅうごじ",
        "romaji": "juu-go ji"
      },
      {
        "hiragana": "さんじ",
        "romaji": "san ji"
      },
      {
        "hiragana": "ごごさんじ",
        "romaji": "gogo san ji"
      }
    ]
  }
  //
}
```

