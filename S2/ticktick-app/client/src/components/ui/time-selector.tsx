import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarClock } from "lucide-react";
import { TriggerWrapper } from "../TriggerWrapper";
import { cn } from "@/lib/utils";

type TimeMode = "all-day" | "range" | "due";

interface TimeSelectorProps {
  onChange: (data: {
    mode: TimeMode;
    startTime?: string;
    endTime?: string;
    dueTime?: string;
  }) => void;
  icon?: React.ElementType;
  buttonText?: string;
  dropdownLabel?: string;
  buttonClassName?: string;
  children?: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
}

export function TimeSelector({
  onChange,
  children,
  icon: Icon = CalendarClock,
  buttonText = "Select Time",
  dropdownLabel = "Select Time Mode",
  buttonClassName,
}: TimeSelectorProps) {
  const [mode, setMode] = useState<TimeMode>("all-day");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [dueTime, setDueTime] = useState("");

  const handleSave = () => {
    onChange({ mode, startTime, endTime, dueTime });
  };

  return (
    <TriggerWrapper
      customTrigger={children}
      defaultTrigger={
        <Button className={cn("", buttonClassName)} variant="ghost">
          <Icon className="h-4 w-4" />
          {buttonText}
        </Button>
      }
    >
      {({ open, setOpen }) => (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div />
          </PopoverTrigger>

          <PopoverContent className="w-80 space-y-4 mt-5">
            <Label className="text-base">{dropdownLabel}</Label>

            <RadioGroup
              defaultValue={mode}
              onValueChange={(val: TimeMode) => setMode(val)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all-day" id="all-day" />
                <Label htmlFor="all-day">All Day</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="range" id="range" />
                <Label htmlFor="range">Time Range</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="due" id="due" />
                <Label htmlFor="due">Due Time</Label>
              </div>
            </RadioGroup>

            {mode === "range" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start</Label>
                  <Input
                    type="time"
                    id="startTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End</Label>
                  <Input
                    type="time"
                    id="endTime"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            )}

            {mode === "due" && (
              <div>
                <Label htmlFor="dueTime">Due by</Label>
                <Input
                  type="time"
                  id="dueTime"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                />
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button onClick={handleSave}>Save</Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </TriggerWrapper>
  );
}
