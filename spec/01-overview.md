# Learn Japanese Clock

A web application for learning the Japanese clock/time expressions.

## Core Flow
1. User presses "Start" button → app generates a random time
2. Time is displayed (analog or digital format)
3. User types the time in hiragana
4. On submit:
   - Input is evaluated (turns red if incorrect, green if correct)
   - Voice plays the correct pronunciation (reinforcement after attempt)
   - Optionally: "Play audio" button available after time is shown (for learners who want to hear it first)

## Settings
- **Clock format**: Toggle between analog and digital clock display
- **Analog prefix**: Option to show "gozen" (a.m.) or "gogo" (p.m.) prefix for analog times
- **Difficulty levels**:
  - **Easy**: Only full hours (e.g., 3:00) and half hours (e.g., 3:30)
  - **Hard**: Exact times (e.g., 22:54)

## Learning Design Notes
- Voice plays **on submit** to reinforce correct pronunciation after the learner's attempt (active recall)
- Optional "Play audio" button allows learners to hear pronunciation before attempting (accommodates different learning styles)