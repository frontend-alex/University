export interface CalendarConfig {
    // Time display settings
    startHour: number // 0-23 (24-hour format)
    endHour: number // 0-23 (24-hour format)
    timeFormat: "12h" | "24h" // Display format
    timeSlotDuration: number // Duration of each time slot in minutes (default: 60)
  
    // Display settings
    showAllDay: boolean // Whether to show all-day events
    showWeekends: boolean // Whether to show weekends
    firstDayOfWeek: 0 | 1 // 0 = Sunday, 1 = Monday
  
    // Default view settings
    defaultView: "day" | "week" | "month" | "list"
  }
  
  // Default configuration
  export const defaultCalendarConfig: CalendarConfig = {
    startHour: 0, // 12:00 AM
    endHour: 23, // 11:00 PM (full 24-hour day)
    timeFormat: "24h",
    timeSlotDuration: 60,
    showAllDay: true,
    showWeekends: true,
    firstDayOfWeek: 1, // Monday
    defaultView: "week",
  }
  
  // Alternative configurations for different use cases
  export const businessHoursConfig: CalendarConfig = {
    ...defaultCalendarConfig,
    startHour: 8, // 8:00 AM
    endHour: 18, // 6:00 PM
    timeFormat: "12h",
  }
  
  export const extendedBusinessConfig: CalendarConfig = {
    ...defaultCalendarConfig,
    startHour: 6, // 6:00 AM
    endHour: 22, // 10:00 PM
    timeFormat: "12h",
  }
  
  export const nightShiftConfig: CalendarConfig = {
    ...defaultCalendarConfig,
    startHour: 22, // 10:00 PM
    endHour: 6, // 6:00 AM (next day)
    timeFormat: "24h",
  }
  
  // Time slot interface
  export interface TimeSlot {
    hour: number
    minute: number
    displayTime: string
  }
  
  // Utility functions for time handling
  export const formatTime = (hour: number, minute = 0, format: "12h" | "24h" = "24h"): string => {
    if (format === "24h") {
      return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
    }
  
    // 12-hour format
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    const ampm = hour < 12 ? "AM" : "PM"
    const minuteStr = minute === 0 ? "00" : minute.toString().padStart(2, "0")
    return `${displayHour}:${minuteStr} ${ampm}`
  }
  
  export const formatHour = (hour: number, format: "12h" | "24h" = "24h"): string => {
    return formatTime(hour, 0, format)
  }
  
  export const generateTimeSlots = (config: CalendarConfig): TimeSlot[] => {
    const slots: TimeSlot[] = []
    const { startHour, endHour, timeSlotDuration, timeFormat } = config
  
    // Handle normal case (start <= end) and overnight case (start > end)
    if (startHour <= endHour) {
      // Normal day range (e.g., 8 AM to 6 PM)
      let currentHour = startHour
      let currentMinute = 0
  
      while (currentHour <= endHour) {
        slots.push({
          hour: currentHour,
          minute: currentMinute,
          displayTime: formatTime(currentHour, currentMinute, timeFormat),
        })
  
        // Add duration
        currentMinute += timeSlotDuration
        if (currentMinute >= 60) {
          currentHour += Math.floor(currentMinute / 60)
          currentMinute = currentMinute % 60
        }
  
        // Stop if we've exceeded the end hour
        if (currentHour > endHour || (currentHour === endHour && currentMinute > 0)) {
          break
        }
      }
    } else {
      // Overnight range (e.g., 10 PM to 6 AM next day)
      let currentHour = startHour
      let currentMinute = 0
  
      // First part: from startHour to 23:59
      while (currentHour <= 23) {
        slots.push({
          hour: currentHour,
          minute: currentMinute,
          displayTime: formatTime(currentHour, currentMinute, timeFormat),
        })
  
        currentMinute += timeSlotDuration
        if (currentMinute >= 60) {
          currentHour += Math.floor(currentMinute / 60)
          currentMinute = currentMinute % 60
        }
  
        if (currentHour > 23) break
      }
  
      // Second part: from 0:00 to endHour
      currentHour = 0
      currentMinute = 0
  
      while (currentHour <= endHour) {
        slots.push({
          hour: currentHour,
          minute: currentMinute,
          displayTime: formatTime(currentHour, currentMinute, timeFormat),
        })
  
        currentMinute += timeSlotDuration
        if (currentMinute >= 60) {
          currentHour += Math.floor(currentMinute / 60)
          currentMinute = currentMinute % 60
        }
  
        if (currentHour > endHour || (currentHour === endHour && currentMinute > 0)) {
          break
        }
      }
    }
  
    return slots
  }
  
  export const isTimeInRange = (hour: number, minute: number, config: CalendarConfig): boolean => {
    const { startHour, endHour } = config
  
    if (startHour <= endHour) {
      return (
        (hour > startHour || (hour === startHour && minute >= 0)) &&
        (hour < endHour || (hour === endHour && minute === 0))
      )
    } else {
      // Overnight range
      return hour >= startHour || hour <= endHour
    }
  }
  