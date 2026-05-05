import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthProvider } from "@/types/enums";
import {
  changeInformationSchemaForm,
  ChangeInformationValues,
} from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, CheckCheck, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useUpdateUserInfo } from "./hooks/useChangeCredentials";
import { useAuth } from "@/contexts/AuthProvider";
import { toast } from "sonner";

const ChangeInformation = () => {
  const { user } = useAuth();

  const initialValues = {
    username: user?.username,
    email: user?.email,
  };

  const changeInformationForm = useForm<ChangeInformationValues>({
    resolver: zodResolver(changeInformationSchemaForm),
    defaultValues: initialValues,
  });

  const { updateInformation, isPending } = useUpdateUserInfo();

  const onSubmitChangeInformation = async (data: ChangeInformationValues) => {
    try {
      await updateInformation(data);
      changeInformationForm.reset(data);
    } catch (err) {
      toast.error("Failed to update information");
    }
  };

  return (
    <Form {...changeInformationForm}>
      <form
        onSubmit={changeInformationForm.handleSubmit(onSubmitChangeInformation)}
      >
        <div className="grid-3 gap-5 lg:gap-0">
          <div className="flex-col-1 items-start">
            <h1 className="font-bold text-xl">Personal Information</h1>
            <p className="text-sm text-stone-400">
              Change your identity information
            </p>
            <Button
              disabled={!changeInformationForm.formState.isDirty || isPending}
              type="submit"
              className="w-max mt-3 px-5"
            >
              {isPending && <LoaderCircle className="animate-spin mr-2" />}
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>

          <div className="col-span-2 lg:w-3/5">
            <div className="flex-col-3">
              <FormField
                control={changeInformationForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-1">Username</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        className="input-register no-ring"
                        placeholder="John"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex-col-2">
                <FormField
                  control={changeInformationForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mb-1">Email</FormLabel>
                      <FormControl>
                        <Input
                          disabled={
                            user?.provider !== AuthProvider.Credentials ||
                            isPending
                          }
                          className={`bg-neutral-50 dark:bg-input/30 no-ring border ${
                            user?.emailVerified
                              ? "border-lime-600"
                              : "border-amber-600"
                          }`}
                          placeholder="your@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center space-x-2">
                  {user?.emailVerified ? (
                    <>
                      <CheckCheck size={15} className="text-lime-600" />
                      <p className="text-sm text-lime-600">Email verified</p>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={15} className="text-amber-600" />
                      <p className="text-sm text-amber-600">
                        Email not verified
                      </p>
                      <Link to={`/verify-email?email=${user?.email}`}>
                        <p className="underline text-sm cursor-pointer">
                          Verify Now
                        </p>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ChangeInformation;
