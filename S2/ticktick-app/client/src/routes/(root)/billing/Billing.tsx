import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/contexts/AuthProvider";
import { ModuleLoader, useDynamicPartials } from "@/hooks/useDynamicPartials";

const partialModules = import.meta.glob("./partials/*.tsx") as ModuleLoader;

const Profile = () => {
  const { user, loading, refetchUser } = useAuth();

  const partials = useDynamicPartials({
    partialModules,
    user,
    refetchUser,
    reverseOrder: true,
    border: false,
  });

  if (loading) {
    return <LoadingScreen />;
  }

  return <div className="flex-col-3">{partials}</div>;
};

export default Profile;
