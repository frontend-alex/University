import * as crypto from "crypto";
import { ListType } from "../types/Enums";

export class Utils {
  static generateOtp(): string {
    return crypto.randomInt(100000, 999999).toString();
  }
  static generateAvatar(username: string): string {
    const name = username.slice(0, 2).toUpperCase();
    return `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;
  }

  static normalizeArray = (val: any): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val.map((id) => id.toString());
    return [val.toString()];
  };

  static getDummyTasksForListType(type: ListType): string[] {
    switch (type) {
      case ListType.Personal:
        return [
          "Buy groceries",
          "Workout for 30 mins",
          "Call Mom",
          "Read a book",
          "Do laundry",
          "Water the plants",
          "Pay bills",
          "Meal prep for the week",
          "Declutter workspace",
          "Plan weekend",
        ];
      case ListType.School:
        return [
          "Finish math homework",
          "Read biology chapter",
          "Prepare for history quiz",
          "Attend group project meeting",
          "Submit essay draft",
          "Organize notes",
          "Review lecture slides",
          "Practice coding assignment",
          "Print study guides",
          "Plan study breaks",
        ];
      case ListType.Work:
        return [
          "Check emails",
          "Attend stand-up meeting",
          "Finish quarterly report",
          "Plan next sprint",
          "Review teammate PRs",
          "Client follow-up",
          "Document API changes",
          "Update project board",
          "Backup data",
          "Schedule 1:1",
        ];
      default:
        return [
          "Wake up early",
          "Make bed",
          "Take a walk",
          "Drink water",
          "Review goals",
          "Eat healthy breakfast",
          "Write in journal",
          "Plan daily tasks",
          "Limit social media",
          "Go to bed on time",
        ];
    }
  }
}
