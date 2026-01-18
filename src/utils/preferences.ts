import { z } from 'zod'
import { Difficulty, ClockDisplayMode } from '../types/basic'

const STORAGE_KEY = 'learn-japanese-clock'

export const loadPreferences = (): Preferences => {
  if (typeof window === 'undefined') {
    return getDefaultPreferences()
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return getDefaultPreferences()
  }

  const parsed = parseStoredPreferences(stored)
  if (!parsed) {
    return getDefaultPreferences()
  }

  return parsed
}

export const savePreferences = (preferences: Preferences): void => {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
}

const parseStoredPreferences = (stored: string): Preferences | null => {
  try {
    const parsed = JSON.parse(stored)
    return preferencesSchema.parse(parsed)
  } catch {
    return null
  }
}

const getDefaultPreferences = (): Preferences => ({
  difficulty: Difficulty.HOURS_ONLY,
  clockDisplayMode: ClockDisplayMode.ANALOG,
})

const preferencesSchema = z.object({
  difficulty: z.enum([Difficulty.HOURS_ONLY, Difficulty.HOURS_AND_HALF, Difficulty.EXACT_TIME]),
  clockDisplayMode: z.enum([ClockDisplayMode.ANALOG, ClockDisplayMode.DIGITAL]),
})

export type Preferences = z.infer<typeof preferencesSchema>
