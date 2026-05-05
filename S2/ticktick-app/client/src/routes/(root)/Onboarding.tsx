import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostData } from "@/hooks/useFetch";
import { TypeCard } from "@/components/cards/onboarding/TypeCard";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { onBoardingFormSchema, onBoardingValues } from "@/utils/schema";
import { Workspace } from "@/types/types";
import { useAuth } from "@/contexts/AuthProvider";
import { LoaderCircle } from "lucide-react";


interface WorkspacePayload{
  workspaceName: string;
  workspaceTypes: string[];
}
interface WorkspaceResponse {
  success: boolean,
  workspace: {
    workspace: Workspace
  };
}

const LIST_TYPES = [
  {
    type: "Personal",
    emoji: "🏠",
    description: "For your daily tasks, groceries, and personal projects",
  },
  {
    type: "School",
    emoji: "🎓",
    description: "Track assignments, exams, and study schedules",
  },
  {
    type: "Work",
    emoji: "💼",
    description: "Manage projects, meetings, and professional goals",
  },
  {
    type: "Daily",
    emoji: "📅",
    description: "Habits, routines, and recurring tasks",
  },
];

const STEP_TITLES = [
  "Let's create your workspace 🚀",
  "Customize your experience ✨",
  "Review your setup 📝",
  "All set! 🎉",
];

const STEP_DESCRIPTIONS = [
  "Give your workspace a name that inspires productivity",
  "Select the types of lists you'll use most often",
  "Double-check everything before we create your workspace",
  "Your workspace is ready! Time to get things done",
];

export default function Onboarding() {

  const { user } = useAuth();

  const [ workspace, setWorkspace ] = useState<Workspace>();
  const [step, setStep] = useState(0);
  
  const form = useForm<onBoardingValues>({
    resolver: zodResolver(onBoardingFormSchema),
    defaultValues: {
      workspaceName: "",
      workspaceTypes: [],
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        workspaceName: `${user.username}'s Workspace`,
        workspaceTypes: [],
      });
    }
  }, [user, form]);

  const { mutate, isPending } = usePostData<WorkspaceResponse, WorkspacePayload>("/workspace/onboard", {
    onSuccess: (data) => {
      setStep(3)
      localStorage.setItem("activeWorkspaceId", data.workspace.workspace._id)
      setWorkspace(data.workspace.workspace)
    },
    onError: (err: any) => {
      toast.error("Error!", {
        description: err.response?.data?.message || "Something went wrong",
      });
    },
  });

  const toggleType = useCallback(
    (type: string) => {
      const current = form.getValues("workspaceTypes");
      form.setValue(
        "workspaceTypes",
        current.includes(type)
          ? current.filter((t) => t !== type)
          : [...current, type]
      );
    },
    [form]
  );

  const handleNext = async () => {
    const isValid = await form.trigger(["workspaceName", "workspaceTypes"][step] as any);
    if (!isValid) return;
    setStep((prev) => prev + 1);
  };

  const handleSubmit = (values: onBoardingValues) => {
    mutate({
      workspaceName: values.workspaceName.toLowerCase(),
      workspaceTypes: values.workspaceTypes.map((t) => t.toLowerCase()),
    });
  };

  const workspaceName = form.watch("workspaceName");
  const workspaceTypes = form.watch("workspaceTypes");

  return (
      <div className="flex items-center justify-center h-[100dvh] px-4 w-full relative bg-white dark:bg-black">
        <img src="https://img.freepik.com/premium-photo/collection-notebooks-papers-with-pen-table_1305924-552.jpg" className="absolute z-1 opacity-10 w-full h-screen object-cover"/>
        <div className="rounded-2xl shadow-xl p-8 w-full max-w-md z-10 bg-white dark:bg-black">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-1">{STEP_TITLES[step]}</h2>
            <p className="text-sm text-stone-400 mb-4">
              {STEP_DESCRIPTIONS[step]}
            </p>
            <div className="relative w-full h-2 bg-gray-200 dark:bg-accent rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                  >
                    <FormField
                      control={form.control}
                      name="workspaceName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Workspace Name</FormLabel>
                          <FormControl>
                            <Input
                              className="input-register no-ring"
                              placeholder="e.g. Productivity Hub"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      className="mt-4 w-full"
                      onClick={handleNext}
                      disabled={workspaceName.trim().length < 3}
                    >
                      Continue
                    </Button>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                  >
                    <FormField
                      control={form.control}
                      name="workspaceTypes"
                      render={() => (
                        <FormItem>
                          <FormLabel>Select list types</FormLabel>
                          <div className="grid grid-cols-1 gap-3 mt-2">
                            {LIST_TYPES.map(({ type, emoji, description }) => (
                              <TypeCard
                                key={type}
                                type={type}
                                emoji={emoji}
                                description={description}
                                selected={workspaceTypes.includes(type)}
                                onToggle={toggleType}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-between mt-4">
                      <Button type="button" variant="ghost" onClick={() => setStep(0)}>
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={handleNext}
                        disabled={workspaceTypes.length === 0}
                      >
                        Continue
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                  >
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">Workspace Name</h3>
                        <p className="text-stone-400">
                          {workspaceName || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">List Types</h3>
                        <p className="text-stone-400">
                          {workspaceTypes.length > 0
                            ? workspaceTypes.join(", ")
                            : "None selected"}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between mt-6">
                      <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button type="submit" disabled={isPending}>
                        {isPending ? <LoaderCircle className="animate-spin"/> : null}
                        {isPending ? "Creating" : "Create Workspace"}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center"
                  >
                    <div className="text-5xl mb-4">🎯</div>
                    <h2 className="text-xl font-semibold mb-2">
                      Workspace Ready!
                    </h2>
                    <p className="mb-6 text-gray-600 dark:text-gray-400">
                      Your personalized productivity space is all set up and
                      waiting for you.
                    </p>
                    <Button
                      disabled={isPending}
                      className="w-full"
                      type="button"
                      onClick={() => (window.location.href = `${workspace?._id}/inbox`)}
                    >
                      Launch Dashboard
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Form>
        </div>
      </div>
  );
}