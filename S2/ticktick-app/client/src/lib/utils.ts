import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"
import { Dispatch, SetStateAction, MutableRefObject } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


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


export const getListEmoji = (listType: string): string => {
  switch (listType?.toLowerCase()) {
    case "personal":
      return "🏠";
      case "trash":
      return "🗑️";
    case "school":
      return "🎓";
    case "work":
      return "💼";
    case "daily":
      return "📅";
    default:
      return "🗂️"; 
  }
};


export const capitalizeListType = (listType: string) => {
  return listType.charAt(0).toUpperCase() + listType.slice(1);
};

export const formatTime = (dateString: string) => {
  const diffInMinutes = Math.floor((Date.now() - new Date(dateString).getTime()) / 60000)
  if (diffInMinutes < 1) return "Just now"
  if (diffInMinutes < 60) return `${diffInMinutes} Minutes Ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} Hours Ago`
  return `${Math.floor(diffInMinutes / 1440)} Days Ago`
}

export const isToday = (dateString: string) => {
  const today = new Date()
  const date = new Date(dateString)
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

export const flashTitle = (message: string, duration = 8000, interval = 1000) => {
  const originalTitle = document.title;
  let visible = false;
  let elapsed = 0;

  const intervalId = setInterval(() => {
    document.title = visible ? message : originalTitle;
    visible = !visible;
    elapsed += interval;

    if (elapsed >= duration) {
      clearInterval(intervalId);
      document.title = originalTitle;
    }
  }, interval);
};

export const getUserInitials = (username: string) =>
  username
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
