import { EntityType, TaskColors, TodoPriority, TodoStatus } from "./enums";
import { User, Workspace } from "./types";

export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface List {
  list: any;
  _id: string;
  title: string;
  completedTasksCount: number;
  totalTasksCount: number;
  workspace: Workspace;
  listType: string;
  priority: TodoPriority;
  createdAt: string;
  updatedAt: string;
}

export type ListArrayResponse = BaseResponse<List[]>;
export type SingleListResponse = BaseResponse<List>;

export interface Task {
  _id: string;
  title: string;
  description?: string;
  list: string;
  completed: boolean;
  status: TodoStatus;
  priority: string;
  deleted?: boolean;
  type: "event" | "task",
  assignedTo?: any;
  time: string | Date;

  startTime?: string;
  endTime?: string;
  color?: TaskColors;
  category?: string;
}

export interface UserTasksData {
  assignedTasks: Task[];
  listTasks: Task[];
}


export type TaskArrayResponse = BaseResponse<Task[]>;
export type SingleTaskResponse = BaseResponse<Task>;
export type UserTasksResponse = BaseResponse<UserTasksData>;

export interface Activity {
  _id: string;
  workspace: string;
  user: {
    username: string;
    id: User;
  };
  action: string;
  entityType: EntityType;
  entityId: string;
  entityTitle: string;
  createdAt: string;
}
export type ActivityResponse = BaseResponse<Activity[]>;

export type NotificationType = "workspace_invite" | "task_assigned";

export interface BaseNotification {
  _id: string;
  type: NotificationType;
  userId: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceInviteNotification extends BaseNotification {
  type: "workspace_invite";
  data: {
    workspaceId: string;
    workspaceTitle: string;
    invitedBy: string;
    invitedByProfilePicture: string;
  };
}

export interface TaskAssignedNotification extends BaseNotification {
  type: "task_assigned";
  data: {
    workspaceId: string;
    workspaceTitle: string;
    taskId: string;
    taskTitle: string;
    assignedBy: string;
    assignedByProfilePicture: string;
  };
}

export type Notification =
  | WorkspaceInviteNotification
  | TaskAssignedNotification;

export type NotificationReponse = BaseResponse<Notification[]>;

export interface Chat {
  _id: string;
  workspaceId: string;
  participants: {
    userId: User;
    lastSeen: any;
    _id: string;
    unreadCount: number;
  }[];
  lastMessage?: {
    _id: string;
    content: string;
    sender: User;
    createdAt: string;
  };
  updatedAt: string;
}

export type ChatArrayResponse = BaseResponse<Chat[]>;
export type SingleChatResponse = BaseResponse<Chat>;
export type NewChatResponse = BaseResponse<Chat>;

export interface Message {
  _id: string;
  conversationId: string;
  sender: User;
  toUserId: string;
  content: string;
  readBy: User[];
  createdAt: string;
  updatedAt: string;
}

export type MessageArrayResponse = BaseResponse<Message[]>;
export type SingleMessageResponse = BaseResponse<Message>;
export type NewMessageResponse = BaseResponse<Message>;
