import { List } from "@/types/response";
import { useTasks } from "../../lists/partials/hook/useTask";
import {
  getCompletedTasks,
  getIncompletedTasks,
} from "@/utils/tasks/taskUtils";
import {
  Library,
  CheckCircle,
  CircleDashed,
  ClipboardList,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";

const getPercentage = (part: number, total: number) =>
  total === 0 ? 0 : Math.round((part / total) * 100);

const ListOverview = ({ list }: { list: List }) => {
  const { tasks } = useTasks(list._id);

  const incompletedTasks = getIncompletedTasks(tasks);
  const completedTasks = getCompletedTasks(tasks);

  const total = tasks.length;
  const completed = completedTasks.length;
  const incompleted = incompletedTasks.length;

  const completedPercent = getPercentage(completed, total);
  const incompletedPercent = getPercentage(incompleted, total);

  return (
    <div className="flex-col-1">
      <div className="flex-row-3 items-center gap-2 mb-4">
        <Library className="text-stone-400" />
        <h1 className="font-bold text-xl">Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div className="p-6 rounded-2xl shadow flex flex-col gap-1 items-start border border-accent">
          <div className="flex-row-3">
            <ClipboardList className="text-blue-600" />
            <h2 className="text-lg font-semibold">Total Tasks</h2>
          </div>
          <p className="text-3xl font-bold">{total}</p>
        </div>

        <div className="p-6 rounded-2xl shadow flex flex-col gap-1 items-start border border-green-600">
          <div className="flex-row-3">
            <CheckCircle className="text-green-600" />
            <h2 className="text-lg font-semibold">Completed</h2>
          </div>
          <p className="text-3xl font-bold">{completed}</p>
          <p className="text-stone-400">{completedPercent}% done</p>
        </div>

        <div className="p-6 rounded-2xl shadow flex flex-col gap-1 items-start border border-yellow-300">
          <div className="flex-row-3">
            <CircleDashed className="text-yellow-600" />
            <h2 className="text-lg font-semibold">Incompleted</h2>
          </div>
          <p className="text-3xl font-bold">{incompleted}</p>
          <p className="text-stone-400">
            {incompletedPercent}% remaining
          </p>
        </div>
      </div>
      <div className="flex-row-3">
        <Calendar size={18} className="text-stone-400"/>
        Created on {format(new Date(list.createdAt), "MMMM d, yyyy")}
      </div>
    </div>
  );
};

export default ListOverview;
