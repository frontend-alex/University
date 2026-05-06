export enum UserRole {
  Admin = "admin",
  User = "user",
}

export enum WorkspaceUserRoles {
  Owner = "owner",
  Admin = "admin",
  Member = "member",
}

export enum AuthProvider {
  Credentials = "credentials",
  Google = "google",
}

export enum ListType {
  Personal = "personal",
  School = "school",
  Work = "work",
  Daily = "daily",
  Custom = "custom",
}

export enum WorkspaceType {
  Personal = "personal",
  Team = "team",
}

export enum TodoPriority {
  None = "none",
  Low = "low",
  Medium = "medium",
  High = "high",
  Urgent = "urgent",
}

export enum TodoStatus {
  Todo = "todo",
  InProgress = "in_progress",
  Done = "done",
  Archived = "archived",
}
export enum TaskColors {
  Purple = "purple",
  Blue = "blue",
  Green = "green",
  Orange = "orange",
  Red = "red",
  Teal = "teal",
  Stone = "stone"
}

export enum SubscriptionStatus {
  Active = "active",
  Canceled = "canceled",
  Trailing = "trailing",
  PastDue = "past_due",
}

export enum SubscriptionTier {
  Free = "free",
  Pro = "pro",
  Premium = "premium",
}


export enum EntityType {
  Task = "task", 
  List = "list", 
  Workspace = "workspace",
  Other = "other"
}
