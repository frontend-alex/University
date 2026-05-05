import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; 


const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="lg:h-[100dvh] flex justify-center items-center flex-col gap-3">
      <Navbar />
      <div className="flex flex-col justify-center items-center gap-4 max-w-lg text-center">
        {/* <DotLottieReact src={notfound} loop autoplay/> */}
        <h1 className="text-4xl font-semibold">
          Oops! Page Not Found.
        </h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          We couldn't find the page you're looking for. Please check the URL or go back to the previous page.
        </p>
        <Button onClick={handleGoBack} className="mt-4 w-full">
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
