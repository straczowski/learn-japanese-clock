import { useStore } from './store'
import { Header } from './components/Header'
import { SettingsPanel } from './components/SettingsPanel'
import { TimeDisplay } from './components/TimeDisplay'
import { AnswerForm } from './components/AnswerForm'
import { ResultDisplay } from './components/ResultDisplay'
import { ValidExpressionsList } from './components/ValidExpressionsList'
import type { Expression } from './types/basic'

const App = () => {
  const { timeId, userInput, result, allValidExpressions, encouragementMessage, difficulty, clockDisplayMode, generateTime, setUserInput, submitAnswer, setDifficulty, setClockDisplayMode } = useStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitAnswer()
  }

  return (
    <div className="min-h-screen bg-white md:bg-linear-to-br md:from-blue-50 md:via-indigo-50 md:to-purple-50 flex items-center justify-center md:p-4">
      <div className="w-full bg-white md:max-w-md md:rounded-2xl md:shadow-lg md:p-8 p-4 space-y-6 relative">

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
            className="w-full bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Start スタート
          </button>

          {timeId && (
            <>
              <TimeDisplay timeId={timeId} clockDisplayMode={clockDisplayMode} />

              <AnswerForm
                userInput={userInput}
                isDisabled={Boolean(result)}
                isFailure={Boolean(encouragementMessage)}
                onInputChange={setUserInput}
                onSubmit={handleSubmit}
              />

              {isShowingResult(result, encouragementMessage) && (
                <>
                  <ResultDisplay
                    result={result}
                    timeId={timeId}
                    encouragementMessage={encouragementMessage}
                  />
                  <ValidExpressionsList expressions={allValidExpressions} />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const isShowingResult = (result: Expression | null, encouragementMessage: string | null) => {
  return Boolean(result) || Boolean(encouragementMessage)
}

export default App
