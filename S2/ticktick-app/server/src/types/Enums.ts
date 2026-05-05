// --------------------------------------User ENUMS-------------------------------------------//
export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

export enum AuthProvider {
  Credentials = "credentials",
  Google = "google",
}
// --------------------------------------User ENUMS-------------------------------------------//


// --------------------------------------List ENUMS-------------------------------------------//

export enum ListType {
  Personal = 'personal',
  School = 'school',
  Work = 'work',
  Daily = 'daily',
  Custom = 'custom'
}
// --------------------------------------List ENUMS-------------------------------------------//


// --------------------------------------Workspace ENUMS-------------------------------------------//

export enum WorkspaceType {
  Personal = 'personal',
  Team = 'team' 
}
export enum WorkspaceUserRoles {
  Owner = "owner",
  Admin = "admin",
  Member = "member",
}
// --------------------------------------Workspace ENUMS-------------------------------------------//




// --------------------------------------TASKS ENUMS-------------------------------------------//
export enum TaskTypes {
  Task = "task",
  Event = "event"
}

export enum TaskPriority {
  None = 'none',
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Urgent = 'urgent',
}

export enum TaskStatus {
  Todo = 'todo',
  InProgress = 'in_progress',
  Done = 'done',
  Archived = 'archived',
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
// --------------------------------------TASKS ENUMS-------------------------------------------//
