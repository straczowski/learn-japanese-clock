import { create } from 'zustand'
import { getValidExpressions, removeWhitespace } from './utils/get-valid-expressions'
import { audioPlayer } from './audio-player'
import { getEncouragementMessage } from './utils/get-encouragement-message'
import { type Expression, Difficulty, ClockDisplayMode } from './types/basic'
import { type AppStore } from './types/app-store'

export const useStore = create<AppStore>((set, get) => ({
  timeId: null,
  userInput: '',
  result: null,
  allValidExpressions: null,
  encouragementMessage: null,
  difficulty: Difficulty.HOURS_ONLY,
  clockDisplayMode: ClockDisplayMode.ANALOG,
  generateTime: () => {
    const { difficulty } = get()
    const { hour, minute } = getHourAndMinuteBasedOnDifficulty(difficulty)
    const timeId = formatTimeId(hour, minute)
    audioPlayer.playStartSound()
    set({ timeId, userInput: '', result: null, allValidExpressions: null, encouragementMessage: null })
  },
  setUserInput: (input: string) => {
    set({ userInput: input })
  },
  submitAnswer: () => {
    const { timeId, userInput } = get()
    if (!timeId) return

    const validExpressions = getValidExpressions(timeId)
    const result = findMatchingExpression(userInput, validExpressions)
    
    if (!result) {
      handleFailure(set, validExpressions)
      return
    }

    handleSuccess(set, timeId, validExpressions, result)
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


const findMatchingExpression = (userInput: string, validExpressions: Array<Expression>): Expression | null => {
  const normalizedInput = removeWhitespace(userInput)
  return validExpressions.find(expression => expression.hiragana === normalizedInput) ?? null
}

const handleFailure = (set: (partial: AppStore | Partial<AppStore> | ((state: AppStore) => AppStore | Partial<AppStore>)) => void, validExpressions: Array<Expression>) => {
  const encouragementMessage = getEncouragementMessage()
  set({ allValidExpressions: validExpressions, result: null, encouragementMessage })
  audioPlayer.playFailSound()
}

const handleSuccess = (set: (partial: AppStore | Partial<AppStore> | ((state: AppStore) => AppStore | Partial<AppStore>)) => void, timeId: string, validExpressions: Array<Expression>, result: Expression) => {
  set({ allValidExpressions: validExpressions, result, encouragementMessage: null })
  audioPlayer.playSuccessSound()
  setTimeout(() => {
    audioPlayer.playExpression(timeId, result.romaji)
  }, 700)
}

const formatTimeId = (hour: number, minute: number): string => {
  return `${formatTwoDigits(hour)}${formatTwoDigits(minute)}`
}

const formatTwoDigits = (number: number): string => {
  return number.toString().padStart(2, '0')
}

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