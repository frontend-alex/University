import { useAuth } from "@/contexts/AuthProvider";
import { SubscriptionTier } from "@/types/enums";
import { Outlet } from "react-router-dom";
import LoadingScreen from "../LoadingScreen";
import { Suspense } from "react";
import { PremiumDialog } from "@/components/dialogs/index";

const ProtectedPremiumFeature = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  const tier = user?.subscription?.tier;

  const isProOrPremium =
    tier === SubscriptionTier.Pro || tier === SubscriptionTier.Premium;

  return isProOrPremium ? (
    <Outlet />
  ) : (
    <Suspense fallback={null}>
      <PremiumDialog openExternally={true} />
    </Suspense>
  );
};

export default ProtectedPremiumFeature;
