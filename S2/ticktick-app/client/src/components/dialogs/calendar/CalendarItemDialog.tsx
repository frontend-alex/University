import { Suspense, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Task } from "@/types/response";
import { TodoPriority, TodoStatus } from "@/types/enums";
import { PriorityDropdown } from '@/components/dropdowns/index'
import {
  PRIORITY_COLORS,
  PRIORITY_LABELS,
} from "@/components/dropdowns/task/PriorityDropdown";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Flag } from "lucide-react";

interface ItemDetailDialogProps {
  item: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateItem: (item: Task) => void;
}

export function ItemDetailDialog({
  item,
  open,
  onOpenChange,
  onUpdateItem,
}: ItemDetailDialogProps) {
  const form = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<Task | null>(null);

  if (!item) return null;

  const handleEdit = () => {
    setEditedItem({ ...item });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedItem) {
      onUpdateItem(editedItem);
      setIsEditing(false);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setEditedItem(null);
    setIsEditing(false);
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      [TodoPriority.High]: "bg-red-50 text-red-700 border-red-200",
      [TodoPriority.Medium]: "bg-orange-50 text-orange-700 border-orange-200",
      [TodoPriority.Low]: "bg-green-50 text-green-700 border-green-200",
      [TodoPriority.Urgent]: "bg-purple-50 text-purple-700 border-purple-200",
      [TodoPriority.None]: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return colors[priority as TodoPriority] || colors[TodoPriority.None];
  };

  const getStatusColor = (status: TodoStatus) => {
    const colors = {
      [TodoStatus.Done]: "bg-green-50 text-green-700 border-green-200",
      [TodoStatus.InProgress]: "bg-yellow-50 text-yellow-700 border-yellow-200",
      [TodoStatus.Todo]: "bg-blue-50 text-blue-700 border-blue-200",
      [TodoStatus.Archived]: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return colors[status] || colors[TodoStatus.Todo];
  };

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (time: string | Date | undefined) => {
    if (!time) return '';
    if (typeof time === 'string') return time;
    if (time instanceof Date) {
      return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return '';
  };

  const currentItem = editedItem || item;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">
            {isEditing
              ? "Edit Item"
              : `${item.type === "event" ? "Event" : "Task"} Details`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!isEditing ? (
            <>
              <div>
                <h3 className="font-medium mb-3">{item.title}</h3>
                <div className="flex gap-2 flex-wrap">
                  <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                    {item.priority.charAt(0).toUpperCase() +
                      item.priority.slice(1)}{" "}
                    Priority
                  </Badge>
                  <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                    {item.status.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Badge>
                  <Badge className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                {item.description && (
                  <div>
                    <p className="text-sm font-medium mb-1">Description</p>
                    <p className="text-sm text-stone-400">{item.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Date</p>
                    <p className="text-sm text-stone-400">
                      {formatDate(item.time)}
                    </p>
                  </div>
                  {item.category && (
                    <div>
                      <p className="text-sm font-medium mb-1">Category</p>
                      <p className="text-sm text-stone-400 capitalize">
                        {item.category}
                      </p>
                    </div>
                  )}
                </div>

                {(item.startTime || item.endTime) && (
                  <div>
                    <p className="text-sm font-medium mb-1">Time</p>
                    <p className="text-sm text-stone-400">
                      {formatTime(item.startTime)} - {formatTime(item.endTime)}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
                <Button onClick={handleEdit}>Edit</Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title" className="text-sm font-medium">
                    Title
                  </Label>
                  <Input
                    id="edit-title"
                    value={currentItem.title}
                    onChange={(e) =>
                      setEditedItem({ ...currentItem, title: e.target.value })
                    }
                    className="input-register no-ring"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="edit-description"
                    value={currentItem.description || ""}
                    onChange={(e) =>
                      setEditedItem({
                        ...currentItem,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="input-register no-ring"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-date" className="text-sm font-medium">
                    Date
                  </Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={typeof currentItem.time === 'string' 
                      ? currentItem.time.split('T')[0] 
                      : currentItem.time.toISOString().split('T')[0]
                    }
                    onChange={(e) => {
                      const timeValue = currentItem.time;
                      const newTime = typeof timeValue === 'string'
                        ? `${e.target.value}T${timeValue.split('T')[1] || '00:00'}`
                        : new Date(e.target.value);
                      
                      setEditedItem({ ...currentItem, time: newTime });
                    }}
                    className="input-register no-ring"
                  />
                </div>

                {currentItem.type === "event" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-start-time" className="text-sm font-medium">
                        Start Time
                      </Label>
                      <Input
                        id="edit-start-time"
                        type="time"
                        value={formatTime(currentItem.startTime)}
                        onChange={(e) =>
                          setEditedItem({
                            ...currentItem,
                            startTime: e.target.value,
                          })
                        }
                        className="input-register no-ring"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-end-time" className="text-sm font-medium">
                        End Time
                      </Label>
                      <Input
                        id="edit-end-time"
                        type="time"
                        value={formatTime(currentItem.endTime)}
                        onChange={(e) =>
                          setEditedItem({
                            ...currentItem,
                            endTime: e.target.value,
                          })
                        }
                        className="input-register no-ring"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex-col-2">
                    <Label className="text-sm font-medium">Priority</Label>
                    <Suspense fallback={null}>
                      <PriorityDropdown
                        value={currentItem.priority as TodoPriority || TodoPriority.None}
                        onChange={(priority) => {
                          setEditedItem({ ...currentItem, priority });
                          form.setValue("priority", priority);
                        }}
                      >
                        <Button
                          variant={"ghost"}
                          size={"sm"}
                          type="button"
                          className="w-full flex-start cursor-pointer text-[12px] bg-accent"
                        >
                          <Flag
                            size={12}
                            className={cn(
                              "mr-1.5",
                              PRIORITY_COLORS[
                                (currentItem.priority as TodoPriority) || 
                                TodoPriority.None
                              ]
                            )}
                          />
                          {currentItem.priority && currentItem.priority !== TodoPriority.None
                            ? PRIORITY_LABELS[
                                currentItem.priority as TodoPriority
                              ]
                            : "Add priority"}
                        </Button>
                      </PriorityDropdown>
                    </Suspense>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-status" className="text-sm font-medium">
                      Status
                    </Label>
                    <Select
                      value={currentItem.status}
                      onValueChange={(value: TodoStatus) =>
                        setEditedItem({ ...currentItem, status: value })
                      }
                    >
                      <SelectTrigger className="input-register no-ring w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TodoStatus.Todo}>Todo</SelectItem>
                        <SelectItem value={TodoStatus.InProgress}>In Progress</SelectItem>
                        <SelectItem value={TodoStatus.Done}>Done</SelectItem>
                        <SelectItem value={TodoStatus.Archived}>Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-category" className="text-sm font-medium">
                    Category
                  </Label>
                  <Input
                    id="edit-category"
                    value={currentItem.category || ""}
                    onChange={(e) =>
                      setEditedItem({
                        ...currentItem,
                        category: e.target.value,
                      })
                    }
                    className="input-register no-ring"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-black hover:bg-gray-800"
                >
                  Save Changes
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}