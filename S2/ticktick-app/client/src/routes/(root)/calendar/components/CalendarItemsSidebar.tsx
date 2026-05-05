"use client";

import type React from "react";

import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@/types/response";
import { TodoStatus } from "@/types/enums";

interface ItemsSidebarProps {
  items: Task[];
  dateRange: { start: Date; end: Date };
  onItemClick: (item: Task) => void;
  onCreateItem: () => void;
  onUpdateItem: (item: Task) => void;
}

export function ItemsSidebar({
  items,
  dateRange,
  onItemClick,
  onCreateItem,
  onUpdateItem,
}: ItemsSidebarProps) {
  const filteredItems = items.filter((item) => {
    const itemDate = new Date(item.time);
    return itemDate >= dateRange.start && itemDate <= dateRange.end;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-400";
      case "medium":
        return "bg-orange-400";
      case "low":
        return "bg-green-400";
      default:
        return "bg-gray-400";
    }
  };

  const formatDateRange = () => {
    if (dateRange.start.toDateString() === dateRange.end.toDateString()) {
      return dateRange.start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
    return `${dateRange.start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${dateRange.end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}`;
  };

  const toggleItemStatus = (item: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = item.status === TodoStatus.Done ? TodoStatus.InProgress : TodoStatus.Done;
    onUpdateItem({ ...item, status: newStatus });
  };

  return (
    <div className="w-80 border-l border-accent  flex flex-col">
      <div className="px-5 py-4.5 border-b border-accent ">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Items</h3>
            <p className="text-sm text-stone-400">{formatDateRange()}</p>
          </div>
          <Button variant={"ghost"} onClick={onCreateItem} title="Add Item">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {filteredItems.length > 0 ? (
          <div className="space-y-2">
            {filteredItems
              .sort(
                (a, b) =>
                  new Date(a.time).getTime() - new Date(b.time).getTime()
              )
              .map((item) => (
                <div
                  key={item._id}
                  onClick={() => onItemClick(item)}
                  className="rounded border border-accent hover:border-input transition-colors cursor-pointer"
                >
                  <div className="p-3">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        onClick={(e) => toggleItemStatus(item, e)}
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center mt-0.5 transition-colors flex-shrink-0 ${
                          item.status === TodoStatus.Done
                            ? "bg-green-500 border-green-500 text-white"
                            : ""
                        }`}
                      >
                        {item.status ===  TodoStatus.Done && (
                          <Check className="h-2.5 w-2.5" />
                        )}
                      </Checkbox>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className={`w-2 h-2 rounded-full flex-shrink-0 ${getPriorityColor(
                              item.priority
                            )}`}
                          />
                          <div
                            className={`font-medium text-sm truncate ${
                              item.status ===  TodoStatus.Done
                                ? "line-through text-stone-400"
                                : ""
                            }`}
                          >
                            {item.title}
                          </div>
                          <span className="text-xs bg-gray-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded flex-shrink-0">
                            {item.type}
                          </span>
                        </div>

                        <div className="text-xs text-stone-400 mb-1">
                          {new Date(item.time).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                          {item.startTime &&
                            item.endTime &&
                            ` • ${item.startTime} - ${item.endTime}`}
                        </div>

                        {item.description && (
                          <div className="text-xs  line-clamp-2 leading-relaxed">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No items for this period</p>
            <button
              onClick={onCreateItem}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              Create your first item
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
