import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/contexts/AuthProvider";
import { ModuleLoader, useDynamicPartials } from "@/hooks/useDynamicPartials";

const partialModules = import.meta.glob("./partials/*.tsx") as ModuleLoader;

const WorkspaceSettings = () => {
  const { user, loading, refetchUser } = useAuth();

  const partials = useDynamicPartials(partialModules, user, refetchUser)

  if (loading) {
    return <LoadingScreen/>;
  }

  return <div className="flex-col-3">{partials}</div>;
};

export default WorkspaceSettings;
