import { useAuth } from "@/contexts/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";
import LoadingScreen from "../LoadingScreen";

export const OnboardingGuard = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen/>;

  if (user?.hasCompletedOnboarding) {
    const workspaceId = localStorage.getItem("activeWorkspaceId");
    return <Navigate to={workspaceId ? `/${workspaceId}/inbox` : "/workspaces"} replace />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet/>;
};