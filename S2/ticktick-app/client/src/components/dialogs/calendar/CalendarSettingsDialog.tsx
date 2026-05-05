import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  businessHoursConfig,
  extendedBusinessConfig,
  nightShiftConfig,
  defaultCalendarConfig,
} from "@/config/calendarConfig";
import { useCalendarConfig } from "@/contexts/CalendarContext"

interface CalendarSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const presetConfigs = {
  "24-hour": defaultCalendarConfig,
  business: businessHoursConfig,
  extended: extendedBusinessConfig,
  night: nightShiftConfig,
}

export function CalendarSettingsDialog({ open, onOpenChange }: CalendarSettingsDialogProps) {
  const { config, updateConfig, resetConfig } = useCalendarConfig()
  const [tempConfig, setTempConfig] = useState(config)

  const handleSave = () => {
    updateConfig(tempConfig)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setTempConfig(config)
    onOpenChange(false)
  }

  const handlePresetChange = (preset: keyof typeof presetConfigs) => {
    setTempConfig(presetConfigs[preset])
  }

  const handleReset = () => {
    resetConfig()
    setTempConfig(defaultCalendarConfig)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">Calendar Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preset Configurations */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Quick Presets</Label>
            <Select onValueChange={handlePresetChange}>
              <SelectTrigger className="input-register no-ring w-full">
                <SelectValue placeholder="Choose a preset..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24-hour">24-Hour Day (00:00 - 23:00)</SelectItem>
                <SelectItem value="business">Business Hours (08:00 - 18:00)</SelectItem>
                <SelectItem value="extended">Extended Hours (06:00 - 22:00)</SelectItem>
                <SelectItem value="night">Night Shift (22:00 - 06:00)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Time Range</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="start-hour" className="text-xs text-gray-500 mb-1 block">
                  Start Hour (0-23)
                </Label>
                <Input
                  id="start-hour"
                  type="number"
                  min="0"
                  max="23"
                  value={tempConfig.startHour}
                  onChange={(e) => setTempConfig({ ...tempConfig, startHour: Number.parseInt(e.target.value) || 0 })}
                  className="input-register no-ring"
                />
              </div>
              <div>
                <Label htmlFor="end-hour" className="text-xs text-gray-500 mb-1 block">
                  End Hour (0-23)
                </Label>
                <Input
                  id="end-hour"
                  type="number"
                  min="0"
                  max="23"
                  value={tempConfig.endHour}
                  onChange={(e) => setTempConfig({ ...tempConfig, endHour: Number.parseInt(e.target.value) || 23 })}
                  className="input-register no-ring"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {tempConfig.startHour > tempConfig.endHour
                ? "Overnight schedule (crosses midnight)"
                : "Same-day schedule"}
            </p>
          </div>

          {/* Time Format */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Time Format</Label>
            <Select
              value={tempConfig.timeFormat}
              onValueChange={(value: "12h" | "24h") => setTempConfig({ ...tempConfig, timeFormat: value })}
            >
              <SelectTrigger className="input-register no-ring w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                <SelectItem value="24h">24-hour</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Slot Duration */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Time Slot Duration</Label>
            <Select
              value={tempConfig.timeSlotDuration.toString()}
              onValueChange={(value) => setTempConfig({ ...tempConfig, timeSlotDuration: Number.parseInt(value) })}
            >
              <SelectTrigger className="input-register no-ring w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Week Settings */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Week Settings</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-weekends"
                  checked={tempConfig.showWeekends}
                  onCheckedChange={(checked) => setTempConfig({ ...tempConfig, showWeekends: checked as boolean })}
                />
                <Label htmlFor="show-weekends" className="text-sm font-normal">
                  Show weekends
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-all-day"
                  checked={tempConfig.showAllDay}
                  onCheckedChange={(checked) => setTempConfig({ ...tempConfig, showAllDay: checked as boolean })}
                />
                <Label htmlFor="show-all-day" className="text-sm font-normal">
                  Show all-day events
                </Label>
              </div>
            </div>
          </div>

          {/* First Day of Week */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">First Day of Week</Label>
            <Select
              value={tempConfig.firstDayOfWeek.toString()}
              onValueChange={(value) =>
                setTempConfig({ ...tempConfig, firstDayOfWeek: Number.parseInt(value) as 0 | 1 })
              }
            >
              <SelectTrigger className="input-register no-ring w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Sunday</SelectItem>
                <SelectItem value="1">Monday</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="destructive" onClick={handleReset}>
            Reset to Default
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-black hover:bg-gray-800">
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
