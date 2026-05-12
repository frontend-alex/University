"use client"

interface WeekHeaderProps {
  weekDays: Date[]
}

export function WeekHeader({ weekDays }: WeekHeaderProps) {
  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  return (
    <div
      className="grid border-b border-accent flex-shrink-0"
      style={{
        gridTemplateColumns: `60px repeat(${weekDays.length}, 1fr)`,
      }}
    >
      <div className="p-2 lg:p-4"></div>
      {weekDays.map((day, index) => (
        <div key={index} className="p-2 lg:p-4 text-center relative">
          <div className="text-xs text-stone-400 uppercase tracking-wide mb-1">
            <span className="hidden sm:inline">{day.toLocaleDateString("en-US", { weekday: "short" })}</span>
            <span className="sm:hidden">{day.toLocaleDateString("en-US", { weekday: "short" }).charAt(0)}</span>
          </div>
          <div className="text-sm lg:text-lg relative flex justify-center">
            {isToday(day) ? (
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{day.getDate()}</span>
              </div>
            ) : (
              <span>{day.getDate()}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
