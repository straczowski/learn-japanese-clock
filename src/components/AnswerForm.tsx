import { mergeClasses } from '../utils/merge-classes'

interface AnswerFormProps {
  userInput: string
  isDisabled: boolean
  isFailure: boolean
  onInputChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export const AnswerForm = ({ userInput, isDisabled, isFailure, onInputChange, onSubmit }: AnswerFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        type="text"
        value={userInput}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Type the time in hiragana"
        className={getInputClassName(isDisabled, isFailure)}
        disabled={isDisabled}
      />
      <button
        type="submit"
        className={getButtonClassName(isDisabled)}
        disabled={isDisabled}
      >
        Submit
      </button>
    </form>
  )
}

const getInputClassName = (isDisabled: boolean, isFailure: boolean) => {
  const isNeutral = isDisabled && !isFailure
  const isSuccess = !isDisabled && !isFailure
  return mergeClasses(
    'w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 text-lg',
    {
      'border-gray-300 focus:border-blue-500 focus:ring-blue-200': isNeutral,
      'border-green-300 focus:border-green-500 focus:ring-green-200 disabled:opacity-60 disabled:cursor-not-allowed': isSuccess,
      'border-red-300 focus:border-red-500 focus:ring-red-200': isFailure
    }
  )
}

const getButtonClassName = (isDisabled: boolean) => {
  return mergeClasses(
    'w-full text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all duration-200',
    {
      'bg-gray-400 cursor-not-allowed opacity-60': isDisabled,
      'bg-linear-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer': !isDisabled
    }
  )
}
