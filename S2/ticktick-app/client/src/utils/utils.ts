import { Dispatch, MutableRefObject, SetStateAction } from "react";

export const handleOtpChange = (
    index: number,
    value: string,
    otp: string[],
    setOtp: Dispatch<SetStateAction<string[]>>,
    inputRefs: MutableRefObject<(HTMLInputElement | null)[]>
  ) => {
    if (!/^\d*$/.test(value)) return; 
  
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  export const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent,
    otp: string[],
    inputRefs: MutableRefObject<(HTMLInputElement | null)[]>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  export const startCountdown = (
    setTimer: Dispatch<SetStateAction<number>>,
    setIsTimerActive: Dispatch<SetStateAction<boolean>>,
    delay = 1000
  ) => {
    let timeLeft = 60; 
  
    const interval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(interval); 
        setIsTimerActive(false); 
      } else {
        setTimer(timeLeft); 
        timeLeft -= 1;
      }
    }, delay);
    setIsTimerActive(true); 
  };