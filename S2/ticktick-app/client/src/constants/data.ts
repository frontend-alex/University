import {
  Calendar1,
  CheckCircle,
  Crown,
  Edit3,
  Flag,
  Home,
  MessageCircle,
  Plus,
  Settings,
  Trash2,
  UserIcon,
  UserPlus,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageProvider";
import { TodoPriority } from "@/types/enums";

export const URL = "http://localhost:3000";

export const navbarLinks = [
  { name: "Home", path: "/" },
  { name: "Features", path: "/features" },
  { name: "Pricing", path: "/pricing" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export const ProfileLinks = [
  {
    path: "/profile",
    name: "Profile",
    icon: UserIcon,
  },
  {
    path: "/settings",
    name: "Settings",
    icon: Settings,
  },
  {
    path: "/billing",
    name: "Billing",
    icon: Crown,
  },
];

export const LANGAUGES = [
  {
    name: "Bulgarian",
    code: "bg",
    flag: "BG",
  },
  {
    name: "Dutch",
    code: "nl",
    flag: "NL",
  },
  {
    name: "English",
    code: "en",
    flag: "GB",
  },
] as const;

export const DASHBOARD_LINKS = [
  {
    path: `${localStorage.getItem("activeWorkspaceId")}/inbox`,
    id: 0,
    icon: Home,
  },
  {
    path: "/calendar",
    id: 1,
    icon: Calendar1,
  },
  {
    path: "/settings",
    id: 1,
    icon: Settings,
  },
];

export const BREADCRUMBS_TRANSLATION = (): { [key: string]: string } => {
  const { translations } = useLanguage();

  const dashboard = Array.isArray(translations.dashboard)
    ? translations.dashboard.join(", ")
    : translations.dashboard || "Dashboard";

  return {
    dashboard,
  };
};

export const LIST_TYPES = () => {
  const { translations } = useLanguage();

  return [
    {
      type: translations.onboarding_personal,
      emoji: "🏠",
      description: translations.onboarding_personal_desc,
    },
    {
      type: "onboarding_school",
      emoji: "🎓",
      description: translations.onboarding_school_desc,
    },
    {
      type: "onboarding_work",
      emoji: "💼",
      description: translations.onboarding_work_desc,
    },
    {
      type: "onboarding_daily",
      emoji: "📅",
      description: translations.onboarding_daily_desc,
    },
  ];
};

export const priorityOptions = [
  {
    value: TodoPriority.Low,
    label: "Low",
    icon: Flag,
    color: "text-stone-400",
  },
  {
    value: TodoPriority.Medium,
    label: "Medium",
    icon: Flag,
    color: "text-amber-600",
  },
  {
    value: TodoPriority.High,
    label: "High",
    icon: Flag,
    color: "text-orange-600",
  },
  {
    value: TodoPriority.Urgent,
    label: "Urgent",
    icon: Flag,
    color: "text-red-600",
  },
];

export const priorityColorMap: Record<TodoPriority, string> = {
  none: "border-accent",
  low: "border-blue-500",
  medium: "border-yellow-500",
  high: "border-orange-500",
  urgent: "border-red-500",
};

export const activityMap = [
  {
    keyword: "created",
    config: { type: "New Activity", icon: Plus, color: "blue" },
  },
  {
    keyword: "updated",
    config: { type: "Update", icon: Edit3, color: "orange" },
  },
  {
    keyword: "completed",
    config: { type: "Completed", icon: CheckCircle, color: "green" },
  },
  {
    keyword: "deleted",
    config: { type: "Deleted", icon: Trash2, color: "red" },
  },
  {
    keyword: "added",
    config: { type: "New Member", icon: UserPlus, color: "purple" },
  },
  {
    keyword: "commented",
    config: { type: "Comment", icon: MessageCircle, color: "teal" },
  },
];
