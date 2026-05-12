import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { Task } from "@/types/response";
import TaskList from "./TaskList";

interface CompletedTasksSectionProps {
  completedTasks: Task[];
  selectedTaskId?: string;
  onSelectTask: (id: string | null) => void;
  updateTask: any;
  softDeleteTask: any;
}

const CompletedTasksSection = ({
  completedTasks,
  selectedTaskId,
  onSelectTask,
  updateTask,
  softDeleteTask,
}: CompletedTasksSectionProps) => {
  return (
    <Collapsible>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <CollapsibleTrigger className="flex-row-1">
            <p className="text-sm font-semibold text-muted-foreground">
              ✅ Completed ({completedTasks.length})
            </p>
            <ChevronRight size={15} />
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <TaskList
            tasks={completedTasks}
            selectedTaskId={selectedTaskId}
            onSelectTask={onSelectTask}
            updateTask={updateTask}
            softDeleteTask={softDeleteTask}
          />
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default CompletedTasksSection;