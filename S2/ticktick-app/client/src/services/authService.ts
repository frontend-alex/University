import Cookies from "js-cookie";
import { toast } from "sonner";
import { useState } from "react";
import { usePostData } from "@/hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { URL } from "./api";
import { useAuth } from "@/contexts/AuthProvider";

interface RegisterResponse {
  success: boolean;
  message: string;
}

interface SendOtpResponse {
  success: boolean;
  message: string;
}

interface VerifyOtpResponse {
  email: string | null;
  otp: string
}

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
}

interface OtpRequestParams {
  email: string;
}

interface VerifyOtpParams {
  email: string | null;
  otp: string;
}

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export const useAccountRegistration = () => {
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);

  const { mutateAsync: register } = usePostData<RegisterFormValues | RegisterResponse>("/auth/register", {
    onError: (err: any) => {
      const errorData = err?.response?.data || err;
      if (errorData?.otpRedirect) {
        navigate(`/verify-email?email=${errorData.email}`);
        return;
      }

      toast.error("Error!", {
        description: errorData?.message || "Something went wrong.",
      });
    },
  });

  const { mutateAsync: sendOtp } = usePostData<OtpRequestParams | SendOtpResponse>("/auth/send-otp");

  const registerAccount = async (data: RegisterFormValues) => {
    setIsPending(true);
    try {
      const registerResponse: any = await register(data);
      if (registerResponse?.success) {
        const otpResponse: any = await sendOtp({ email: data.email });
        if (otpResponse?.success) {
          navigate(`/verify-email?email=${data.email}`);
        }
      }
    } catch (error) {
    } finally {
      setIsPending(false);
    }
  };

  return { registerAccount, isPending };
};

export const useAccountLogin = (onLoginSuccess: (token: string) => Promise<void>) => {
  const { mutateAsync, isPending } = usePostData<LoginFormValues>("/auth/login", {
    onSuccess: async (response: any) => {
      if (response.success) {
        await onLoginSuccess(response.token);
      }
    },
    onError: (err: any) => {
      toast.error("Error!", {
        description: err?.response?.data?.message || "Login failed",
      });
    },
  });

  const loginAccount = async (data: LoginFormValues) => {
    await mutateAsync(data);
  };

  return { loginAccount, isPending };
};

export const useOtpVerification = () => {
  const { refetchUser } = useAuth();
  const navigate = useNavigate();

  const { mutateAsync: verifyOtp, isPending: isVerifying } = usePostData<VerifyOtpParams, VerifyOtpResponse>("/auth/verify-otp", {
    onSuccess: async (response: any) => {
      if (response.success) {
        const token = localStorage.getItem("authToken");
        if (token) {
          await refetchUser();
          navigate("/");
        } else {
          navigate("/login");
        }
      }
    },
    onError: (err: any) => {
      toast.error("Error!", {
        description: err?.response?.data?.message || "Failed to verify OTP",
      });
    },
  });

  const { mutateAsync: resendOtp, isPending: isResending } = usePostData<OtpRequestParams>("/auth/send-otp", {
    onSuccess: (response: any) => {
      toast.success("Success!", {
        description: response.message,
      });
    },
    onError: (err: any) => {
      toast.error("Error!", {
        description: err?.response?.data?.message || "Failed to resend OTP",
      });
    },
  });

  return {
    verifyOtp,
    resendOtp,
    isVerifying,
    isResending,
  };
};

export const logout = () => {
  localStorage.removeItem("authToken");
  Cookies.remove("refreshToken");
  window.location.href = "/";
};

export const navigateGoogle = () => {
  window.location.href = `${URL}/auth/google`;
};
