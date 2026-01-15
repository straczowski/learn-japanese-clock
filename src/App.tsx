import { useState, useRef, useEffect } from 'react'
import { useStore } from './store'
import { playExpression } from './utils/play-sound'
import speakerIcon from './assets/speaker.svg'
import settingsIcon from './assets/settings.svg'
import type { Difficulty } from './store'

function App() {
  const { timeId, userInput, result, allValidExpressions, encouragementMessage, difficulty, generateTime, setUserInput, submitAnswer, setDifficulty } = useStore()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const settingsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false)
      }
    }

    if (isSettingsOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSettingsOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitAnswer()
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-6 relative">
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="absolute top-0 right-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Settings"
        >
          <img src={settingsIcon} alt="Settings" className="w-10 h-10" />
        </button>

        {isSettingsOpen && (
          <div ref={settingsRef} className="absolute top-10 right-0 bg-white rounded-xl shadow-xl border-2 border-gray-200 p-6 z-10 w-72">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Settings</h2>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <div className="space-y-2">
                {(['hours-only', 'hours-and-half', 'exact-time'] as Difficulty[]).map((level) => (
                  <label key={level} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="difficulty"
                      value={level}
                      checked={difficulty === level}
                      onChange={() => setDifficulty(level)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      {level === 'hours-only' && 'Hours Only'}
                      {level === 'hours-and-half' && 'Hours and Half'}
                      {level === 'exact-time' && 'Exact Time'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Learn Japanese Clock
          </h1>
          <p className="text-gray-600 text-sm">
            Practice telling time in Japanese
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={generateTime}
            className="w-full bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Start スタート
          </button>

          {timeId && (
            <>
              <div className="mt-6 p-6 bg-linear-to-br from-purple-950 to-pink-950 rounded-xl border-2 border-purple-800 text-center shadow-inner">
                <p className="text-5xl font-bold text-white font-mono tracking-wider drop-shadow-[0_0_12px_rgba(244,114,182,0.6)]">
                  {timeId.slice(0, 2)}:{timeId.slice(2, 4)}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type the time in hiragana"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 text-lg ${
                    result === null
                      ? 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                      : result
                        ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                        : 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  }`}
                />
                <button
                  type="submit"
                  className="w-full bg-linear-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Submit
                </button>
              </form>

              {result !== null && (
                <>
                  <div
                    className={`p-4 rounded-xl text-center font-semibold ${
                      result
                        ? 'bg-green-100 text-green-800 border-2 border-green-300'
                        : 'bg-red-100 text-red-800 border-2 border-red-300'
                    }`}
                  >
                    {result ? (
                      <div className="flex items-center justify-center gap-3">
                        <span>{result.hiragana}</span>
                        <button
                          onClick={() => timeId && playExpression(timeId, result.romaji)}
                          className="p-1.5 hover:bg-green-200 rounded-full transition-colors"
                          aria-label="Play pronunciation"
                        >
                          <img src={speakerIcon} alt="Play pronunciation" className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      encouragementMessage
                    )}
                  </div>
                  {allValidExpressions && allValidExpressions.length > 0 && (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-xs text-gray-500 mb-3 text-center font-medium">All valid solutions:</p>
                      <div className="space-y-1">
                        {allValidExpressions.map((expression, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between py-1.5 px-2 border-b border-gray-200 last:border-b-0"
                          >
                            <span className="text-xs text-gray-700 font-mono">
                              {expression.hiragana}
                            </span>
                            <span className="text-xs text-gray-500 italic">
                              {expression.romaji.replaceAll("_", " ").replaceAll("-", "")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
