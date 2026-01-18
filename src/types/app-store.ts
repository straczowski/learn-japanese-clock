import { type Expression, Difficulty, ClockDisplayMode } from './basic'

export interface AppStore {
  timeId: string | null
  userInput: string
  result: Expression | null
  allValidExpressions: Array<Expression> | null
  encouragementMessage: string | null
  difficulty: Difficulty
  clockDisplayMode: ClockDisplayMode
  generateTime: () => void
  setUserInput: (input: string) => void
  submitAnswer: () => void
  setDifficulty: (difficulty: Difficulty) => void
  setClockDisplayMode: (mode: ClockDisplayMode) => void
}
