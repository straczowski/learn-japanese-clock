export interface HourData {
  expressions: Array<{
    hiragana: string
    romaji: string
  }>
}

export interface MinuteData {
  expressions: Array<{
    hiragana: string
    romaji: string
  }>
}

export interface Pattern {
  id: string
  template: string
  context: {
    minute?: number | 'any'
    prefix?: 'gozen' | 'gogo'
  }
}
  