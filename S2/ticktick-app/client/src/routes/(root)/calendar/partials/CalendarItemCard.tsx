import { Task } from "@/types/response"
import { TaskColors } from "@/types/enums"

interface CalendarItemCardProps {
  item: Task
  onClick: () => void
  compact?: boolean
  listView?: boolean
}

export function CalendarItemCard({ item, onClick, compact = false, listView = false }: CalendarItemCardProps) {
  const getColorClass = (color?: TaskColors) => {
    if (listView) {
      const colors = {
        [TaskColors.Purple]: "border-l-purple-500 bg-purple-50",
        [TaskColors.Blue]: "border-l-blue-500 bg-blue-50",
        [TaskColors.Green]: "border-l-green-500 bg-green-50",
        [TaskColors.Orange]: "border-l-orange-500 bg-orange-50",
        [TaskColors.Red]: "border-l-red-500 bg-red-50",
        [TaskColors.Teal]: "border-l-teal-500 bg-teal-50",
        [TaskColors.Stone]: "border-l-stone-500 bg-stone-50",
      }
      return colors[color as TaskColors] || "border-l-gray-500 bg-gray-50"
    }

    const colors = {
      [TaskColors.Purple]: "border-l-purple-400 bg-purple-50 text-purple-900",
      [TaskColors.Blue]: "border-l-blue-400 bg-blue-50 text-blue-900",
      [TaskColors.Green]: "border-l-green-400 bg-green-50 text-green-900",
      [TaskColors.Orange]: "border-l-orange-400 bg-orange-50 text-orange-900",
      [TaskColors.Red]: "border-l-red-400 bg-red-50 text-red-900",
      [TaskColors.Teal]: "border-l-teal-400 bg-teal-50 text-teal-900",
      [TaskColors.Stone]: "border-l-stone-400 bg-stone-50 text-stone-900",
    }
    return colors[color as TaskColors] || "border-l-gray-400 bg-gray-50 text-gray-900"
  }

  const formatTime = (time: string | Date | undefined) => {
    if (!time) return '';
    
    if (typeof time === 'string' && time.match(/^\d{2}:\d{2}$/)) {
      return time;
    }
    
    const dateObj = typeof time === 'string' ? new Date(time) : time;
    return dateObj.toLocaleTimeString([], {month: "long", day: "2-digit", hour: '2-digit', minute: '2-digit' });
  }

  if (listView) {
    return (
      <div
        onClick={onClick}
        className={`p-4 border-l-4 ${getColorClass(item.color)} cursor-pointer hover:bg-opacity-80 transition-all active:scale-[0.98]`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-base mb-1">{item.title}</h4>
            {item.time && <p className="text-sm text-gray-600 mb-2">{formatTime(item.time)}</p>}
            {item.description && <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>}
          </div>
          <div className="flex flex-col items-end space-y-1 ml-3">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full font-medium text-gray-700">{item.type}</span>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                item.priority === "high"
                  ? "bg-red-100 text-red-700"
                  : item.priority === "medium"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-green-100 text-green-700"
              }`}
            >
              {item.priority}
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (compact) {
    return (
      <div
        onClick={onClick}
        className={`p-1 lg:p-2 text-xs rounded border-l-4 ${getColorClass(
          item.color,
        )} cursor-pointer hover:opacity-80 transition-opacity mb-1`}
      >
        <div className="flex items-center gap-1">
          <div className="font-medium flex-1 truncate text-xs lg:text-sm">{item.title}</div>
          {item.type === "task" && <span className="text-xs opacity-60 flex-shrink-0 hidden lg:inline">Task</span>}
        </div>
        {item.time && <div className="text-xs opacity-75 mt-1 hidden lg:block">{formatTime(item.time)}</div>}
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className={`p-3 lg:p-4 mb-2 rounded border-l-4 ${getColorClass(
        item.color,
      )} cursor-pointer hover:opacity-80 transition-opacity`}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="font-medium flex-1">{item.title}</div>
        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{item.type}</span>
        <span
          className={`text-xs px-2 py-1 rounded ${
            item.priority === "high"
              ? "bg-red-100 text-red-700"
              : item.priority === "medium"
                ? "bg-orange-100 text-orange-700"
                : "bg-green-100 text-green-700"
          }`}
        >
          {item.priority}
        </span>
      </div>
      {item.time && <div className="text-xs opacity-75 mt-1">{formatTime(item.time)}</div>}
      {item.description && <div className="text-sm mt-2">{item.description}</div>}
    </div>
  )
}