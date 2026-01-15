import { useStore } from './store'
import { playExpression } from './utils/play-sound'

function App() {
  const { timeId, userInput, result, allValidExpressions, generateTime, setUserInput, submitAnswer } = useStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitAnswer()
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-6">
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
            Start
          </button>

          {timeId && (
            <>
              <div className="mt-6 p-6 bg-linear-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 text-center">
                <p className="text-4xl font-bold text-green-700 font-mono">
                  {timeId.slice(0, 2)}:{timeId.slice(2, 4)}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type the time in hiragana"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-lg"
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
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5"
                          >
                            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.5c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2h1.94l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06zM19.12 8.12l-1.42 1.42c.37.37.7.8.97 1.28.28.5.48 1.05.58 1.62.1.58.1 1.18 0 1.76-.1.57-.3 1.12-.58 1.62-.27.48-.6.91-.97 1.28l1.42 1.42c.63-.63 1.18-1.37 1.61-2.19.44-.84.74-1.75.89-2.71.15-.96.15-1.94 0-2.9-.15-.96-.45-1.87-.89-2.71-.43-.82-.98-1.56-1.61-2.19zM16.24 11.24l-1.42 1.42c.2.2.36.45.48.72.12.27.19.56.19.86 0 .3-.07.59-.19.86-.12.27-.28.52-.48.72l1.42 1.42c.37-.37.68-.81.92-1.3.24-.49.4-1.02.45-1.58.05-.56.05-1.12 0-1.68-.05-.56-.21-1.09-.45-1.58-.24-.49-.55-.93-.92-1.3z" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      'False'
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
