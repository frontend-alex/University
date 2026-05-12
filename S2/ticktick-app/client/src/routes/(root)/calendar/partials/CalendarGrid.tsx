"use client"

import { Task } from "@/types/response"
import { CalendarTimeSlot } from "./CalendarTimeSlot"

interface TimeSlot {
  hour: number
  minute: number
  displayTime: string
}

interface CalendarGridProps {
  weekDays: Date[]
  timeSlots: TimeSlot[]
  items: Task[]
  onItemClick: (item: Task) => void
}

export function CalendarGrid({ weekDays, timeSlots, items, onItemClick }: CalendarGridProps) {
  const getItemsForDayAndTimeSlot = (day: Date, timeSlot: TimeSlot) => {
    const dateStr = day.toISOString().split('T')[0]

    return items.filter((item) => {
      const itemDate = new Date(item.time).toISOString().split('T')[0]
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
    <div className="flex-1 overflow-auto">
      {timeSlots.map((timeSlot, timeIndex) => (
        <CalendarTimeSlot
          key={timeIndex}
          timeSlot={timeSlot}
          weekDays={weekDays}
          getItemsForSlot={(day) => getItemsForDayAndTimeSlot(day, timeSlot)}
          onItemClick={onItemClick}
        />
      ))}
    </div>
  )
}