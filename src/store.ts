import { create } from 'zustand'
import { getValidExpressions, removeWhitespace } from './utils/get-valid-expressions'
import { playSuccessSound, playFailSound, playExpression } from './utils/play-sound'
import type { Expression } from './types'

interface AppStore {
  timeId: string | null
  userInput: string
  result: Expression | null
  allValidExpressions: Array<Expression> | null
  generateTime: () => void
  setUserInput: (input: string) => void
  submitAnswer: () => void
}

export const useStore = create<AppStore>((set, get) => ({
  timeId: null,
  userInput: '',
  result: null,
  allValidExpressions: null,
  generateTime: () => {
    const hour = Math.floor(Math.random() * 24)
    const minute = Math.floor(Math.random() * 60)

    const timeId = `${hour.toString().padStart(2, '0')}${minute.toString().padStart(2, '0')}`

    set({ timeId, userInput: '', result: null, allValidExpressions: null })
  },
  setUserInput: (input: string) => {
    set({ userInput: input })
  },
  submitAnswer: () => {
    const { timeId, userInput } = get()
    if (!timeId) return

    const validExpressions = getValidExpressions(timeId)
    const result = validExpressions.find(expression => expression.hiragana === removeWhitespace(userInput))
    set({ allValidExpressions: validExpressions, result })

    if (!result) {
      playFailSound()
      return
    } 

    playSuccessSound()
    setTimeout(() => {
      playExpression(timeId, result.romaji)
    }, 700)
  },
}))
