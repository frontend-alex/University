import { useSwipeGesture } from "../hooks/useSwipeGesture"
import { Task } from "@/types/response"
import { TaskColors } from "@/types/enums"

interface CalendarMonthViewProps {
  currentDate: Date
  items: Task[]
  onDateSelect: (date: Date) => void
  onItemClick: (item: Task) => void
  onNavigate?: (direction: "prev" | "next") => void
}

export function CalendarMonthView({ currentDate, items, onDateSelect, onItemClick, onNavigate }: CalendarMonthViewProps) {
  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  const calendarDays = []
  const currentGridDate = new Date(startDate)

  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: () => onNavigate?.("next"),
    onSwipeRight: () => onNavigate?.("prev"),
    minSwipeDistance: 50,
  })

  for (let week = 0; week < 6; week++) {
    const weekDays = []
    for (let day = 0; day < 7; day++) {
      weekDays.push(new Date(currentGridDate))
      currentGridDate.setDate(currentGridDate.getDate() + 1)
    }
    calendarDays.push(weekDays)
  }

  const getItemsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return items.filter((item) => {
      const itemDate = new Date(item.time).toISOString().split('T')[0]
      return itemDate === dateStr
    })
  }

  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month
  }

  const getColorClass = (color?: TaskColors) => {
    const colors = {
      [TaskColors.Purple]: "bg-purple-500",
      [TaskColors.Blue]: "bg-blue-500",
      [TaskColors.Green]: "bg-green-500",
      [TaskColors.Orange]: "bg-orange-500",
      [TaskColors.Red]: "bg-red-500",
      [TaskColors.Teal]: "bg-teal-500",
      [TaskColors.Stone]: "bg-stone-500",
    }
    return colors[color as TaskColors] || "bg-gray-500"
  }

  return (
    <div className="h-full flex flex-col" {...swipeHandlers}>
      {/* Month header with day names */}
      <div className="grid grid-cols-7 py-3 bg-neutral-50 dark:bg-neutral-900 border-b border-accent">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div key={index} className="text-center">
            <span className="text-sm font-medium text-stone-400">{day}</span>
          </div>
        ))}
      </div>

      <div className="flex-1">
        {calendarDays.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 flex-1 border-b border-accent last:border-b-0">
            {week.map((date, dayIndex) => {
              const dayItems = getItemsForDate(date)
              const isCurrentMonthDate = isCurrentMonth(date)
              const isTodayDate = isToday(date)

              return (
                <div
                  key={dayIndex}
                  onClick={() => onDateSelect(date)}
                  className="flex flex-col items-center justify-start p-3 cursor-pointer hover:dark:bg-neutral-900 transition-colors active:dark:bg-neutral-900 border-r border-accent last:border-r-0"
                >
                  {/* Date number */}
                  <div className="mb-3">
                    {isTodayDate ? (
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{date.getDate()}</span>
                      </div>
                    ) : (
                      <span className={`text-lg font-normal ${isCurrentMonthDate ? "" : "text-stone-500"}`}>
                        {date.getDate()}
                      </span>
                    )}
                  </div>

                  {/* Items indicators - dots */}
                  <div className="flex flex-wrap justify-center gap-1 min-h-[16px]">
                    {dayItems.slice(0, 4).map((item) => (
                      <div
                        key={item._id}
                        onClick={(e) => {
                          e.stopPropagation()
                          onItemClick(item)
                        }}
                        className={`w-2 h-2 rounded-full ${getColorClass(item.color)} hover:scale-125 transition-transform`}
                      />
                    ))}
                    {dayItems.length > 4 && <div className="w-2 h-2 rounded-full bg-gray-400" />}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}