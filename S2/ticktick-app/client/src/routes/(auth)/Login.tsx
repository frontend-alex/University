import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/contexts/LanguageProvider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthProvider";
import { navigateGoogle, useAccountLogin } from "@/services/authService";
import { LoginFormValues, loginSchemaForm } from "@/utils/schema";
import AccountLayout from "@/components/layouts/AccountLayout";
import { NavbarLogo } from "@/components/Navbar";

const Login = () => {
  const { login } = useAuth();
  const { loginAccount, isPending } = useAccountLogin(login);
  const { translations } = useLanguage();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchemaForm),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmitLogin = async (data: LoginFormValues) => {
    await loginAccount(data);
  };

  return (
    <AccountLayout
      video="https://videos.pexels.com/video-files/6177769/6177769-hd_1080_1920_24fps.mp4"
      position="right"
    >
      <div className="flex-col-5 justify-center px-5 md:px-20 xl:px-36 py-10 w-full">
        <NavbarLogo />
        <h1 className="text-4xl lg:text-6xl font-bold">
          {translations.welcome_back || "Welcome Back!"}
        </h1>
        <p className="font-dm text-lg">
          {translations.login_message || "Log in to your account to continue."}
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

        <Form {...loginForm}>
          <form
            className="flex-col-5"
            onSubmit={loginForm.handleSubmit(onSubmitLogin)}
          >
            <div className="flex-col-3 w-full">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translations.email || "Email"}</FormLabel>
                    <FormControl>
                      <Input
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
                control={loginForm.control}
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
              <FormField
                control={loginForm.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex-row-3 justify-end items-center gap-2 mt-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(!!checked)}
                      />
                    </FormControl>
                    <FormLabel className="font-normal font-dm text-stone-400">
                      {translations.remember_me || "Remember me?"}
                    </FormLabel>
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
                    {translations.logging_in || "Logging in..."}
                  </div>
                ) : (
                  translations.login || "Login"
                )}
              </Button>
              <p className="text-right text-sm font-dm">
                {translations.not_a_member || "Not a member?"}{" "}
                <a
                  href="/create-account"
                  className="underline text-main font-dm text-indigo-600"
                >
                  {translations.create_account || "Create an account"}
                </a>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </AccountLayout>
  );
};

export default Login;
