"use client"

import { useCalendarConfig } from "@/contexts/CalendarContext"
import { generateTimeSlots } from "@/config/calendarConfig"
import { CalendarGrid } from "./CalendarGrid"
import { WeekHeader } from "./CalendarWeekHeader"
import { Task } from "@/types/response"

interface CalendarWeekViewProps {
  currentDate: Date
  items: Task[]
  onItemClick: (item: Task) => void
}

export function CalendarWeekView({ currentDate, items, onItemClick }: CalendarWeekViewProps) {
  const { config } = useCalendarConfig()

  const getStartOfWeek = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff))
  }

  const startOfWeek = getStartOfWeek(currentDate)
  const weekDays = Array.from({ length: config.showWeekends ? 7 : 5 }, (_, i) => {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    return day
  })

  const timeSlots = generateTimeSlots(config)

  return (
    <div className="h-full flex flex-col">
      <WeekHeader weekDays={weekDays} />
      <CalendarGrid weekDays={weekDays} timeSlots={timeSlots} items={items} onItemClick={onItemClick} />
    </div>
  )
}