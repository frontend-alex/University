import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Check, X, LoaderCircle, Eye, EyeClosed } from "lucide-react";
import { Link } from "react-router-dom";
import { usePasswordFormWithSubmit } from "./hooks/usePassword";
import { useState } from "react";

const ChangePassword = () => {
  const [togglePassword, setTogglePassword] = useState<boolean>(false);
  const [toggleNewPassword, setToggleNewPassword] = useState<boolean>(false);

  const { form, passwordChecks, onSubmit, isPending, showCurrentPassword } =
    usePasswordFormWithSubmit(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid-3 gap-5 lg:gap-0">
          <div className="flex-col-1">
            <h1 className="font-bold">Security</h1>
            <p className="text-stone-400 text-sm">Change your password</p>
            <Button
              disabled={isPending || !form.formState.isValid}
              className="w-max px-5 mt-3"
              variant="outline"
            >
              {isPending && <LoaderCircle className="animate-spin" />}
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>

          <div className="col-span-2 lg:w-3/5">
            <div className="flex-col-3">
              {showCurrentPassword && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <div className="flex-col-3 relative">
                          <Input
                            {...field}
                            type={togglePassword ? "text" : "password"}
                            className="no-ring input-register"
                            disabled={isPending}
                            placeholder="••••••••"
                          />
                          <div
                            onClick={() => setTogglePassword((prev) => !prev)}
                            className="absolute top-[10px] right-5 cursor-pointer"
                          >
                            {togglePassword ? (
                              <EyeClosed size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </div>
                          <p className="flex-end text-sm text-stone-400">
                            Forgoten your password?
                            <Link
                              to="/reset-password"
                              className="text-black dark:text-white underline ml-1"
                            >
                              Reset Password
                            </Link>
                          </p>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex-col-2">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={toggleNewPassword ? "text" : "password"}
                            className="no-ring input-register"
                            disabled={isPending}
                            placeholder="••••••••"
                          />
                          <div
                            onClick={() =>
                              setToggleNewPassword((prev) => !prev)
                            }
                            className="absolute top-[10px] right-5 cursor-pointer"
                          >
                            {togglePassword ? (
                              <EyeClosed size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </div>
                        </div>
                      </FormControl>
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

export default ChangePassword;
