import hoursData from '../data/hours.json'
import minutesData from '../data/minutes.json'
import type { Expression, TimeData } from '../types'

export const getValidExpressions = (timeId: string): Array<Expression> => {
  const { hour, minute } = parseTimeId(timeId)
  const hourExpressions = getExpressions(hour, hoursData)
  const minuteExpressions = getExpressions(minute, minutesData)
  
  const validExpressions: Array<Expression> = hourExpressions.flatMap(
    (hourExpression) => minuteExpressions.map(
      minuteExpression => ({
        hiragana: `${hourExpression.hiragana}${minuteExpression.hiragana}`,
        romaji: `${hourExpression.romaji}_${minuteExpression.romaji}`.replaceAll(" ", "_")
      })
    )
  )    
  return validExpressions
}

const parseTimeId = (timeId: string) => {
  const hour = timeId.slice(0, 2)
  const minute = timeId.slice(2, 4)
  return { hour, minute, }
}

const getExpressions = (key: string, data: TimeData): Array<Expression> => {
  const entry = data[key]
  if (!entry) {
    throw Error(`Coulnd not find expression for hours using ${key} as key`)
  }
  return entry.expressions
}

export const removeWhitespace = (input: string): string => {
  return input.trim().split('').filter(char => char.trim() !== '').join('')
}
