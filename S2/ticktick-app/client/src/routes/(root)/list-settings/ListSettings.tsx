import { useMemo } from "react";
import { List } from "@/types/response";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import LoadingScreen from "@/components/LoadingScreen";
import { useListById } from "../lists/partials/hook/useList";
import { ModuleLoader, useDynamicPartials } from "@/hooks/useDynamicPartials";

const partialModules = import.meta.glob("./partials/*.tsx") as ModuleLoader;

const ListSettings = () => {
  const { listId } = useParams();
  const { isLoading, list } = useListById(listId as string);
  const { user, loading, refetchUser } = useAuth();

  const extraProps = useMemo(() => ({ list: list?.data }), [list?.data]);

  const partials = useDynamicPartials<{ list: List | undefined }>({
    partialModules,
    user,
    refetchUser,
    extraProps,
  });

  if (loading || isLoading) {
    return <LoadingScreen />;
  }

  return <div className="flex-col-3 max-w-7xl mx-auto">{partials}</div>;
};

export default ListSettings;
