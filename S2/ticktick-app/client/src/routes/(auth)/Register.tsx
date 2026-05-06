import { useForm } from "react-hook-form";
import { LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/contexts/LanguageProvider";
import { navigateGoogle, useAccountRegistration } from "@/services/authService";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RegisterFormValues, registerSchemaForm } from "@/utils/schema";
import AccountLayout from "@/components/layouts/AccountLayout";
import { NavbarLogo } from "@/components/Navbar";
import { cn } from "@/lib/utils";

const Register = () => {
  const { translations } = useLanguage();
  const { registerAccount, isPending } = useAccountRegistration();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchemaForm),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    await registerAccount(data);
  };

  return (
    <AccountLayout
      video="https://videos.pexels.com/video-files/4832136/4832136-uhd_1440_2560_24fps.mp4"
      position="left"
    >
      <div className="flex-col-5 justify-center px-5 md:px-20 xl:px-36 py-10 w-full">
        <NavbarLogo />
        <h1 className="text-4xl lg:text-6xl font-bold">
          {translations.create_account || "Create Account"}
        </h1>
        <p className="font-dm text-lg">
          {translations.register_message || "Join our community today."}
        </p>


        <Button
          variant={"outline"}
          className="cursor-pointer rounded-lg"
          onClick={navigateGoogle}
        >
          <img className="size-5" src="/images/google-logo.png" />
          <p>{translations.register_google || "Continue with Google"}</p>
        </Button>

        <div className="flex-row-3 w-full">
          <div className="w-full h-[1px] bg-neutral-200 dark:bg-neutral-800" />
          <p className="text-sm">{translations.or || "Or"}</p>
          <div className="w-full h-[1px] bg-neutral-200 dark:bg-neutral-800" />
        </div>

        <Form {...form}>
          <form className="flex-col-5" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex-col-3 w-full">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translations.username || "Username"}</FormLabel>
                    <FormControl>
                      <Input
                        className="input-register"
                        placeholder="johndoe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translations.email || "Email"}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        className="input-register"
                        placeholder="example@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translations.password || "Password"}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="input-register"
                        placeholder="P@ssw0rd123"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-col-3">
              <Button
                className={cn("button-main font-corm")}
                disabled={isPending}
                type="submit"
              >
                {isPending ? (
                  <div className="flex-center gap-2">
                    <LoaderCircle className="animate-spin" />{" "}
                    {translations.creating_account || "Creating account..."}
                  </div>
                ) : (
                  translations.register || "Register"
                )}
              </Button>
              <p className="text-right text-sm font-dm">
                {translations.already_have_account ||
                  "Already have an account?"}{" "}
                <a
                  href="/login"
                  className="underline text-main font-dm text-indigo-600"
                >
                  {translations.login || "Login"}
                </a>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </AccountLayout>
  );
};

export default Register;
