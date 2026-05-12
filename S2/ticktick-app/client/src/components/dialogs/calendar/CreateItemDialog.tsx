import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@/types/response";
import { TaskColors, TodoPriority, TodoStatus } from "@/types/enums";
import {
  PRIORITY_COLORS,
  PRIORITY_LABELS,
} from "@/components/dropdowns/task/PriorityDropdown";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Flag } from "lucide-react";
import { PriorityDropdown }  from '@/components/dropdowns/index'

interface CreateItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateItem: (item: Omit<Task, "_id">) => void;
}

const taskColors: { name: string; value: TaskColors }[] = [
  { name: "Purple", value: TaskColors.Purple },
  { name: "Blue", value: TaskColors.Blue },
  { name: "Green", value: TaskColors.Green },
  { name: "Orange", value: TaskColors.Orange },
  { name: "Red", value: TaskColors.Red },
  { name: "Teal", value: TaskColors.Teal },
  { name: "Stone", value: TaskColors.Stone },
];

export function CreateItemDialog({
  open,
  onOpenChange,
  onCreateItem,
}: CreateItemDialogProps) {
  const form = useForm();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState<string | Date>("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [hasTime, setHasTime] = useState(false);
  const [color, setColor] = useState<TaskColors>(TaskColors.Purple);
  const [category, setCategory] = useState("");
  const [list, setList] = useState("default");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !time) return;

    const newItem: Omit<Task, "_id"> = {
      title,
      description,
      time: typeof time === "string" ? time : time.toISOString(),
      startTime: hasTime ? startTime : undefined,
      endTime: hasTime ? endTime : undefined,
      type: hasTime ? "event" : "task",
      priority: form.watch("priority") || TodoPriority.None,
      status: TodoStatus.Todo,
      color,
      category: category || undefined,
      list,
      completed: false,
    };

    onCreateItem(newItem);

    // Reset form
    setTitle("");
    setDescription("");
    setTime("");
    setStartTime("");
    setEndTime("");
    setHasTime(false);
    setColor(TaskColors.Purple);
    setCategory("");
    setList("default");
    form.reset();
    onOpenChange(false);
  };

  const handleDateChange = (dateString: string) => {
    if (hasTime && startTime) {
      // Combine date and time if both are set
      const timeString = startTime
        .split(":")
        .map((p) => p.padStart(2, "0"))
        .join(":");
      setTime(`${dateString}T${timeString}`);
    } else {
      setTime(dateString);
    }
  };

  const handleTimeChange = (timeString: string, isStartTime: boolean) => {
    if (isStartTime) {
      setStartTime(timeString);
      if (typeof time === "string" && time.includes("T")) {
        const datePart = time.split("T")[0];
        setTime(`${datePart}T${timeString}`);
      }
    } else {
      setEndTime(timeString);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">
            Add New Item
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              className="input-register no-ring"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              rows={3}
              className="input-register no-ring resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={
                typeof time === "string"
                  ? time.split("T")[0]
                  : time.toISOString().split("T")[0]
              }
              onChange={(e) => handleDateChange(e.target.value)}
              className="input-register no-ring"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="has-time"
              checked={hasTime}
              onCheckedChange={(checked) => setHasTime(checked as boolean)}
            />
            <Label htmlFor="has-time" className="text-sm font-medium">
              This is a timed event
            </Label>
          </div>

          {hasTime && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time" className="text-sm font-medium">
                  Start Time
                </Label>
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => handleTimeChange(e.target.value, true)}
                  className="input-register no-ring"
                  required={hasTime}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time" className="text-sm font-medium">
                  End Time
                </Label>
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => handleTimeChange(e.target.value, false)}
                  className="input-register no-ring"
                  required={hasTime}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex-col-2">
              <Label className="text-sm font-medium">Priority</Label>
              <Suspense fallback={null}>
                <PriorityDropdown
                  value={form.watch("priority") || TodoPriority.None}
                  onChange={(priority) => form.setValue("priority", priority)}
                >
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    type="button"
                    className="w-full flex-start text-stone-400 cursor-pointer text-[12px] bg-accent"
                  >
                    <Flag
                      size={12}
                      className={cn(
                        "mr-1.5",
                        PRIORITY_COLORS[
                          (form.watch("priority") as TodoPriority) ||
                            TodoPriority.None
                        ]
                      )}
                    />
                    {form.watch("priority") &&
                    form.watch("priority") !== TodoPriority.None
                      ? PRIORITY_LABELS[
                          (form.watch("priority") as TodoPriority) ??
                            TodoPriority.None
                        ]
                      : "Add priority"}
                  </Button>
                </PriorityDropdown>
              </Suspense>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color" className="text-sm font-medium">
                Color
              </Label>
              <Select
                value={color}
                onValueChange={(value: TaskColors) => setColor(value)}
              >
                <SelectTrigger className="bg-accent border-none ring-no w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {taskColors.map((colorOption) => (
                    <SelectItem
                      key={colorOption.value}
                      value={colorOption.value}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded bg-${colorOption.value}-400`}
                        />
                        {colorOption.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category
            </Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. work, personal, health"
              className="input-register no-ring"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="list" className="text-sm font-medium">
              List
            </Label>
            <Input
              id="list"
              value={list}
              onChange={(e) => setList(e.target.value)}
              placeholder="e.g. Personal, Work"
              className="input-register no-ring"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-black hover:bg-gray-800">
              Create {hasTime ? "Event" : "Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
