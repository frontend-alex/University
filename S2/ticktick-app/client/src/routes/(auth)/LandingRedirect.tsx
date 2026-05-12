import { useAuth } from "@/contexts/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import Landing from "@/routes/(auth)/Landing";
import LoadingScreen from "@/components/LoadingScreen";

const LandingRedirect = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const activeWorkspaceId = localStorage.getItem("activeWorkspaceId");

  if (loading) return <LoadingScreen/>

  // If user is authenticated
  if (user) {
    if (location.pathname === "/onboarding" && user.hasCompletedOnboarding) {
      return <Navigate to={activeWorkspaceId ? `/${activeWorkspaceId}/inbox` : "/workspaces"} replace />;
    }

    // If hasn't completed onboarding but not on onboarding page
    if (!user.hasCompletedOnboarding && location.pathname !== "/onboarding") {
      return <Navigate to="/onboarding" replace />;
    }

    // If completed onboarding and trying to access root
    if (user.hasCompletedOnboarding && location.pathname === "/") {
      return <Navigate to={activeWorkspaceId ? `/${activeWorkspaceId}/inbox` : "/workspaces"} replace />;
    }
  }

  // If not authenticated and trying to access protected routes
  if (!user && location.pathname !== "/") {
    return <Navigate to="/" replace />;
  }

  // Default landing page for unauthenticated users
  return <Landing />;
};

export default LandingRedirect;