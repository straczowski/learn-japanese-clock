import type { Expression } from '../types'

interface AnswerFormProps {
  userInput: string
  result: Expression | null
  encouragementMessage: string | null
  onInputChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export const AnswerForm = ({ userInput, result, encouragementMessage, onInputChange, onSubmit }: AnswerFormProps) => {
  const getInputClassName = () => {
    const baseClasses = 'w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 text-lg'
    
    if (result === null && encouragementMessage === null) {
      return `${baseClasses} border-gray-300 focus:border-blue-500 focus:ring-blue-200`
    }
    
    if (result !== null) {
      return `${baseClasses} border-green-300 focus:border-green-500 focus:ring-green-200`
    }
    
    return `${baseClasses} border-red-300 focus:border-red-500 focus:ring-red-200`
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        type="text"
        value={userInput}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Type the time in hiragana"
        className={getInputClassName()}
      />
      <button
        type="submit"
        className="w-full bg-linear-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        Submit
      </button>
    </form>
  )
}
