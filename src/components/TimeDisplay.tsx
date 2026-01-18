import Clock from 'react-clock'
import 'react-clock/dist/Clock.css'
import { ClockDisplayMode } from '../types/basic'

interface TimeDisplayProps {
  timeId: string
  clockDisplayMode: ClockDisplayMode
}

export const TimeDisplay = ({ timeId, clockDisplayMode }: TimeDisplayProps) => {
  const hours = timeId.slice(0, 2)
  const minutes = timeId.slice(2, 4)

  if (clockDisplayMode === ClockDisplayMode.ANALOG) {
    const date = new Date()
    const hoursNumber = Number.parseInt(hours, 10)
    date.setHours(hoursNumber)
    date.setMinutes(Number.parseInt(minutes, 10))
    date.setSeconds(0)
    date.setMilliseconds(0)

    const amPm = hoursNumber < 12 ? 'A.M.' : 'P.M.'

    return (
      <div className="mt-6 p-6 bg-linear-to-br from-purple-950 to-pink-950 rounded-xl border-2 border-purple-800 text-center shadow-inner flex flex-col items-center">
        <Clock
          value={date}
          size={200}
          renderSecondHand={false}
          renderNumbers={true}
          minuteHandLength={70}
          minuteHandWidth={3}
          minuteMarksLength={8}
          minuteMarksWidth={2}
          hourHandLength={50}
          hourHandWidth={4}
          hourMarksLength={10}
          hourMarksWidth={7}
          className="analog-clock-white"
        />
        <p className="mt-4 text-lg font-semibold text-white">
          {amPm}
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6 p-6 bg-linear-to-br from-purple-950 to-pink-950 rounded-xl border-2 border-purple-800 text-center shadow-inner">
      <p className="text-5xl font-bold text-white font-mono tracking-wider drop-shadow-[0_0_12px_rgba(244,114,182,0.6)]">
        {hours}:{minutes}
      </p>
    </div>
  )
}
