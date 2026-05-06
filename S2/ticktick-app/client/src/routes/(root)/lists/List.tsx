import EditTask from "./partials/EditTask";
import NormalBoard from "./partials/NormalBoard";
import KanbanBoard from "./partials/KanbanBoard";
import TaskListHeader from "./partials/components/NormalBoard/TaskListHeader";

import { toast } from "sonner";
import { Task } from "@/types/response";
import { useEffect, useState } from "react";
import { useListById } from "./partials/hook/useList";
import { useTasks } from "./partials/hook/useTask";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";


const List = () => {
  const { listId } = useParams();
  const { list } = useListById(listId as string);
  const {
    tasks: tasksData,
    isLoading,
    softDeleteTask,
  } = useTasks(listId as string);

  const navigate = useNavigate();

  const [viewType, setViewType] = useState<"list" | "kanban">(() => {
    const saved = localStorage.getItem("listViewType");
    return saved === "kanban" ? saved : "list";
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [localTasks, setLocalTasks] = useState<Task[]>([]);

  const selectedTaskId = searchParams.get("task");
  const selectedTask = localTasks.find((task) => task._id === selectedTaskId);

  useEffect(() => {
    setLocalTasks(tasksData);
  }, [tasksData]);

  useEffect(() => {
    localStorage.setItem("listViewType", viewType);
  }, [viewType]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:h-[100dvh] relative overflow-hidden p-5">
        <div className="flex-col-10 col-span-2 border-r border-accent pr-5 ">
          <div className="flex-col-3">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-8 w-full" />
          </div>
          <div className="flex-col-3">
            {Array.from({ length: 7 }).map((_, idx) => (
              <Skeleton key={idx} className="w-full h-10" />
            ))}
          </div>
        </div>
        <div className="flex-col-3 px-5">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-62 w-full" />
        </div>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="p-6 text-center text-muted-foreground">List not found.</div>
    );
  }

  const handleReorderTasks = (newTasks: Task[]) => {
    setLocalTasks(newTasks);
  };

  const views: Record<"list" | "kanban", React.ReactNode> = {
    list: (
      <div className="grid grid-cols-1 lg:grid-cols-3">
        <NormalBoard
          list={list}
          tasks={localTasks}
          selectedTaskId={selectedTaskId}
          onSelectTask={(id) => setSearchParams(id ? { task: id } : {})}
          onReorderTasks={handleReorderTasks}
          softDeleteTask={(id) =>
            softDeleteTask.mutate(
              { id },
              {
                onSuccess: (data) => toast.success(data.message),
              }
            )
          }
        />
        <EditTask
          selectedTask={selectedTask}
          readOnly={false}
          showTrashActions={false}
          onRestore={() => {}}
          onDeletePermanently={() => {}}
        />
      </div>
    ),
    kanban: <KanbanBoard listId={listId || ""} />,
  };

  return (
    <>
      <TaskListHeader
        listData={list.data}
        navigate={navigate}
        viewType={viewType}
        onViewChange={setViewType}
      />
      <div className="lg:h-[calc(100vh-100px)] relative overflow-hidden">
        {views[viewType]}
      </div>
    </>
  );
};

export default List;
