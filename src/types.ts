export type TimeData =  Record<string, { expressions: Array<Expression> }>

export interface Expression {
  hiragana: string
  romaji: string
}
