const playSound = (filename: string) => {
  const audio = new Audio(`/sound/action/${filename}`)
  audio.play()
}

export const playSuccessSound = () => {
  playSound('success.mp3')
}

export const playFailSound = () => {
  playSound('fail.mp3')
}

export const playExpression = (timeId: string, romaji: string) => {
  const soundId = getSoundId(timeId, romaji)
  const audio = new Audio(`/public/sound/voice/${soundId}.webm`)
  audio.play()
}

const getSoundId = (timeId: string, romaji: string): string => {
  return `${timeId}_${romaji.replaceAll(" ", "_")}`
}