import { Task } from "@/types/response";
import { Plus } from "lucide-react"

interface TasksSidebarProps {
  tasks: Task[]
  dateRange: { start: Date; end: Date }
  onTaskClick: (task: Task) => void
  onCreateTask: () => void
}

export function TasksSidebar({ tasks, dateRange, onTaskClick, onCreateTask }: TasksSidebarProps) {
  // Filter tasks within the date range
  const filteredTasks = tasks.filter((task) => {
    const taskDate = new Date(task.time)
    return taskDate >= dateRange.start && taskDate <= dateRange.end
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-400"
      case "medium":
        return "bg-orange-400"
      case "low":
        return "bg-green-400"
      default:
        return "bg-gray-400"
    }
  }

  const formatDateRange = () => {
    if (dateRange.start.toDateString() === dateRange.end.toDateString()) {
      return dateRange.start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    }
    return `${dateRange.start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${dateRange.end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}`
  }

  return (
    <div className="w-80 border-l border-gray-100 bg-gray-50 flex flex-col">
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium text-gray-900">Tasks</h3>
            <p className="text-sm text-gray-500">{formatDateRange()}</p>
          </div>
          <button onClick={onCreateTask} className="p-2 hover:bg-gray-100 rounded transition-colors" title="Add Task">
            <Plus className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {filteredTasks.length > 0 ? (
          <div className="space-y-2">
            {filteredTasks
              .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
              .map((task) => (
                <button
                  key={task._id}
                  onClick={() => onTaskClick(task)}
                  className="w-full text-left p-3 bg-white rounded border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${getPriorityColor(task.priority)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm truncate">{task.title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(task.time).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-gray-600 mt-1 line-clamp-2">{task.description}</div>
                    </div>
                  </div>
                </button>
              ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No tasks for this period</p>
            <button onClick={onCreateTask} className="mt-2 text-sm text-blue-600 hover:text-blue-700 transition-colors">
              Create your first task
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
