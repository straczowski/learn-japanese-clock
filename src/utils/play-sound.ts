const playSound = (filename: string) => {
  const audio = new Audio(`/sound/action/${filename}`)
  audio.play().catch(() => {})
}

export const playSuccessSound = () => {
  playSound('success.mp3')
}

export const playFailSound = () => {
  playSound('fail.mp3')
}
