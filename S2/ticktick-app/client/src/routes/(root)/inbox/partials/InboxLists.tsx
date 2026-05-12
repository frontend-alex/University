import ListCard from "@/components/cards/workspace/ListCard";

import { CreateListDialog } from "@/components/dialogs/index";

import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter, PlusIcon, SortAsc } from "lucide-react";
import { useLists } from "../../lists/partials/hook/useList";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EmptyState from "@/components/tasks/EmptyTasks";

const InboxLists: React.FC<{ workspaceId: string; isPersonal: boolean }> = ({
  workspaceId,
  isPersonal,
}) => {
  const { lists, isLoading } = useLists(workspaceId);

  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [sortByRecent, setSortByRecent] = useState<boolean>(true);

  const listTypes = [...new Set(lists?.map((list) => list.listType))];

  const filteredLists = lists
    ?.filter((list) =>
      selectedFilter ? list.listType === selectedFilter : true
    )
    .sort((a, b) =>
      sortByRecent
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  return (
    <div className="flex flex-col h-full p-5 border-r border-accent overflow-y-auto">
      <div className="flex-between mb-4">
        <h1 className="text-2xl font-corm font-bold">All lists</h1>

        <div className="flex-row-2 text-stone-400 gap-2">
          <Select
            onValueChange={(value) =>
              setSelectedFilter(value === "all" ? null : value)
            }
            value={selectedFilter ?? "all"}
          >
            <SelectTrigger className="w-full flex-start border-none shadow-none text-sm font-medium">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Lists</SelectItem>
              {listTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            onClick={() => setSortByRecent((prev) => !prev)}
          >
            <SortAsc />
            <span className="hidden lg:flex ml-1">
              Sort by {sortByRecent ? "Recent" : "Oldest"}
            </span>
          </Button>

          <Suspense fallback={<Skeleton className="w-20 h-10 rounded-md"/>}>
            <CreateListDialog workspaceId={workspaceId}>
              <Button>
                <PlusIcon />
                <span className="hidden lg:flex ml-1">Create List</span>
              </Button>
            </CreateListDialog>
          </Suspense>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton className="h-[200px]" key={idx} />
          ))}
        </div>
      ) : filteredLists?.length === 0 ? (
        <EmptyState
          title="No lists yet"
          description="Start by adding a new list to get things moving."
        />
      ) : (
        <div
          className={`${
            isPersonal ? "2xl:grid-cols-4" : "2xl:grid-cols-3"
          } grid grid-cols-1 md:grid-cols-2 gap-3`}
        >
          {filteredLists?.map((list) => (
            <ListCard isPersonal={isPersonal} {...list} key={list._id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default InboxLists;
