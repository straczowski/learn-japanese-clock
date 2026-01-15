import { create } from 'zustand'
import { getValidExpressions, removeWhitespace } from './utils/get-valid-expressions'
import { playSuccessSound, playFailSound, playExpression } from './utils/play-sound'
import { getEncouragementMessage } from './utils/get-encouragement-message'
import { type Expression, Difficulty, ClockDisplayMode } from './types'

interface AppStore {
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

export const useStore = create<AppStore>((set, get) => ({
  timeId: null,
  userInput: '',
  result: null,
  allValidExpressions: null,
  encouragementMessage: null,
  difficulty: Difficulty.EXACT_TIME,
  clockDisplayMode: ClockDisplayMode.DIGITAL,
  generateTime: () => {
    const { difficulty } = get()
    const { hour, minute } = getHourAndMinuteBasedOnDifficulty(difficulty)
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
      set({ allValidExpressions: validExpressions, result: null, encouragementMessage })
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
    set({ 
      difficulty,
      timeId: null,
      userInput: '',
      result: null,
      allValidExpressions: null,
      encouragementMessage: null
    })
  },
  setClockDisplayMode: (mode: ClockDisplayMode) => {
    set({ clockDisplayMode: mode })
  },
}))


const getHourAndMinuteBasedOnDifficulty = (difficulty: Difficulty): { hour: number, minute: number } => {
  switch (difficulty) {
    case Difficulty.HOURS_ONLY:
      return { hour: Math.floor(Math.random() * 24), minute: 0 }
    case Difficulty.HOURS_AND_HALF:
      return { hour: Math.floor(Math.random() * 24), minute: Math.random() < 0.5 ? 0 : 30 }
    case Difficulty.EXACT_TIME:
      return { hour: Math.floor(Math.random() * 24), minute: Math.floor(Math.random() * 60) }
  }
}