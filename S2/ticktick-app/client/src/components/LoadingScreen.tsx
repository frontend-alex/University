import { BookCheck } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center ">
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 bg-indigo-600 rounded-md">
          <BookCheck className="size-10 text-white" />
        </div>

        {/* Pulsing Dots */}
        <div className="flex space-x-2">
          <span className="w-3 h-3 bg-accent rounded-full animate-pulse"></span>
          <span className="w-3 h-3 bg-accentrounded-full animate-pulse [animation-delay:200ms]"></span>
          <span className="w-3 h-3 bg-accent rounded-full animate-pulse [animation-delay:400ms]"></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
