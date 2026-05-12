import { Suspense } from "react";
import { WorkspaceDropdown } from '@/components/dropdowns/index'
import {
  CreateListDialog,
  CreateWorkspaceDialog,
} from "@/components/dialogs/index";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  ChevronDown,
  EllipsisVertical,
  Inbox,
  MessagesSquare,
  SquareCheck,
  Trash,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import { Skeleton } from "./skeleton";
import { Separator } from "./separator";
import { useAuth } from "@/contexts/AuthProvider";
import { getListEmoji } from "@/lib/utils";
import { useLists } from "@/routes/(root)/lists/partials/hook/useList";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./tooltip";
import { TodoPriority } from "@/types/enums";
import useWorkspace from "@/routes/(root)/inbox/partials/hooks/useWorkspace";
import { PRIORITY_BACKGROUND } from "../dropdowns/task/PriorityDropdown";

export function WorkspaceSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const workspaceId = localStorage.getItem("activeWorkspaceId");

  const { lists, isLoading } = useLists(workspaceId as string);
  const { workspaceIdData } = useWorkspace(workspaceId as string);

  const isPersonal = workspaceIdData?.type === "personal";

  return (
    <Sidebar className="w-[220px] lg:ml-[50px] border-r border-accent">
      <SidebarContent className="bg-white dark:bg-neutral-950 ">
        <SidebarGroup>
          <SidebarMenu className="flex-col-2">
            {/* Dashboard */}
            <div className="py-2">
              <SidebarMenuItem>
                <Link
                  className="flex flex-row w-full"
                  to={`/${workspaceId}/inbox`}
                >
                  <SidebarMenuButton asChild className="w-full">
                    <div className="flex-between">
                      <div className="flex flex-row items-center">
                        <Inbox className="mr-2 text-stone-400" size={20} />
                        <h1 className="font-semibold">Inbox</h1>
                      </div>
                      <EllipsisVertical
                        size={15}
                        className="hidden group-hover:flex cursor-pointer"
                      />
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </div>

            <Separator />

            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center justify-between p-0">
                <h1 className="text-sm text-stone-400">Workspaces</h1>
                <Suspense
                  fallback={<Skeleton className="w-5 h-5 rounded-md" />}
                >
                  <CreateWorkspaceDialog />
                </Suspense>
              </SidebarGroupLabel>
              <SidebarContent>
                {user?.workspaces.map((workspace, idx) => {
                  const isActive = workspace._id === workspaceId;
                  return (
                    <SidebarMenuItem
                      className={`px-0 w-full rounded-md ${
                        isActive ? "bg-accent" : ""
                      }`}
                      key={idx}
                      onClick={() => {
                        localStorage.setItem(
                          "activeWorkspaceId",
                          workspace._id
                        );
                      }}
                    >
                      <SidebarMenuButton asChild>
                        <div className="flex-between w-full rounded-md group">
                          <Link to={"/"} className="flex flex-row w-full">
                            <div className="flex flex-row items-center">
                              <img
                                className="mr-2 size-5 rounded-full"
                                src={workspace.imageUrl}
                              />
                              <span className="truncate w-[150px] text-ellipsis">
                                {workspace.title}
                              </span>
                            </div>
                          </Link>
                          <Suspense fallback={null}>
                            <WorkspaceDropdown
                              onEdit={() =>
                                navigate(`/${workspace._id}/settings`)
                              }
                              members={workspace.members}
                              workspace={workspace}
                            />
                          </Suspense>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarContent>
            </SidebarGroup>

            {/* Lists Section */}
            <Collapsible defaultOpen>
              <SidebarGroup>
                <div className="flex items-center justify-between">
                  <SidebarGroupLabel asChild className="px-0">
                    <CollapsibleTrigger className="flex items-center">
                      <div className="flex-row-2">
                        <h1 className="text-sm text-stone-400">Lists</h1>
                        <ChevronDown
                          size={12}
                          className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
                        />
                      </div>
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CreateListDialog workspaceId={workspaceId || ""} />
                </div>

                <CollapsibleContent className="px-0 flex-col-1 ">
                  {isLoading ? (
                    <div className="flex-col-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-6 w-full mb-2" />
                      ))}
                    </div>
                  ) : lists?.length === 0 ? (
                    <p className="text-[12px] text-stone-400 bg-accent p-2 rounded-md">
                      No lists are found you can create one.
                    </p>
                  ) : (
                    lists?.map((list) => {
                      const isActive = location.pathname.includes(list._id);

                      return (
                        <SidebarMenuItem
                          className={`w-full rounded-md ${
                            isActive ? "bg-accent" : ""
                          }`}
                          key={list._id}
                        >
                          <Link
                            className="flex flex-row w-full"
                            to={`/${list._id}/${list.title}`}
                          >
                            <SidebarMenuButton asChild>
                              <div className="flex-between w-full px-0 py-2 rounded-md">
                                <div className="flex flex-row items-center">
                                  <span className="mr-2">
                                    {getListEmoji(list.title)}
                                  </span>
                                  <span className="truncate w-[120px] text-ellipsis">
                                    {list.title}
                                  </span>
                                </div>
                                {list.priority === TodoPriority.None ? null : (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span
                                          className={`w-2 h-2 rounded-full mr-2 ${
                                            PRIORITY_BACKGROUND[list.priority]
                                          }`}
                                        />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-sm capitalize">
                                          {list.priority} priority
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            </SidebarMenuButton>
                          </Link>
                        </SidebarMenuItem>
                      );
                    })
                  )}
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>

            <Separator />

            {/* Messages */}
            {!isPersonal && (
              <SidebarMenuItem>
                <Link
                  className="flex w-full"
                  to={`/workspace/${workspaceId}/chats`}
                >
                  <SidebarMenuButton asChild className="px-2 w-full">
                    <div className="flex-between w-full">
                      <div className="flex flex-row items-center">
                        <MessagesSquare
                          className="mr-2 text-stone-400"
                          size={20}
                        />
                        <div className="flex items-center">
                          Messages
                          {/* {hasUnreadMessages && (
                          <span className="ml-2 relative">
                            <span className="absolute inline-flex h-2 w-2 rounded-full bg-red-500 animate-ping opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                          </span>
                        )} */}
                        </div>
                      </div>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )}

            <SidebarMenuItem>
              <Link
                className="flex w-full"
                to={`/workspace/${workspaceId}/completed`}
              >
                <SidebarMenuButton asChild className="px-2 w-full">
                  <div className="flex-between w-full">
                    <div className="flex flex-row items-center">
                      <SquareCheck className="mr-2 text-stone-400" size={20} />
                      Completed
                    </div>
                  </div>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            {/* Trash */}
            <SidebarMenuItem>
              <Link
                className="flex w-full"
                to={`/workspace/${workspaceId}/trash`}
              >
                <SidebarMenuButton asChild className="px-2 w-full">
                  <div className="flex-between w-full">
                    <div className="flex flex-row items-center">
                      <Trash className="mr-2 text-stone-400" size={20} />
                      Trash
                    </div>
                  </div>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
