import type { User } from "@/types/types"
import React, { useState, useMemo, useCallback } from "react"
import type { Activity } from "@/types/response"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { PopoverClose } from "@radix-ui/react-popover"
import { ActivityIcon, Calendar, Mail, MapPin, X, Clock, Search, SortDesc } from "lucide-react"
import { formatTime, getUserInitials, isToday } from "@/lib/utils"
import { activityMap } from "@/constants/data"
import { useActivityLog } from "@/routes/(root)/inbox/partials/hooks/useActivity"

const COLOR_CLASSES = {
  gray: {
    dot: "bg-gray-500",
    badge: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/20 dark:text-gray-300 dark:border-gray-800",
  },
  blue: {
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-800",
  },
  purple: {
    dot: "bg-purple-500",
    badge: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-300 dark:border-purple-800",
  },
  green: {
    dot: "bg-green-500",
    badge: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-300 dark:border-green-800",
  },
}

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
    dotColor: COLOR_CLASSES[color as keyof typeof COLOR_CLASSES]?.dot ?? COLOR_CLASSES.gray.dot,
    badgeColor: COLOR_CLASSES[color as keyof typeof COLOR_CLASSES]?.badge ?? COLOR_CLASSES.gray.badge,
    tooltip:
    {
        created: "Something new was created",
        updated: "An item was modified or updated",
        completed: "A task or item was marked as complete",
        deleted: "Something was permanently removed",
        added: "A new team member joined",
        commented: "Someone left a comment",
      }[match?.keyword as string] || "General activity occurred",
  }
}

const UserProfileCard: React.FC<{ user: User }> = React.memo(({ user }) => (
  <HoverCard>
    <HoverCardTrigger asChild>
      <div className="cursor-pointer" aria-label={`User profile of ${user.username}`} tabIndex={0}>
        <Avatar className="size-6">
          <AvatarImage src={user.imageUrl || "/placeholder.svg"} alt={`${user.username}'s avatar`} />
          <AvatarFallback className="text-sm lowercase">{getUserInitials(user.username)}</AvatarFallback>
        </Avatar>
      </div>
    </HoverCardTrigger>
    <HoverCardContent className="w-80 p-4" side="left">
      <div className="flex gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={user.imageUrl || "/placeholder.svg"} alt={`${user.username}'s avatar`} />
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
            <Badge variant="secondary" className="text-xs flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse" />
              Active
            </Badge>
          </div>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
))

const ActivityBadge: React.FC<{ config: ReturnType<typeof getActivityConfig> }> = React.memo(({ config }) => {
  const IconComponent = config.icon
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            className={`${config.badgeColor} flex items-center gap-1.5 text-xs font-medium`}
            aria-label={`${config.type} activity badge`}
          >
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
})

const ActivityRow: React.FC<{ activity: Activity }> = React.memo(({ activity }) => {
  const config = useMemo(() => getActivityConfig(activity.action), [activity.action])
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors duration-200 group"
      role="listitem"
      aria-label={`${activity.user.username} ${activity.action}`}
    >
      <UserProfileCard user={activity.user.id} />
      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <ActivityBadge config={config} />
          <span className="text-xs text-stone-400">{formatTime(activity.createdAt)}</span>
        </div>
        <p className="text-sm leading-tight">
          <span className="font-medium">{activity.user.username}</span>
          <span className="text-stone-500 ml-1">{activity.action}</span>
        </p>
      </div>
    </div>
  )
})

const ActivitySection: React.FC<{ label: string; activities: Activity[] }> = React.memo(({ label, activities }) => {
  if (!activities.length) return null

  return (
    <div role="region" aria-label={`${label} activities`}>
      <h4 className="text-sm font-semibold text-stone-600 dark:text-stone-300 px-4 flex items-center gap-2 mt-3">
        <div
          className={`w-2 h-2 ${label === "Today" ? "bg-red-500" : "bg-purple-500"} rounded-full`}
          aria-hidden="true"
        />
        {label}
      </h4>
      <div role="list" className="space-y-1">
        {activities.map((activity) => (
          <ActivityRow key={activity._id} activity={activity} />
        ))}
      </div>
    </div>
  )
})

const SkeletonLoader: React.FC = () => (
  <div className="space-y-4 px-4" aria-label="Loading activity feed">
    <Skeleton className="h-4 w-16" />
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="flex items-center gap-3 py-2">
          <Skeleton className="w-6 h-6 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16 rounded-full" />
              <Skeleton className="h-3 w-10" />
            </div>
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  </div>
)

function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value)

  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

const ActivityNotificationDropdown: React.FC = () => {
  const { activityData, isPending } = useActivityLog(localStorage.getItem("activeWorkspaceId"))
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")

  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300)

  const activities = activityData ?? []

  // Memoized filtered & sorted activities
  const processedActivities = useMemo(() => {
    let filtered = activities

    if (debouncedSearchQuery.trim()) {
      const lowerQuery = debouncedSearchQuery.toLowerCase()
      filtered = filtered.filter(
        (activity) =>
          activity.user.username.toLowerCase().includes(lowerQuery) ||
          activity.action.toLowerCase().includes(lowerQuery)
      )
    }

    filtered = filtered.slice() // clone array before sorting

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

    return filtered
  }, [activities, debouncedSearchQuery, sortOrder])

  // Split by today/yesterday (can be extended)
  const groupedActivities = useMemo(() => {
    return {
      Today: processedActivities.filter((a) => isToday(a.createdAt)),
      Yesterday: processedActivities.filter((a) => !isToday(a.createdAt)),
    }
  }, [processedActivities])

  const hasRecentActivity = useMemo(() => activities.some((a) => isToday(a.createdAt)), [activities])

  const getFilteredSections = useCallback(() => {
    return [
      { label: "Today", activities: groupedActivities.Today },
      { label: "Yesterday", activities: groupedActivities.Yesterday },
    ]
  }, [groupedActivities])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative" aria-label="Open activity feed">
          <Clock className="text-stone-400 hover:text-stone-600 transition-colors" size={18} />
          {hasRecentActivity && (
            <div
              className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"
              aria-hidden="true"
            />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0 shadow-lg border-0" align="end" role="dialog" aria-modal="true" aria-label="Activity feed">
        {/* Header */}
        <div className="border-b border-accent p-4 flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <ActivityIcon className="w-4 h-4" />
            Activity Feed
          </h3>
          <PopoverClose asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" aria-label="Close activity feed">
              <X className="w-3 h-3" />
            </Button>
          </PopoverClose>
        </div>

        {/* Search and Sort */}
        <div className="border-b border-accent p-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                aria-label="Search activities"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))}
              className="h-9 w-9 p-0"
              title={`Sort by ${sortOrder === "newest" ? "oldest" : "newest"} first`}
              aria-pressed={sortOrder === "oldest"}
            >
              <SortDesc
                className={`w-4 h-4 transition-transform ${sortOrder === "oldest" ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </Button>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="max-h-96 overflow-y-auto" tabIndex={-1}>
          {isPending ? (
            <div className="py-4">
              <SkeletonLoader />
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center flex flex-col items-center p-8" role="alert" aria-live="polite">
              <div className="size-11 mx-auto rounded-lg flex items-center justify-center bg-gray-100 dark:bg-neutral-800 mb-3">
                {searchQuery ? (
                  <Search className="w-6 h-6 text-stone-400" aria-hidden="true" />
                ) : (
                  <ActivityIcon className="w-6 h-6 text-stone-400" aria-hidden="true" />
                )}
              </div>
              <h4 className="font-semibold mb-1">{searchQuery ? "No matching activities" : "No activity yet"}</h4>
              <p className="text-sm text-stone-400">
                {searchQuery
                  ? `No activities found matching "${searchQuery}"`
                  : "Activity will appear here as your team works"}
              </p>
            </div>
          ) : processedActivities.length === 0 ? (
            <div className="text-center flex flex-col items-center p-8" role="alert" aria-live="polite">
              <div className="size-11 mx-auto rounded-lg flex items-center justify-center bg-gray-100 dark:bg-neutral-800 mb-3">
                <Clock className="w-6 h-6 text-stone-400" aria-hidden="true" />
              </div>
              <h4 className="font-semibold mb-1">No activity found</h4>
              <p className="text-sm text-stone-400">No activity found for the selected time period</p>
            </div>
          ) : (
            <div className="divide-y divide-accent divide-dashed">
              {getFilteredSections().map(({ label, activities }) => (
                <ActivitySection key={label} label={label} activities={activities} />
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ActivityNotificationDropdown
