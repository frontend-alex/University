import React, { memo, useCallback, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TodoPriority } from "@/types/enums";
import { Flag } from "lucide-react";
import { TriggerWrapper } from "@/components/TriggerWrapper";

export const PRIORITY_LABELS: Record<TodoPriority, string> = {
  none: "None",
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const PRIORITY_COLORS: Record<TodoPriority, string> = {
  none: "text-stone-400",
  low: "text-blue-500",
  medium: "text-yellow-500",
  high: "text-orange-500",
  urgent: "text-red-500",
};

export const PRIORITY_BACKGROUND: Record<TodoPriority, string> = {
  none: "bg-stone-400",
  low: "bg-blue-500",
  medium: "bg-yellow-500",
  high: "bg-orange-500",
  urgent: "bg-red-500",
};

type Props = {
  value: TodoPriority;
  onChange: (priority: TodoPriority) => void;
  disabled?: boolean;
  children?: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
};

const PriorityDropdownComponent = ({
  value,
  onChange,
  disabled,
  children,
}: Props) => {
  const handlePriorityChange = useCallback(
    (priority: TodoPriority) => {
      if (priority === value || disabled) return;
      onChange(priority);
    },
    [value, disabled, onChange]
  );

  const dropdownItems = useMemo(() => {
    return Object.values(TodoPriority).map((priority) => {
      const isSelected = priority === value;
      return (
        <DropdownMenuItem
          key={priority}
          className={cn("cursor-pointer", { "font-semibold": isSelected })}
          onClick={() => handlePriorityChange(priority)}
        >
          <Flag className={cn("h-4 w-4 mr-2", PRIORITY_COLORS[priority])} />
          {PRIORITY_LABELS[priority]}
        </DropdownMenuItem>
      );
    });
  }, [value, handlePriorityChange]);

  return (
    <TriggerWrapper
      customTrigger={children}
      defaultTrigger={
        <Button disabled={disabled} variant="ghost" className="no-ring">
          <Flag className={cn("h-4 w-4", PRIORITY_COLORS[value])} />
        </Button>
      }
    >
      {({ open, setOpen }) => (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <div />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">{dropdownItems}</DropdownMenuContent>
        </DropdownMenu>
      )}
    </TriggerWrapper>
  );
};
export default memo(PriorityDropdownComponent)
