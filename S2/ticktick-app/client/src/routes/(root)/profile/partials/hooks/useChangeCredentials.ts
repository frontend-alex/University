import { useAuth } from "@/contexts/AuthProvider";
import { usePostData } from "@/hooks/useFetch";
import { AuthProvider } from "@/types/enums";
import { toast } from "sonner";

interface ChangeUsernamePayload {
  username: string;
}

interface ChangeEmailPayload {
  email: string;
}

export const useUpdateUserInfo = () => {
  const { user, refetchUser } = useAuth();

  const { mutateAsync: changeUsername, isPending: isUsernamePending } =
    usePostData<unknown, ChangeUsernamePayload>("/users/change-username", {
      onSuccess: (data: any) => {
        toast.success(data.message);
      },
    });

  const { mutateAsync: changeEmail, isPending: isEmailPending } = usePostData<
    unknown,
    ChangeEmailPayload
  >("/users/change-email", {
    onSuccess: (data: any) => {
      toast.success(data.message);
    },
  });

  const updateInformation = async (newData: {
    username: string;
    email: string;
  }) => {
    const promises = [];

    if (newData.username !== user?.username) {
      promises.push(changeUsername({ username: newData.username }));
    }

    if (
      newData.email !== user?.email &&
      user?.provider === AuthProvider.Credentials
    ) {
      promises.push(changeEmail({ email: newData.email }));
    }

    await Promise.all(promises);
    await refetchUser();

  };

  return {
    updateInformation,
    isPending: isUsernamePending || isEmailPending,
  };
};
