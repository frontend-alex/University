import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { handleOtpChange, handleOtpKeyDown, startCountdown } from "@/utils/utils";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useOtpVerification } from "@/services/authService";

const Otp: React.FC = () => {
  const { translations } = useLanguage();
  const { verifyOtp, resendOtp, isVerifying, isResending } = useOtpVerification();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email") ?? ""; // ✅ default to empty string (not null)

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const handleChange = useCallback(
    (index: number, value: string) => {
      handleOtpChange(index, value, otp, setOtp, inputRefs);
    },
    [otp]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      handleOtpKeyDown(index, e, otp, inputRefs);
    },
    [otp]
  );

  const onOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await verifyOtp({ email, otp: otp.join("") });
  };

  const onResendClick = async () => {
    const res: any = await resendOtp({ email }); 
    if (res?.success) {
      startCountdown(setTimer, setIsTimerActive);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-neutral-900 px-4 w-full">
      <div className="rounded-2xl flex-col-3 shadow-xl p-8 w-full max-w-md">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            {translations.enter_otp || "Enter OTP Code"}
          </h2>
          <p className="text-sm flex gap-[1px]">
            {translations.enter_otp_message ||
              "We have sent a verification code to your email. It will expire in "}
            <strong>5</strong>
            {translations.minutes || "minutes"}
          </p>
        </div>

        <form className="flex-col-5" onSubmit={onOtpSubmit}>
          <div className="flex justify-center space-x-2 mt-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-semibold border border-neutral-200 dark:border-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            ))}
          </div>
          <Button className="button-main font-corm w-full mt-4" disabled={isVerifying}>
            {isVerifying ? (
              <div className="flex-center">
                <LoaderCircle className="animate-spin mr-2" />
                {translations.verifying || "Verifying..."}
              </div>
            ) : (
              translations.verify_otp || "Verify OTP"
            )}
          </Button>
        </form>

        <p className="text-stone-600 text-sm mt-4">
          {translations.didnt_receive_code || "Didn't receive a code?"}{" "}
          <button
            disabled={isTimerActive || isResending}
            onClick={onResendClick}
            className="text-indigo-600 disabled:text-stone-400 disabled:cursor-not-allowed hover:underline font-semibold"
          >
            {translations.resend || "Resend"} {isTimerActive ? `(${timer}s)` : ""}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Otp;
