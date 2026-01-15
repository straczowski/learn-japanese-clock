export type TimeData =  Record<string, { expressions: Array<Expression> }>

export interface Expression {
  hiragana: string
  romaji: string
}

export const Difficulty = {
  HOURS_ONLY: 'hours-only',
  HOURS_AND_HALF: 'hours-and-half',
  EXACT_TIME: 'exact-time',
} as const;
export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];
