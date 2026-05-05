import { AppSidebar } from "../ui/app-sidebar";
import { useEffect, useState } from "react";
import { SidebarProvider } from "../ui/sidebar";
import { useAuth } from "@/contexts/AuthProvider";
import { WorkspaceSidebar } from "../ui/workspace-sidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import LoadingScreen from "../LoadingScreen";
import { useMessageNotifier } from "@/hooks/useMessageNotifier";

const RootLayout = () => {

  useMessageNotifier();

  const navigate = useNavigate();
  const location = useLocation();

  const { loading, user } = useAuth();

  const [authorized, setAuthorized] = useState(false);
  const [isWorkspacePage, setIsWorkspacePage] = useState(true);

  useEffect(() => {
    if (!loading) {
      const hasCompletedOnboarding = user?.hasCompletedOnboarding;

      if (!user) {
        navigate("/login", { state: { from: location }, replace: true });
      } else if (!hasCompletedOnboarding) {
        navigate("/onboarding");
      } else {
        setAuthorized(true);
      }
    }

    const restrictedPaths = ["/profile", "/settings", "/billing"];
    setIsWorkspacePage(!restrictedPaths.includes(location.pathname));
  }, [loading, user, navigate, location]);

  if (loading) return <LoadingScreen />;

  if (!authorized) return null;

  return (
    <div className="w-full flex">
      <SidebarProvider>
        <AppSidebar />
        {isWorkspacePage && <WorkspaceSidebar />}
        <main
          className={`relative flex-1 flex-col w-full overflow-hidden ${
            isWorkspacePage ? "md:ml-[175px]" : "md:ml-1"
          }`}
        >
          <div className="relative w-full h-full overflow-hidden">
            {isWorkspacePage && (
              <img
                className="absolute -bottom-10 right-[-200px] w-[50%] max-w-none opacity-5 dark:opacity-0 pointer-events-none select-none -z-1"
                src="https://miro.medium.com/v2/resize:fit:4800/format:webp/1*kTnHasF0lu8SUi_vzQSkuA.png"
                alt="background"
              />
            )}
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default RootLayout;
