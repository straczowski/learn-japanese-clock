import { create } from 'zustand'
import { getValidExpressions, removeWhitespace } from './utils/get-valid-expressions'
import { playSuccessSound, playFailSound, playExpression } from './utils/play-sound'
import { getEncouragementMessage } from './utils/get-encouragement-message'
import type { Expression } from './types'

export type Difficulty = 'hours-only' | 'hours-and-half' | 'exact-time'

interface AppStore {
  timeId: string | null
  userInput: string
  result: Expression | null
  allValidExpressions: Array<Expression> | null
  encouragementMessage: string | null
  difficulty: Difficulty
  generateTime: () => void
  setUserInput: (input: string) => void
  submitAnswer: () => void
  setDifficulty: (difficulty: Difficulty) => void
}

export const useStore = create<AppStore>((set, get) => ({
  timeId: null,
  userInput: '',
  result: null,
  allValidExpressions: null,
  encouragementMessage: null,
  difficulty: 'exact-time',
  generateTime: () => {
    const { difficulty } = get()
    const hour = Math.floor(Math.random() * 24)
    
    let minute: number
    if (difficulty === 'hours-only') {
      minute = 0
    } else if (difficulty === 'hours-and-half') {
      minute = Math.random() < 0.5 ? 0 : 30
    } else {
      minute = Math.floor(Math.random() * 60)
    }

    const timeId = `${hour.toString().padStart(2, '0')}${minute.toString().padStart(2, '0')}`

    set({ timeId, userInput: '', result: null, allValidExpressions: null, encouragementMessage: null })
  },
  setUserInput: (input: string) => {
    set({ userInput: input })
  },
  submitAnswer: () => {
    const { timeId, userInput } = get()
    if (!timeId) return

    const validExpressions = getValidExpressions(timeId)
    const result = validExpressions.find(expression => expression.hiragana === removeWhitespace(userInput))
    
    if (!result) {
      const encouragementMessage = getEncouragementMessage()
      set({ allValidExpressions: validExpressions, result, encouragementMessage })
      playFailSound()
      return
    } 

    set({ allValidExpressions: validExpressions, result, encouragementMessage: null })
    playSuccessSound()
    setTimeout(() => {
      playExpression(timeId, result.romaji)
    }, 700)
  },
  setDifficulty: (difficulty: Difficulty) => {
    set({ difficulty })
  },
}))
