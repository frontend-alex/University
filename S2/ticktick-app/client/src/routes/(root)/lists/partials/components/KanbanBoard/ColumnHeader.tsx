import { TodoPriority } from "@/types/enums";
import { Flag, Plus, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PRIORITY_COLORS, PRIORITY_LABELS } from "@/components/dropdowns/task/PriorityDropdown";

interface ColumnHeaderProps {
  priority: TodoPriority;
  count: number;
  onAddTop: () => void;
}

const ColumnHeader = ({ priority, count, onAddTop }: ColumnHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-3 py-2">
      <div className="flex items-center gap-2">
        <Flag className={`h-4 w-4 ${PRIORITY_COLORS[priority]}`} />
        <h2 className="text-sm font-medium">{PRIORITY_LABELS[priority]}</h2>
        <Badge variant={'outline'}>
          {count}
        </Badge>
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <MoreHorizontal className="h-3 w-3 text-stone-400" />
        </Button>
        <Button onClick={onAddTop} variant="ghost" size="sm" className="h-6 w-6 p-0 ">
          <Plus className="h-3 w-3 text-stone-400" />
        </Button>
      </div>
    </div>
  );
};

export default ColumnHeader;
