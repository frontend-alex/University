import { Task } from "@/types/response"
import { CalendarItemCard } from "./CalendarItemCard"

interface TimeSlot {
  hour: number
  minute: number
  displayTime: string
}

interface CalendarTimeSlotProps {
  timeSlot: TimeSlot
  weekDays: Date[]
  getItemsForSlot: (day: Date) => Task[]
  onItemClick: (item: Task) => void
}

export function CalendarTimeSlot({ timeSlot, weekDays, getItemsForSlot, onItemClick }: CalendarTimeSlotProps) {
  return (
    <div
      className="grid border-b border-accent"
      style={{
        gridTemplateColumns: `60px repeat(${weekDays.length}, 1fr)`,
      }}
    >
      <div className="p-2 lg:p-4 text-xs text-stone-400 text-right pr-3 lg:pr-6 border-r border-accent">
        <span className="hidden sm:inline">{timeSlot.displayTime}</span>
        <span className="sm:hidden text-xs">{timeSlot.hour.toString().padStart(2, "0")}</span>
      </div>
      {weekDays.map((day, dayIndex) => {
        const dayItems = getItemsForSlot(day)
        return (
          <div
            key={dayIndex}
            className="p-1 lg:p-2 min-h-[40px] lg:min-h-[60px] border-r border-accent last:border-r-0"
          >
            {dayItems.map((item) => (
              <CalendarItemCard key={item._id} item={item} onClick={() => onItemClick(item)} compact={true} />
            ))}
          </div>
        )
      })}
    </div>
  )
}