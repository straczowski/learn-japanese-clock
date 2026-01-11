import hoursData from './data/hours.json'
import minutesData from './data/minutes.json'
import patternsData from './data/patterns.json'
import type { Pattern, HourData, MinuteData } from './types'

export const validateTime = (timeId: string, userInput: string): boolean => {
  const validExpressions = getValidExpressions(timeId)
  const normalizedInput = removeWhitespace(userInput)
  
  return validExpressions.some(expression => expression === normalizedInput)
}

const getValidExpressions = (timeId: string): string[] => {
  const { hour24, minute, prefix } = parseTimeId(timeId)
  const hourExpressions = getHourExpressions(hour24)
  const minuteExpressions = getMinuteExpressions(minute)
  const matchingPatterns = matchPatterns(minute, prefix)
  
  const validExpressions: string[] = []
  
  for (const pattern of matchingPatterns) {
    const needsMinute = pattern.template.includes('{minute}')
    const minuteOptions = needsMinute ? minuteExpressions : ['']
    
    for (const hourHiragana of hourExpressions) {
      for (const minuteHiragana of minuteOptions) {
        const expression = generateExpression(pattern, hourHiragana, minuteHiragana)
        if (expression && !validExpressions.includes(expression)) {
          validExpressions.push(expression)
        }
      }
    }
  }
  
  return validExpressions
}

const parseTimeId = (timeId: string) => {
  const hour24 = parseInt(timeId.slice(0, 2), 10)
  const minute = parseInt(timeId.slice(2, 4), 10)
  const hour12 = convertTo12Hour(hour24)
  const prefix = determinePrefix(hour24)
  
  return { hour24, minute, hour12, prefix }
}

const matchPatterns = (minute: number, prefix: 'gozen' | 'gogo'): Pattern[] => {
  const patterns = (patternsData as { patterns: Pattern[] }).patterns
  
  return patterns.filter(pattern => {
    const context = pattern.context
    
    if (context.minute !== undefined && context.minute !== 'any') {
      if (context.minute !== minute) return false
    }
    
    if (context.prefix !== undefined) {
      if (context.prefix !== prefix) return false
    }
    
    return true
  })
}

const generateExpression = (
  pattern: Pattern,
  hourHiragana: string,
  minuteHiragana: string
): string => {
  let expression = pattern.template
  expression = expression.replace('{hour}', hourHiragana)
  
  if (expression.includes('{minute}')) {
    expression = expression.replace('{minute}', minuteHiragana)
  }
  
  return expression
}

const getHourExpressions = (hour24: number): string[] => {
  const hourKey = hour24.toString().padStart(2, '0')
  const hourEntry = (hoursData as Record<string, HourData>)[hourKey]
  if (!hourEntry) return []
  
  return hourEntry.expressions.map(expr => expr.hiragana)
}

const getMinuteExpressions = (minute: number): string[] => {
  const minuteKey = minute.toString().padStart(2, '0')
  const minuteEntry = (minutesData as Record<string, MinuteData>)[minuteKey]
  if (!minuteEntry) return []
  
  return minuteEntry.expressions.map(expr => expr.hiragana)
}

const convertTo12Hour = (hour24: number): number => {
  if (hour24 === 0) return 12
  if (hour24 >= 1 && hour24 <= 12) return hour24
  return hour24 - 12
}

const determinePrefix = (hour24: number): 'gozen' | 'gogo' => {
  return hour24 >= 0 && hour24 < 12 ? 'gozen' : 'gogo'
}

const removeWhitespace = (input: string): string => {
  return input.trim().split('').filter(char => char.trim() !== '').join('')
}

