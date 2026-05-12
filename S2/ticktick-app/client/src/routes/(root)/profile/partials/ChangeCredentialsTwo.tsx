import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, LoaderCircle } from "lucide-react";
import { usePasswordFormWithSubmit } from "./hooks/usePassword";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const CreatePassword = () => {

  const { form, passwordChecks, onSubmit, isPending } = usePasswordFormWithSubmit(true);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid-3 gap-5 lg:gap-0">
          <div className="flex-col-1">
            <h1 className="font-bold text-xl">Security</h1>
            <p className="text-stone-400 text-sm">Create your password</p>
            <Button disabled={isPending || !form.formState.isValid} className="w-max px-5 mt-3" variant="outline">
              {isPending && <LoaderCircle className="animate-spin" />}
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>

          <div className="col-span-2 lg:w-3/5">
            <div className="flex-col-3">
              <div className="flex-col-2">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          className="no-ring input-register"
                          disabled={isPending}
                          placeholder="••••••••"
                        />
                      </FormControl>
                      {/* <FormMessage /> */}
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-4 sm:grid-cols-2 xl:grid-cols-4 justify-items-center my-3">
                  {passwordChecks.map(({ label, isValid }) => (
                    <div key={label} className="flex items-center gap-2">
                      {isValid ? (
                        <Check className="text-lime-600 w-4 h-4" />
                      ) : (
                        <X className="text-stone-400 w-4 h-4" />
                      )}
                      <span
                        className={
                          isValid
                            ? "text-lime-600 text-xs"
                            : "text-stone-400 text-xs"
                        }
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                <FormField
                  control={form.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          className="no-ring input-register"
                          disabled={isPending}
                          placeholder="••••••••"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CreatePassword;
