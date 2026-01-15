import speakerIcon from '../assets/speaker.svg'
import { playExpression } from '../utils/play-sound'
import type { Expression } from '../types'

interface ResultDisplayProps {
  result: Expression | null
  timeId: string | null
  encouragementMessage: string | null
}

export const ResultDisplay = ({ result, timeId, encouragementMessage }: ResultDisplayProps) => {
  if (result === null && encouragementMessage === null) {
    return null
  }

  const handlePlayAudio = () => {
    if (timeId && result) {
      playExpression(timeId, result.romaji)
    }
  }

  if (result) {
    return (
      <div className="p-4 rounded-xl text-center font-semibold bg-green-100 text-green-800 border-2 border-green-300">
        <div className="flex items-center justify-center gap-3">
          <span>{result.hiragana}</span>
          <button
            onClick={handlePlayAudio}
            className="p-1.5 hover:bg-green-200 rounded-full transition-colors"
            aria-label="Play pronunciation"
          >
            <img src={speakerIcon} alt="Play pronunciation" className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-xl text-center font-semibold bg-red-100 text-red-800 border-2 border-red-300">
      {encouragementMessage}
    </div>
  )
}
