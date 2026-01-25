# Learn Japanese Clock

A web application for learning the Japanese clock/time expressions.

## Core Flow
1. User presses "Start" button → app generates a random time
2. Time is displayed (analog or digital format)
3. User types the time in hiragana
4. On submit:
   - Input is evaluated (turns red if incorrect, green if correct)
   - Voice plays the correct pronunciation (reinforcement after attempt)
   - suggests valid expressions after every try

## Settings
- **Clock format**: Toggle between analog and digital clock display
- **Analog prefix**: Option to show "gozen" (a.m.) or "gogo" (p.m.) prefix for analog times
- **Difficulty levels**:
  - **Easy**: Only full hours (e.g., 3:00) 
  - **Mid**: full hours and half hours (e.g., 3:30)
  - **Hard**: Exact times (e.g., 22:54)

## Learning Design Notes
- Voice plays **on submit** to reinforce correct pronunciation after the learner's attempt (active recall)
- All valid Expressions are shown after each try
- Sound Button lets play the Audio again
