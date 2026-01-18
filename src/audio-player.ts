const createAudioPlayer = () => {
  const audioCache = new Map<string, HTMLAudioElement>()

  const playExpression = (timeId: string, romaji: string) => {
    const soundId = `${timeId}_${romaji.replaceAll(" ", "_")}`
    const audioUrl = `${import.meta.env.BASE_URL}sound/voice/${soundId}.webm`
    const audio = getOrCreateAudio(audioUrl)
    audio.play()
  }

  const playStartSound = () => {
    playActionSound('game-start.mp3')
  }

  const playSuccessSound = () => {
    playActionSound('success.mp3')
  }

  const playFailSound = () => {
    playActionSound('fail.mp3')
  }

  const playActionSound = (filename: string) => {
    const audioUrl = `${import.meta.env.BASE_URL}sound/action/${filename}`
    const audio = getOrCreateAudio(audioUrl)
    audio.play()
  }

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

  return {
    playExpression,
    playStartSound,
    playSuccessSound,
    playFailSound
  }
}

export const audioPlayer = createAudioPlayer()
