import { Suspense } from "react";
import { List } from "@/types/response";
import { TodoPriority } from "@/types/enums";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EditListDropdown }  from '@/components/dropdowns/index'
import { cn, getListEmoji, getUserInitials } from "@/lib/utils";
import { EllipsisVertical, SquareCheckBig } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PRIORITY_BACKGROUND } from "@/components/dropdowns/task/PriorityDropdown";

interface ListCardProps extends List {
  dueDate?: Date | string;
  isPersonal?: boolean;
}

const getProgressColor = (percentage: number): string => {
  if (percentage < 33) return "bg-red-500";
  if (percentage < 66) return "bg-yellow-500";
  return "bg-green-500";
};

const ListCard = ({
  title,
  isPersonal,
  workspace,
  completedTasksCount,
  totalTasksCount,
  priority = TodoPriority.None,
  _id,
}: ListCardProps) => {
  const navigate = useNavigate();

  const completionPercentage =
    totalTasksCount > 0
      ? Math.round((completedTasksCount / totalTasksCount) * 100)
      : 0;

  const handleCardClick = () => {
    const listName = title.replace(/\s+/g, "-");
    navigate(`/${_id}/${listName}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="border border-accent rounded-md p-4 hover:shadow-sm transition-shadow cursor-pointer relative overflow-hidden group"
    >
      {isPersonal ? null : (
        <div className="flex justify-between items-center mb-2">
          <div className="flex-row-2">
            <Avatar className="rounded-md size-8">
              <AvatarImage src={workspace.imageUrl} />
              <AvatarFallback />
            </Avatar>{" "}
            <p className="text-sm text-stone-400 truncate max-w-[70%]">
              {workspace.title}
            </p>
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="w-full flex justify-end items-end"
          >
            <div>
              <EditListDropdown listId={_id}>
                <Button variant={"ghost"}>
                  <EllipsisVertical />
                </Button>
              </EditListDropdown>
            </div>
          </div>
        </div>
      )}

      <div className="flex-between">
        <div className="flex-row-2 mb-4">
          <span>{getListEmoji(title)}</span>
          <h3 className="font-medium text-lg ">{title}</h3>
        </div>
        {isPersonal ? (
          <div>
            <Suspense fallback={null}>
              <EditListDropdown listId={_id}>
                <Button variant={"ghost"}>
                  <EllipsisVertical />
                </Button>
              </EditListDropdown>
            </Suspense>
          </div>
        ) : null}
      </div>

      <div className="mb-3">
        <div className="w-full bg-accent rounded-full h-2">
          <div
            className={`h-2 rounded-full ${getProgressColor(
              completionPercentage
            )}`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        <div className="flex justify-between text-sm mt-2">
          <span className={`font-medium flex-row-1 text-sm`}>
            <SquareCheckBig size={15} />
            {completedTasksCount}/{totalTasksCount} tasks
          </span>
          {priority !== TodoPriority.None && (
            <div
              className={cn(
                `absolute -bottom-[95%] left-1/2 -translate-x-1/2 ${
                  isPersonal ? "w-38 h-38" : "w-72 h-72"
                } rounded-full opacity-20 blur-3xl pointer-events-none -z-1 group-hover:animate-pulse`,
                PRIORITY_BACKGROUND[priority]
              )}
            />
          )}
        </div>
      </div>

      {isPersonal ? null : (
        <div className="flex items-center -space-x-3">
          {workspace.members.map((member, idx) => (
            <Avatar
              key={idx}
              className="size-7 rounded-full border-2 border-white dark:border-black object-cover"
            >
              <AvatarImage
                key={idx}
                src={member.user.imageUrl}
                alt="Member Avatar"
              ></AvatarImage>
              <AvatarFallback>
                {getUserInitials(member.user.username)}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListCard;
