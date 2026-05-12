

import {
  SubscriptionStatus,
  SubscriptionTier,
  TodoPriority,
  TodoStatus,
  UserRole,
  WorkspaceType,
  WorkspaceUserRoles,
} from "./enums";
import { Task } from "./response";

export interface LoginResponseProps {
  message: string;
  success: boolean;
  token: string;
}

export interface UserResponse {
  success: boolean;
  user: User;
}

interface Subscription {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  startedAt?: Date;
  expiresAt?: Date;
  trialEndsAt?: Date;
  customerId?: string;
  subscriptionId?: string;
  isLifetime?: boolean;
}

export interface AiUsage {
  date: string;
  count: number;
}

export interface WorkspaceMember {
  user: User;
  role: WorkspaceUserRoles;
  joinedAt: Date;
}
export interface Workspace {
  imageUrl: string;
  user: string;
  _id: string;
  title: string;
  type: WorkspaceType;
  members: WorkspaceMember[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  email: string;
  imageUrl: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  workspaces: Workspace[];
  emailVerified: boolean;
  hasCompletedOnboarding: boolean;
  role: UserRole;
  provider: string;
  hasPassword: boolean;
  subscription?: Subscription;
  aiUsage?: AiUsage;
}

export interface Invoice {
  id: string;
  created: number;
  amount_paid: number;
  status: string;
  lines: {
    data: {
      description: string;
    }[];
  };
  invoice_pdf: string;
  currency: string;
}

export type EventColor = "purple" | "blue" | "green" | "orange" | "red" | "teal"
export type ItemType = "event" | "task"
export type EventType = "meeting" | "appointment" | "call" | "deadline" | "reminder" | "personal" | "work" | "other"

export interface CalendarItem {
  id: string
  title: string
  date: string
  startTime?: string 
  endTime?: string 
  type: ItemType
  eventType?: EventType 
  priority: TodoPriority
  status: TodoStatus;
  color: EventColor
  description?: string
  time?: string 
  category: string
}

export interface TaskManagerProps {
  list: any;
  tasks: Task[];
  selectedTaskId: any;
  onSelectTask: (id: string | null) => void;
  onReorderTasks: (newTasks: Task[]) => void;
  softDeleteTask: (id: string) => void;
}

export interface SortableTaskProps {
  task: Task;
  selected: boolean;
  onSelectTask: (id: string) => void;
  softDeleteTask?: (id: string) => void;
}

export interface EditTaskProps {
  selectedTask?: Task;
  readOnly: boolean;
  showTrashActions: boolean;
  onRestore: () => void;
  onDeletePermanently: () => void | undefined;
}
