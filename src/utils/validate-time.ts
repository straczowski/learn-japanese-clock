import hoursData from '../data/hours.json'
import minutesData from '../data/minutes.json'
import type { Expressions } from '../types'

export const validateTime = (timeId: string, userInput: string): boolean => {
  const validExpressions = getValidExpressions(timeId)
  const normalizedInput = removeWhitespace(userInput)
  
  return validExpressions.some(expression => expression === normalizedInput)
}

const getValidExpressions = (timeId: string): Array<string> => {
  const { hour, minute } = parseTimeId(timeId)
  const hourExpressions = getExpressions(hour, hoursData)
  const minuteExpressions = getExpressions(minute, minutesData)
  
  const validExpressions: Array<string> = hourExpressions.flatMap(
    (hourExpression) => minuteExpressions.map(
      minuteExpression => `${hourExpression}${minuteExpression}`
    )
  )    
  return validExpressions
}

const parseTimeId = (timeId: string) => {
  const hour = timeId.slice(0, 2)
  const minute = timeId.slice(2, 4)
  return { hour, minute, }
}

const getExpressions = (key: string, data: Record<string, Expressions>): Array<string> => {
  const entry = data[key]
  if (!entry) {
    throw Error(`Coulnd not find expression for hours using ${key} as key`)
  }
  return entry.expressions.map(expr => expr.hiragana)
}

const removeWhitespace = (input: string): string => {
  return input.trim().split('').filter(char => char.trim() !== '').join('')
}
