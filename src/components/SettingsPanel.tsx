import { useState, useRef, useEffect } from 'react'
import settingsIcon from '../assets/settings.svg'
import { Difficulty, ClockDisplayMode } from '../types'

interface SettingsPanelProps {
  difficulty: Difficulty
  clockDisplayMode: ClockDisplayMode
  onDifficultyChange: (difficulty: Difficulty) => void
  onClockDisplayModeChange: (mode: ClockDisplayMode) => void
}

export const SettingsPanel = ({ difficulty, clockDisplayMode, onDifficultyChange, onClockDisplayModeChange }: SettingsPanelProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const difficultyOptions: Array<{ value: Difficulty; label: string }> = [
    { value: Difficulty.HOURS_ONLY, label: 'Hours Only' },
    { value: Difficulty.HOURS_AND_HALF, label: 'Hours and Half' },
    { value: Difficulty.EXACT_TIME, label: 'Exact Time' },
  ]

  const clockDisplayModeOptions: Array<{ value: ClockDisplayMode; label: string }> = [
    { value: ClockDisplayMode.DIGITAL, label: 'Digital' },
    { value: ClockDisplayMode.ANALOG, label: 'Analog' },
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-0 right-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Settings"
      >
        <img src={settingsIcon} alt="Settings" className="w-10 h-10" />
      </button>

      {isOpen && (
        <div ref={panelRef} className="absolute top-10 right-0 bg-white rounded-xl shadow-xl border-2 border-gray-200 p-6 z-10 w-72">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Settings</h2>
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <div className="space-y-2">
                {difficultyOptions.map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="difficulty"
                      value={option.value}
                      checked={difficulty === option.value}
                      onChange={() => onDifficultyChange(option.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clock Display
              </label>
              <div className="space-y-2">
                {clockDisplayModeOptions.map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="clockDisplayMode"
                      value={option.value}
                      checked={clockDisplayMode === option.value}
                      onChange={() => onClockDisplayModeChange(option.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
