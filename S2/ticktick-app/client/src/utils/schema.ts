import { ListType, TodoPriority, TodoStatus } from "@/types/enums";
import * as z from "zod";

export const loginSchemaForm = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginFormValues = z.infer<typeof loginSchemaForm>;

export const registerSchemaForm = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  username: z.string().min(4, {
    message: "Username must be at least 4 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export type RegisterFormValues = z.infer<typeof registerSchemaForm>;

export const otpSchema = z.object({
  otp: z
    .array(z.string().length(1, "Each digit is required"))
    .length(6, "OTP must be 6 digits"),
});

export type otpFormValues = z.infer<typeof otpSchema>;



export const onBoardingFormSchema = z.object({
  workspaceName: z.string().min(3, "Workspace name is too short"),
  workspaceTypes: z.array(z.string()).min(1, "Select at least one type"),
});

export type onBoardingValues = z.infer<typeof onBoardingFormSchema>


export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
    priority: z.enum([
      TodoPriority.None, 
      TodoPriority.Low,
      TodoPriority.Medium,
      TodoPriority.High,
      TodoPriority.Urgent,
    ]),
  status: z.enum([
    TodoStatus.Todo,
    TodoStatus.InProgress,
    TodoStatus.Done,
    TodoStatus.Archived, 
  ]),
});


export type TaskFormValues = z.infer<typeof taskFormSchema>


export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  assignedTo: z.string().optional(),
  priority: z.nativeEnum(TodoPriority).optional(),
})

export type CreateTaskValues = z.infer<typeof createTaskSchema>

export const createListschema = z.object({
  title: z.string().min(1, "Title is required"),
  listType: z.nativeEnum(ListType),
  priority: z.nativeEnum(TodoPriority).optional(),
})

export type CreateListValues = z.infer<typeof createListschema>


export const editListSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export type EditListValues = z.infer<typeof editListSchema>;


export const changeInformationSchemaForm = z.object({
  username: z.string().min(3, "Username is too short"),
  email: z.string().email("Invalid email address"),
})

export type ChangeInformationValues = z.infer<typeof changeInformationSchemaForm>;

  
export const changePasswordSchemaForm = z
  .object({
    password: z.string().optional(),
    newPassword: z
      .string()
      .min(6, "")
      .refine((val) => /[A-Z]/.test(val), {
        // message: "Password must include at least one uppercase letter",
      })
      .refine((val) => /[a-z]/.test(val), {
        // message: "Password must include at least one lowercase letter",
      })
      .refine((val) => /[0-9]/.test(val), {
        // message: "Password must include at least one number",
      })
      .refine((val) => /[^a-zA-Z0-9]/.test(val), {
        // message: "Password must include at least one symbol",
      }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });


export type ChangePasswordValues = z.infer<typeof changePasswordSchemaForm>;


export const inviteUsersSchemform = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  })
})

export type inviteUserValue = z.infer<typeof inviteUsersSchemform>;
