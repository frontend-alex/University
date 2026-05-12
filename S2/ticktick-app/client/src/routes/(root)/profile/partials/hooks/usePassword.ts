import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { usePostData } from "@/hooks/useFetch";
import { useAuth } from "@/contexts/AuthProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordValues, changePasswordSchemaForm } from "@/utils/schema";

export const usePasswordFormWithSubmit = (isCreateMode: boolean = false) => {
  const { refetchUser } = useAuth();

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchemaForm),
    mode: "onChange",
    defaultValues: {
      password: isCreateMode ? undefined : "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const newPassword = form.watch("newPassword");

  const passwordChecks = [
    { label: "Capital & Small", isValid: /[A-Z]/.test(newPassword) },
    { label: "Numbers", isValid: /[0-9]/.test(newPassword) },
    { label: "Symbols", isValid: /[^a-zA-Z0-9]/.test(newPassword) },
    { label: "6 Character", isValid: newPassword.length > 6 },
  ];

  const endpoint = isCreateMode
    ? "/auth/create-password"
    : "/auth/update-password";

  const { mutateAsync, isPending } = usePostData<ChangePasswordValues>(
    endpoint,
    {
      onSuccess: async (data: any) => {
        await refetchUser();
        toast.success(data.message);
        form.reset();
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Something went wrong");
      },
    }
  );

  const onSubmit = async (data: ChangePasswordValues) => {
    await mutateAsync(data);
  };

  return {
    form,
    passwordChecks,
    showCurrentPassword: !isCreateMode,
    onSubmit,
    isPending,
  };
};
