import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Task {
  id: string
  title: string
  priority: "high" | "medium" | "low"
}

interface CalendarSidebarProps {
  currentDate: Date
  setCurrentDate: (date: Date) => void
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

export function CalendarSidebar({ currentDate, setCurrentDate, tasks, onTaskClick }: CalendarSidebarProps) {
  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()

  const days = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(month - 1)
    } else {
      newDate.setMonth(month + 1)
    }
    setCurrentDate(newDate)
  }

  const isToday = (day: number | null) => {
    if (!day) return false
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  }

  const isSelected = (day: number | null) => {
    if (!day) return false
    return day === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear()
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6 flex flex-col">
      {/* Mini Calendar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">
            {monthNames[month]} {year}
          </h3>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")} className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")} className="h-8 w-8 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-2">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
            <div key={day} className="text-center py-1 font-medium">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => {
                if (day) {
                  const newDate = new Date(year, month, day)
                  setCurrentDate(newDate)
                }
              }}
              className={`
                h-8 w-8 text-sm rounded-md flex items-center justify-center
                ${day ? "hover:bg-gray-100" : ""}
                ${isToday(day) ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                ${isSelected(day) && !isToday(day) ? "bg-gray-200" : ""}
                ${!day ? "cursor-default" : "cursor-pointer"}
              `}
              disabled={!day}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Due Today */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Tasks Due Today</h3>
        <div className="space-y-3">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => onTaskClick(task)}
              className="flex items-center gap-3 w-full text-left p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  task.priority === "high"
                    ? "bg-red-400"
                    : task.priority === "medium"
                      ? "bg-orange-400"
                      : "bg-green-400"
                }`}
              />
              <span className="text-sm text-gray-700 truncate">{task.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
