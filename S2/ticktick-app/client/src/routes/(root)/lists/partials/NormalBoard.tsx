import { arrayMove } from "@dnd-kit/sortable";
import { useLists } from "./hook/useList";
import { useTasks } from "./hook/useTask";
import { TaskManagerProps } from "@/types/types";
import TaskList from "./components/NormalBoard/TaskList";
import EmptyState from "@/components/tasks/EmptyTasks";
import TaskCreateInput from "./components/NormalBoard/TaskCreateInput";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import CompletedTasksSection from "./components/NormalBoard/CompletedTasksSection";
import { getCompletedTasks, getIncompletedTasks } from "@/utils/tasks/taskUtils";

const NormalBoard = ({
  list,
  tasks: initialTasks,
  selectedTaskId,
  onSelectTask,
  onReorderTasks,
}: TaskManagerProps) => {
  const listData = list?.data;
  const workspaceId = localStorage.getItem("activeWorkspaceId") as string;

  const { refetch } = useLists(workspaceId);
  const { softDeleteTask, createTask, updateTask } = useTasks(
    listData?._id ?? "",
    refetch
  );

  const incompleteTasks = getIncompletedTasks(initialTasks)

  const completedTasks = getCompletedTasks(initialTasks)

  const hasTasks = initialTasks.length > 0;
  const hasCompletedTasks = completedTasks.length > 0;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = initialTasks.findIndex((task) => task._id === active.id);
    const newIndex = initialTasks.findIndex((task) => task._id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      onReorderTasks(arrayMove(initialTasks, oldIndex, newIndex));
    }
  };

  if (!listData) return null;

  return (
    <div className="col-span-2 flex flex-col border-r border-accent p-5 lg:h-[calc(100vh-100px)] overflow-y-scroll">
      <TaskCreateInput list={listData} createTask={createTask} />

      <div className="flex-1 space-y-6 mt-4">
        {!hasTasks ? (
          <EmptyState />
        ) : (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <TaskList
              tasks={incompleteTasks}
              selectedTaskId={selectedTaskId}
              onSelectTask={onSelectTask}
              title="⏳ To Do"
              updateTask={updateTask}
              softDeleteTask={softDeleteTask}
            />
            {hasCompletedTasks && (
              <CompletedTasksSection
                completedTasks={completedTasks}
                selectedTaskId={selectedTaskId}
                onSelectTask={onSelectTask}
                updateTask={updateTask}
                softDeleteTask={softDeleteTask}
              />
            )}
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default NormalBoard;
