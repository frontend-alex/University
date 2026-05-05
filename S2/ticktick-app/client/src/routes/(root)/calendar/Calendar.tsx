import { useState, useEffect } from "react";
import { CalendarConfigProvider } from "@/contexts/CalendarContext";
import { CalendarView } from "./partials/CalendarView";
import { ItemDetailDialog } from "@/components/dialogs/calendar/CalendarItemDialog";
import { CreateItemDialog } from "@/components/dialogs/calendar/CreateItemDialog";
import { useTasks } from "../lists/partials/hook/useTask";
import { Task } from "@/types/response";
import LoadingScreen from "@/components/LoadingScreen";

const Calendar = () => {
  const { userAssignedTasks, userListTasks, isAllUserTasksLoading } = useTasks();
  const [selectedItem, setSelectedItem] = useState<Task | null>(null);
  const [items, setItems] = useState<Task[]>([]);
  const [isCreateItemOpen, setIsCreateItemOpen] = useState(false);
  const [showAssignedTasks, _setShowAssignedTasks] = useState(false);

  // Combine or toggle between task lists
  useEffect(() => {
    if (showAssignedTasks) {
      setItems(userAssignedTasks || []);
    } else {
      setItems(userListTasks || []);
    }
  }, [userListTasks, userAssignedTasks, showAssignedTasks]);

  const handleItemClick = (item: Task) => {
    setSelectedItem(item);
  };

  const handleCreateItem = (item: Omit<Task, "_id">) => {
    const newItem: Task = {
      ...item,
      _id: Date.now().toString(),
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (updatedItem: Task) => {
    setItems(items.map((item) => (item._id === updatedItem._id ? updatedItem : item)));
  };

  if (isAllUserTasksLoading) return <LoadingScreen />;

  return (
    <CalendarConfigProvider>
      <div className="h-screen overflow-hidden">
        <CalendarView
          items={items}
          onItemClick={handleItemClick}
          onCreateItem={() => setIsCreateItemOpen(true)}
          onUpdateItem={handleUpdateItem}
        />

        <ItemDetailDialog
          item={selectedItem}
          open={!!selectedItem}
          onOpenChange={(open) => !open && setSelectedItem(null)}
          onUpdateItem={handleUpdateItem}
        />

        <CreateItemDialog
          open={isCreateItemOpen}
          onOpenChange={setIsCreateItemOpen}
          onCreateItem={handleCreateItem}
        />
      </div>
    </CalendarConfigProvider>
  );
};

export default Calendar;