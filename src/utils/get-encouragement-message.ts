const encouragementMessages = [
  'Not quite - try again!',
  'Almost there! Give it another shot',
  'Keep practicing - you\'ve got this!',
  'Not quite right, but keep going!',
  'Close! Try once more',
  'Keep trying - you\'re learning!',
  'Not this time, but don\'t give up!',
  'Almost! Try again',
  'Not quite - keep practicing!',
  'You\'re getting there - try again!',
  'Keep going - you\'re doing great!',
  'Not quite, but keep trying!',
]

export const getEncouragementMessage = (): string => {
  const randomIndex = Math.floor(Math.random() * encouragementMessages.length)
  return encouragementMessages[randomIndex]
}
