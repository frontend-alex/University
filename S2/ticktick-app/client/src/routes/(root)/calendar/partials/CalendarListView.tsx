"use client"

import { Task } from "@/types/response"
import { CalendarItemCard } from "./CalendarItemCard"
import { TaskColors } from "@/types/enums"

interface CalendarListViewProps {
  items: Task[]
  onItemClick: (item: Task) => void
}

export function CalendarListView({ items, onItemClick }: CalendarListViewProps) {
  const sortedItems = items.sort((a, b) => {
    const dateA = new Date(a.time)
    const dateB = new Date(b.time)
    return dateA.getTime() - dateB.getTime()
  })

  // Group items by date
  const groupedItems = sortedItems.reduce(
    (groups, item) => {
      const date = new Date(item.time).toISOString().split('T')[0]
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(item)
      return groups
    },
    {} as Record<string, Task[]>,
  )

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    }
  }

  const getColorClass = (color?: TaskColors) => {
    const colors = {
      [TaskColors.Purple]: "border-l-purple-400 bg-purple-50",
      [TaskColors.Blue]: "border-l-blue-400 bg-blue-50",
      [TaskColors.Green]: "border-l-green-400 bg-green-50",
      [TaskColors.Orange]: "border-l-orange-400 bg-orange-50",
      [TaskColors.Red]: "border-l-red-400 bg-red-50",
      [TaskColors.Teal]: "border-l-teal-400 bg-teal-50",
      [TaskColors.Stone]: "border-l-stone-400 bg-stone-50",
    }
    return colors[color as TaskColors] || "border-l-gray-400 bg-gray-50"
  }

  const formatTime = (time: string | Date | undefined) => {
    if (!time) return '';
    
    if (typeof time === 'string' && time.match(/^\d{2}:\d{2}$/)) {
      return time;
    }
    
    const dateObj = typeof time === 'string' ? new Date(time) : time;
    return dateObj.toLocaleTimeString([], {month: "long", day: "2-digit", hour: '2-digit', minute: '2-digit' });
  }

  if (Object.keys(groupedItems).length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-lg mb-2">📅</div>
          <p className="text-lg font-medium">No events</p>
          <p className="text-stone-400 text-sm">Your calendar is empty</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto">
      {/* Desktop Layout */}
      <div className="hidden md:block p-4 lg:p-8">
        <div className="max-w-4xl">
          {Object.entries(groupedItems).map(([date, dateItems]) => (
            <div key={date} className="mb-8">
              {/* Date header */}
              <div className="mb-4 border-b border-accent">
                <h3 className="text-lg font-medium">{formatDateHeader(date)}</h3>
              </div>

              {/* Items list */}
              <div className="space-y-2">
                {dateItems.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => onItemClick(item)}
                    className={`border-l-4 ${getColorClass(item.color)} p-4 cursor-pointer rounded-sm hover:shadow-sm transition-shadow`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <span className="text-xs px-2 py-1 rounded font-medium text-stone-400">
                            {item.type}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded font-medium ${
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
                        {item.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-1">{item.description}</p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        {item.time && <div className="text-sm text-gray-500">{formatTime(item.time)}</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="pb-6">
          {Object.entries(groupedItems).map(([date, dateItems]) => (
            <div key={date} className="mb-6">
              {/* Date header */}
              <div className="sticky top-0 bg-white px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{formatDateHeader(date)}</h3>
              </div>

              {/* Items for this date */}
              <div className="px-4 pt-2 space-y-2">
                {dateItems.map((item) => (
                  <CalendarItemCard 
                    key={item._id} 
                    item={item} 
                    onClick={() => onItemClick(item)} 
                    listView={true}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}