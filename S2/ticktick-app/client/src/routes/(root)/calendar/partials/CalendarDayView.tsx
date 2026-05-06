"use client"

import { useCalendarConfig } from "@/contexts/CalendarContext"
import { generateTimeSlots } from "@/config/calendarConfig"
import { CalendarItemCard } from "./CalendarItemCard"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSwipeGesture } from "../hooks/useSwipeGesture"
import { Task } from "@/types/response"

interface CalendarDayViewProps {
  currentDate: Date
  items: Task[]
  onItemClick: (item: Task) => void
  showBackButton?: boolean
  onBack?: () => void
  onNavigate?: (direction: "prev" | "next") => void
}

interface TimeSlot {
  hour: number
  minute: number
  displayTime: string
}

export function CalendarDayView({
  currentDate,
  items,
  onItemClick,
  showBackButton = false,
  onBack,
  onNavigate,
}: CalendarDayViewProps) {
  const { config } = useCalendarConfig()
  const timeSlots: TimeSlot[] = generateTimeSlots(config)

  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: () => onNavigate?.("next"),
    onSwipeRight: () => onNavigate?.("prev"),
    minSwipeDistance: 50,
  })

  const getItemsForDayAndTimeSlot = (day: Date, timeSlot: TimeSlot) => {
    const dateStr = day.toISOString().split('T')[0];

    return items.filter((item) => {
      const itemDate = new Date(item.time).toISOString().split('T')[0];
      if (itemDate !== dateStr) return false

      if (item.type === "task" && !item.startTime) {
        return timeSlot === timeSlots[0]
      }

      if (item.startTime && item.endTime) {
        const itemStartHour = Number.parseInt(item.startTime.split(":")[0])
        const itemStartMinute = Number.parseInt(item.startTime.split(":")[1] || "0")
        const itemEndHour = Number.parseInt(item.endTime.split(":")[0])
        const itemEndMinute = Number.parseInt(item.endTime.split(":")[1] || "0")

        const slotTime = timeSlot.hour * 60 + timeSlot.minute
        const itemStartTime = itemStartHour * 60 + itemStartMinute
        const itemEndTime = itemEndHour * 60 + itemEndMinute

        return slotTime >= itemStartTime && slotTime < itemEndTime
      }

      return false
    })
  }

  return (
    <div className="p-4 lg:p-8 h-full overflow-auto" {...swipeHandlers}>
      <div className="max-w-2xl">
        <div className="hidden lg:flex items-center space-x-4 mb-6 lg:mb-8">
          {showBackButton && onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="md:hidden">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <h2 className="text-lg font-medium">
            {currentDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h2>
        </div>

        <div className="space-y-1">
          {timeSlots.map((timeSlot, index) => {
            const dayItems = getItemsForDayAndTimeSlot(currentDate, timeSlot)
            return (
              <div key={index} className="flex">
                <div className="w-16 lg:w-20 text-xs text-stone-400 pt-2 flex-shrink-0">{timeSlot.displayTime}</div>
                <div className="flex-1 min-h-[40px] lg:min-h-[50px] border-l border-accent pl-4 lg:pl-6">
                  {dayItems.map((item) => (
                    <CalendarItemCard key={item._id} item={item} onClick={() => onItemClick(item)} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}