import { useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { SubscriptionTier } from "@/types/enums";

import useSubscribtion from "./hooks/useSubscribtion";
import BillingCards from "@/components/cards/billing/BillingCard";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"; 

const BillingOptions = () => {
  const { user } = useAuth();
  const { changePlan, isPlanChaning } = useSubscribtion(); 

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const showAnnual = billingCycle === "annual";

  return (
    <div className="grid-3 gap-5 lg:gap-0">
      <div className="col-span-3">
        <div className="flex-col-5">
          <div className="flex-between flex-wrap gap-4">
            <div className="flex-col-1">
              <h1 className="font-bold text-2xl">Subscription Plan</h1>
              <p className="text-stone-500 text-sm">
                Choose the plan that fits your productivity needs. Upgrade
                anytime.
              </p>
            </div>
            <ToggleGroup
              type="single"
              value={billingCycle}
              onValueChange={(value) => {
                if (value === "monthly" || value === "annual") {
                  setBillingCycle(value);
                }
              }}
              className="w-full lg:w-[200px] justify-center"
            >
              <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
              <ToggleGroupItem value="annual">Yearly</ToggleGroupItem>
            </ToggleGroup>
          </div>

          <BillingCards
            currentPlan={user?.subscription?.tier ?? SubscriptionTier.Free}
            showAnnual={showAnnual}
            isPending={isPlanChaning}
            onPlanChange={(plan) => changePlan({ tier: plan.tier, isAnual: billingCycle  })}
          />
        </div>
      </div>
    </div>
  );
};

export default BillingOptions;
