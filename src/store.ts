import { create } from 'zustand'
import { validateTime } from './validate-time'
import { playSuccessSound, playFailSound } from './play-sound'

interface AppStore {
  timeId: string | null
  userInput: string
  validationResult: boolean | null
  generateTime: () => void
  setUserInput: (input: string) => void
  submitAnswer: () => void
}

export const useStore = create<AppStore>((set, get) => ({
  timeId: null,
  userInput: '',
  validationResult: null,
  generateTime: () => {
    const hour = Math.floor(Math.random() * 24)
    const minute = Math.floor(Math.random() * 60)
    
    const timeId = `${hour.toString().padStart(2, '0')}${minute.toString().padStart(2, '0')}`
    
    set({ timeId, userInput: '', validationResult: null })
  },
  setUserInput: (input: string) => {
    set({ userInput: input })
  },
  submitAnswer: () => {
    const { timeId, userInput } = get()
    if (!timeId) return
    
    const isValid = validateTime(timeId, userInput)
    set({ validationResult: isValid })
    
    if (isValid) {
      playSuccessSound()
    } else {
      playFailSound()
    }
  },
}))
