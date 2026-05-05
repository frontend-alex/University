"use client"

import type React from "react"
import type { Activity } from "@/types/response"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useActivityLog } from "./hooks/useActivity"
import {
  ActivityIcon,
  Calendar,
  Mail,
  MapPin,
} from "lucide-react"
import { formatTime, getUserInitials, isToday } from "@/lib/utils"
import { User } from "@/types/types"
import { activityMap } from "@/constants/data"

const getActivityConfig = (action: string) => {
 
  const match = activityMap.find((entry) => action.includes(entry.keyword))
  const { type, icon, color } = match?.config || {
    type: "Activity",
    icon: ActivityIcon,
    color: "gray",
  }

  return {
    type,
    icon,
    dotColor: `bg-${color}-500`,
    badgeColor: `bg-${color}-50 text-${color}-700 border-${color}-200 dark:bg-${color}-950/20 dark:text-${color}-300 dark:border-${color}-800`,
    tooltip: {
      created: "Something new was created",
      updated: "An item was modified or updated",
      completed: "A task or item was marked as complete",
      deleted: "Something was permanently removed",
      added: "A new team member joined",
      commented: "Someone left a comment",
    }[match?.keyword as string] || "General activity occurred",
  }
}



export const UserProfileCard: React.FC<{ user: User }> = ({ user }) => (
  <HoverCard>
    <HoverCardTrigger asChild>
      <div className="cursor-pointer">
        <Avatar className="size-6">
          <AvatarImage src={user.imageUrl || "/placeholder.svg"} />
          <AvatarFallback>
            {getUserInitials(user.username)}
          </AvatarFallback>
        </Avatar>
      </div>
    </HoverCardTrigger>
    <HoverCardContent className="w-80 p-4" side="left">
      <div className="flex gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={user.imageUrl || "/placeholder.svg"} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
            {getUserInitials(user.username)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <h4 className="text-lg font-semibold">{user.username}</h4>
          <p className="text-sm text-stone-400">Team Member</p>
          <div className="space-y-1 text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <Mail className="w-3 h-3" />
              <span>{user.email || `${user.username.toLowerCase().replace(" ", ".")}@company.com`}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              <span>Active today</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3" />
              <span>Online</span>
            </div>
          </div>
          <div className="pt-2">
            <Badge variant="secondary" className="text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse" />
              Active
            </Badge>
          </div>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
)

const ActivityBadge: React.FC<{ config: ReturnType<typeof getActivityConfig> }> = ({ config }) => {
  const IconComponent = config.icon
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={`${config.badgeColor} flex items-center gap-1.5 text-xs font-medium`}>
            {/* <div className={`w-2 h-2 ${config.dotColor} rounded-full animate-pulse`} /> */}
            <IconComponent className="w-3 h-3" />
            {config.type}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{config.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const ActivitySection: React.FC<{
  label: string
  activities: Activity[]
}> = ({ label, activities }) => {
  if (!activities.length) return null
  return (
    <section>
      <h3 className="font-semibold flex items-center gap-2">
        {/* <div className={`w-2 h-2 ${label === "Today" ? "bg-blue-500" : "bg-purple-500"} rounded-full animate-pulse`} /> */}
        {label}
      </h3>
      <div className="space-y-2">
        {activities.map((activity) => {
          const config = getActivityConfig(activity.action)
          return (
            <div
              key={activity._id}
              className="flex items-center gap-4 py-3 rounded-lg transition-all duration-200 group"
            >
              <UserProfileCard user={activity.user.id} />
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <ActivityBadge config={config} />
                  <span className="text-xs text-stone-400">
                    {formatTime(activity.createdAt)}
                  </span>
                </div>
                <p className="text-sm">
                  <span className="font-semibold text-base bg-gradient-to-r bg-clip-text">
                    {activity.user.username}
                  </span>
                  <span className="text-stone-400 ml-1">{activity.action}</span>
                </p>
              </div>
              {/* <div className="flex-shrink-0">
                <div className={`w-3 h-3 ${config.dotColor} rounded-full opacity-60 group-hover:opacity-100`} />
              </div> */}
            </div>
          )
        })}
      </div>
    </section>
  )
}

const SkeletonLoader: React.FC = () => (
  <section>
    <Skeleton className="h-4 w-16 mb-6" />
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="flex items-center gap-3 py-3 animate-pulse">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  </section>
)

const InboxActivity: React.FC = () => {
  const { activityData, isPending } = useActivityLog(localStorage.getItem("activeWorkspaceId"))
  const activities = activityData ?? []

  const groupedActivities = {
    Today: activities.filter((a) => isToday(a.createdAt)),
    Yesterday: activities.filter((a) => !isToday(a.createdAt)),
  }

  return (
    <div className="h-full">
      <div className="h-[calc(100vh-60px)] overflow-y-auto p-6 space-y-8">
        {isPending ? (
          <>
            <SkeletonLoader />
            <SkeletonLoader />
          </>
        ) : activities.length ? (
          <>
            <ActivitySection label="Today" activities={groupedActivities.Today} />
            <ActivitySection label="Yesterday" activities={groupedActivities.Yesterday} />
          </>
        ) : (
          <div className="text-center flex-col-1 p-8">
            <div className="size-11 mx-auto rounded-lg flex items-center justify-center bg-gray-100 dark:bg-neutral-800">
              <ActivityIcon className="text-stone-400" />
            </div>
            <h3 className="text-lg font-semibold">No activity yet</h3>
            <p className="text-stone-400 text-sm">Activity will appear here as your team works</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default InboxActivity
