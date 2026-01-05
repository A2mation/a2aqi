interface AQIScaleProps {
  currentValue: number
}

export function AQIScale({ currentValue }: AQIScaleProps) {
  const levels = [
    { label: "Good", range: "0-50", color: "bg-green-500", position: 0 },
    { label: "Moderate", range: "51-100", color: "bg-yellow-500", position: 16.6 },
    { label: "Poor", range: "101-150", color: "bg-orange-500", position: 33.2 },
    { label: "Unhealthy", range: "151-200", color: "bg-red-500", position: 49.8 },
    { label: "Severe", range: "201-300", color: "bg-purple-500", position: 66.4 },
    { label: "Hazardous", range: "301+", color: "bg-purple-800", position: 83 },
  ]

  const getIndicatorPosition = () => {
    if (currentValue <= 50) return (currentValue / 50) * 16.6
    if (currentValue <= 100) return 16.6 + ((currentValue - 50) / 50) * 16.6
    if (currentValue <= 150) return 33.2 + ((currentValue - 100) / 50) * 16.6
    if (currentValue <= 200) return 49.8 + ((currentValue - 150) / 50) * 16.6
    if (currentValue <= 300) return 66.4 + ((currentValue - 200) / 100) * 16.6
    return Math.min(83 + ((currentValue - 300) / 200) * 17, 95)
  }

  return (
    <div className="space-y-3 w-75 md:w-full">
      {/* Scale Bar */}
      <div className="relative h-3 rounded-full overflow-hidden bg-white/80 dark:bg-black/20 shadow-inner ">
        <div className="absolute inset-0 flex">
          {levels.map((level, index) => (
            <div key={index} className={`${level.color} flex-1 first:rounded-l-full last:rounded-r-full`} />
          ))}
        </div>

        {/* Current Value Indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
          style={{ left: `${getIndicatorPosition()}%` }}
        >
          <div className="w-1 h-8 bg-foreground rounded-full shadow-lg" />
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between text-[10px] md:text-xs ">
        {levels.map((level, index) => (
          <div key={index} className="flex flex-col items-center" style={{ width: "16.6%" }}>
            <span className="font-semibold text-foreground">{level.label}</span>
            <span className="text-muted-foreground mt-1">{level.range}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
