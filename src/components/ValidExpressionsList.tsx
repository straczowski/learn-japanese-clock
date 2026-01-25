import type { Expression } from '../types/basic'

interface ValidExpressionsListProps {
  expressions: Array<Expression> | null
}

export const ValidExpressionsList = ({ expressions }: ValidExpressionsListProps) => {
  if (!expressions || expressions.length === 0) {
    return null
  }

  const formatRomaji = (romaji: string): string => {
    return romaji.replaceAll("_", " ").replaceAll("-", "")
  }

  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
      <p className="text-xs text-gray-500 mb-3 text-center font-medium">All valid solutions:</p>
      <div className="space-y-1">
        {expressions.map((expression, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-1.5 px-2 border-b border-gray-200 last:border-b-0"
          >
            <span className="text-xs text-gray-700 font-mono">
              {expression.hiragana}
            </span>
            <span className="text-xs text-gray-500 italic">
              {formatRomaji(expression.romaji)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
