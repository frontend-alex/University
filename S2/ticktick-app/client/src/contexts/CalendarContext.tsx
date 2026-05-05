import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { defaultCalendarConfig, type CalendarConfig } from "@/config/calendarConfig"

interface CalendarConfigContextType {
  config: CalendarConfig
  updateConfig: (newConfig: Partial<CalendarConfig>) => void
  resetConfig: () => void
}

const CalendarConfigContext = createContext<CalendarConfigContextType | undefined>(undefined)

const STORAGE_KEY = "calendar-config"

export function CalendarConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<CalendarConfig>(defaultCalendarConfig)

  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY)
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig)
        setConfig({ ...defaultCalendarConfig, ...parsedConfig })
      }
    } catch (error) {
      console.error("Failed to load calendar config from localStorage:", error)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    } catch (error) {
      console.error("Failed to save calendar config to localStorage:", error)
    }
  }, [config])

  const updateConfig = (newConfig: Partial<CalendarConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }))
  }

  const resetConfig = () => {
    setConfig(defaultCalendarConfig)
  }

  return (
    <CalendarConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </CalendarConfigContext.Provider>
  )
}

export function useCalendarConfig() {
  const context = useContext(CalendarConfigContext)
  if (context === undefined) {
    throw new Error("useCalendarConfig must be used within a CalendarConfigProvider")
  }
  return context
}
