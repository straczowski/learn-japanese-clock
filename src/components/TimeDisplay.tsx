interface TimeDisplayProps {
  timeId: string
}

export const TimeDisplay = ({ timeId }: TimeDisplayProps) => {
  const hours = timeId.slice(0, 2)
  const minutes = timeId.slice(2, 4)

  return (
    <div className="mt-6 p-6 bg-linear-to-br from-purple-950 to-pink-950 rounded-xl border-2 border-purple-800 text-center shadow-inner">
      <p className="text-5xl font-bold text-white font-mono tracking-wider drop-shadow-[0_0_12px_rgba(244,114,182,0.6)]">
        {hours}:{minutes}
      </p>
    </div>
  )
}
