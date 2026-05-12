"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Calendar } from "lucide-react";
import { Task } from "@/types/response";
import { TodoPriority, TodoStatus } from "@/types/enums";
import { ItemType, EventType } from "@/types/types";

interface Filters {
  priority: TodoPriority[];
  status: TodoStatus[];
  type: ItemType[];
  eventType: EventType[];
  category: string[];
  dateRange: {
    start: string;
    end: string;
  };
}

interface FiltersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  items: Task[];
}

export function FiltersDialog({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  items,
}: FiltersDialogProps) {
  const priorities: { value: TodoPriority; label: string }[] = [
    { value: TodoPriority.Low, label: "Low" },
    { value: TodoPriority.Medium, label: "Medium" },
    { value: TodoPriority.High, label: "High" },
    { value: TodoPriority.Urgent, label: "Urgent" },
  ];

  const statuses: { value: TodoStatus; label: string }[] = [
    { value: TodoStatus.Todo, label: "Todo" },
    { value: TodoStatus.InProgress, label: "In Progress" },
    { value: TodoStatus.Done, label: "Done" },
    { value: TodoStatus.Archived, label: "Archived" },
  ];

  const types: { value: ItemType; label: string }[] = [
    { value: "event", label: "Events" },
    { value: "task", label: "Tasks" },
  ];

  const eventTypes: { value: EventType; label: string }[] = [
    { value: "meeting", label: "Meeting" },
    { value: "appointment", label: "Appointment" },
    { value: "work", label: "Work" },
    { value: "personal", label: "Personal" },
    { value: "other", label: "Other" },
  ];

  const categories = Array.from(
    new Set(items?.map((item) => item.category).filter(Boolean) || [])
  ).filter((cat): cat is string => typeof cat === "string").sort();

  const handleFilterChange = (
    filterType: keyof Omit<Filters, "dateRange">,
    value: string,
    checked: boolean
  ) => {
    const currentFilter = (filters[filterType] as string[]) || [];
    const newFilter = checked
      ? [...currentFilter, value]
      : currentFilter.filter((item) => item !== value);

    onFiltersChange({
      ...filters,
      [filterType]: newFilter,
    });
  };

  const updateDateRange = (field: "start" | "end", value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value,
      },
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      priority: [],
      status: [],
      type: [],
      eventType: [],
      category: [],
      dateRange: { start: "", end: "" },
    });
  };

  const hasActiveFilters =
    (filters.priority && filters.priority.length > 0) ||
    (filters.status && filters.status.length > 0) ||
    (filters.type && filters.type.length > 0) ||
    (filters.eventType && filters.eventType.length > 0) ||
    (filters.category && filters.category.length > 0) ||
    (filters.dateRange && (filters.dateRange.start || filters.dateRange.end));

  const getActiveFiltersCount = () => {
    let count = 0;
    count += filters.priority?.length || 0;
    count += filters.status?.length || 0;
    count += filters.type?.length || 0;
    count += filters.eventType?.length || 0;
    count += filters.category?.length || 0;
    if (filters.dateRange && (filters.dateRange.start || filters.dateRange.end))
      count += 1;
    return count;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium">Filters</DialogTitle>
            {hasActiveFilters && (
              <Badge variant="secondary" className="text-xs">
                {getActiveFiltersCount()} active
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date Range */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <Label className="text-sm font-medium">Date Range</Label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label
                  htmlFor="start-date"
                  className="text-xs text-gray-500 mb-1 block"
                >
                  From
                </Label>
                <Input
                  id="start-date"
                  type="date"
                  value={filters.dateRange?.start || ""}
                  onChange={(e) => updateDateRange("start", e.target.value)}
                  className="input-register no-ring"
                />
              </div>
              <div>
                <Label
                  htmlFor="end-date"
                  className="text-xs text-gray-500 mb-1 block"
                >
                  To
                </Label>
                <Input
                  id="end-date"
                  type="date"
                  value={filters.dateRange?.end || ""}
                  onChange={(e) => updateDateRange("end", e.target.value)}
                  className="input-register no-ring"
                />
              </div>
            </div>
          </div>

          {/* Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Type</Label>
            <div className="space-y-2">
              {types.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type.value}`}
                    checked={filters.type?.includes(type.value) || false}
                    onCheckedChange={(checked) =>
                      handleFilterChange("type", type.value, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`type-${type.value}`}
                    className="text-sm font-normal"
                  >
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Event Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Event Type</Label>
            <div className="space-y-2">
              {eventTypes.map((eventType) => (
                <div
                  key={eventType.value}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`eventType-${eventType.value}`}
                    checked={
                      filters.eventType?.includes(eventType.value) || false
                    }
                    onCheckedChange={(checked) =>
                      handleFilterChange(
                        "eventType",
                        eventType.value,
                        checked as boolean
                      )
                    }
                  />
                  <Label
                    htmlFor={`eventType-${eventType.value}`}
                    className="text-sm font-normal"
                  >
                    {eventType.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Priority</Label>
            <div className="space-y-2">
              {priorities.map((priority) => (
                <div
                  key={priority.value}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`priority-${priority.value}`}
                    checked={
                      filters.priority?.includes(priority.value) || false
                    }
                    onCheckedChange={(checked) =>
                      handleFilterChange(
                        "priority",
                        priority.value,
                        checked as boolean
                      )
                    }
                  />
                  <Label
                    htmlFor={`priority-${priority.value}`}
                    className="text-sm font-normal"
                  >
                    {priority.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Status</Label>
            <div className="space-y-2">
              {statuses.map((status) => (
                <div key={status.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status.value}`}
                    checked={filters.status?.includes(status.value) || false}
                    onCheckedChange={(checked) =>
                      handleFilterChange(
                        "status",
                        status.value,
                        checked as boolean
                      )
                    }
                  />
                  <Label
                    htmlFor={`status-${status.value}`}
                    className="text-sm font-normal"
                  >
                    {status.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Categories</Label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.category?.includes(category) || false}
                      onCheckedChange={(checked) =>
                        handleFilterChange(
                          "category",
                          category,
                          checked as boolean
                        )
                      }
                    />
                    <Label
                      htmlFor={`category-${category}`}
                      className="text-sm font-normal capitalize"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">Active Filters</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-7 px-2 text-xs text-red-600"
                >
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {filters.priority?.map((priority) => (
                  <Badge
                    key={priority}
                    variant="secondary"
                    className="text-xs h-6"
                  >
                    {priority}
                    <button
                      onClick={() =>
                        handleFilterChange("priority", priority, false)
                      }
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                ))}
                {filters.status?.map((status) => (
                  <Badge
                    key={status}
                    variant="secondary"
                    className="text-xs h-6"
                  >
                    {status}
                    <button
                      onClick={() =>
                        handleFilterChange("status", status, false)
                      }
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                ))}
                {filters.type?.map((type) => (
                  <Badge key={type} variant="secondary" className="text-xs h-6">
                    {type}s
                    <button
                      onClick={() => handleFilterChange("type", type, false)}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                ))}
                {filters.eventType?.map((eventType) => (
                  <Badge
                    key={eventType}
                    variant="secondary"
                    className="text-xs h-6"
                  >
                    {eventType}
                    <button
                      onClick={() =>
                        handleFilterChange("eventType", eventType, false)
                      }
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                ))}
                {filters.category?.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="text-xs h-6"
                  >
                    {category}
                    <button
                      onClick={() =>
                        handleFilterChange("category", category, false)
                      }
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                ))}
                {filters.dateRange &&
                  (filters.dateRange.start || filters.dateRange.end) && (
                    <Badge variant="secondary" className="text-xs h-6">
                      Date range
                      <button
                        onClick={() => {
                          updateDateRange("start", "");
                          updateDateRange("end", "");
                        }}
                        className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </Badge>
                  )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}