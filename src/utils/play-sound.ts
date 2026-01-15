export const playSuccessSound = () => {
  playSound('success.mp3')
}

export const playFailSound = () => {
  playSound('fail.mp3')
}

const playSound = (filename: string) => {
  const audio = getOrCreateAudio(`/sound/action/${filename}`)
  audio.play()
}

export const playExpression = (timeId: string, romaji: string) => {
  const soundId = getSoundId(timeId, romaji)
  const audio = getOrCreateAudio(`/sound/voice/${soundId}.webm`)
  audio.play()
}

const getSoundId = (timeId: string, romaji: string): string => {
  return `${timeId}_${romaji.replaceAll(" ", "_")}`
}

const audioCache = new Map<string, HTMLAudioElement>()
const getOrCreateAudio = (url: string): HTMLAudioElement => {
  if (audioCache.has(url)) {
    const cachedAudio = audioCache.get(url)
    if (cachedAudio) {
      cachedAudio.currentTime = 0
      return cachedAudio
    }
  }
  const audio = new Audio(url)
  audioCache.set(url, audio)
  return audio
}