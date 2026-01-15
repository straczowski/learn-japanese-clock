import { useStore } from './store'
import { Header } from './components/Header'
import { SettingsPanel } from './components/SettingsPanel'
import { TimeDisplay } from './components/TimeDisplay'
import { AnswerForm } from './components/AnswerForm'
import { ResultDisplay } from './components/ResultDisplay'
import { ValidExpressionsList } from './components/ValidExpressionsList'

const App = () => {
  const { timeId, userInput, result, allValidExpressions, encouragementMessage, difficulty, clockDisplayMode, generateTime, setUserInput, submitAnswer, setDifficulty, setClockDisplayMode } = useStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitAnswer()
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-6 relative">

        <SettingsPanel 
          difficulty={difficulty} 
          clockDisplayMode={clockDisplayMode}
          onDifficultyChange={setDifficulty} 
          onClockDisplayModeChange={setClockDisplayMode}
        />
        <Header />

        <div className="space-y-4">
          <button
            onClick={generateTime}
            className="w-full bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Start スタート
          </button>

          {timeId && (
            <>
              <TimeDisplay timeId={timeId} clockDisplayMode={clockDisplayMode} />

              <AnswerForm
                userInput={userInput}
                result={result}
                encouragementMessage={encouragementMessage}
                onInputChange={setUserInput}
                onSubmit={handleSubmit}
              />

              {(result !== null || encouragementMessage !== null) && (
                <>
                  <ResultDisplay
                    result={result}
                    timeId={timeId}
                    encouragementMessage={encouragementMessage}
                  />
                  {allValidExpressions && allValidExpressions.length > 0 && (
                    <ValidExpressionsList expressions={allValidExpressions} />
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
