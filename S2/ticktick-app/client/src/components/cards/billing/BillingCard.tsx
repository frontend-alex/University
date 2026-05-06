import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { BadgeCheck, Gem, LoaderCircle, Rocket } from "lucide-react";
import { SubscriptionTier } from "@/types/enums";
import { Badge } from "@/components/ui/badge";

interface Plan {
  title: string;
  price: { monthly: string; annual: string };
  features: string[];
  tier: SubscriptionTier;
  icon: React.ReactNode;
  highlight?: boolean;
}

const plans: Plan[] = [
  {
    title: "Free",
    price: { monthly: "0", annual: "0" },
    tier: SubscriptionTier.Free,
    icon: <BadgeCheck className="h-5 w-5 text-green-500" />,
    features: [
      "Essential Task & Reminder Management",
      "Up to 5 Lists or Projects",
      "Customizable Light & Dark Themes",
      "Real-Time Sync Across All Devices",
    ],
  },
  {
    title: "Pro",
    price: { monthly: "2.99", annual: "2.39" },
    tier: SubscriptionTier.Pro,
    icon: <Rocket className="h-5 w-5 text-blue-500" />,
    features: [
      "Unlimited Lists, Projects & Sections",
      "Collaborate with Up to 5 Users",
      "Direct 1-on-1 Messaging Within Workspaces",
      "One-Way Google Calendar Integration",
    ],
  },
  {
    title: "Premium",
    price: { monthly: "4.99", annual: "3.99" },
    tier: SubscriptionTier.Premium,
    icon: <Gem className="h-5 w-5 text-purple-500" />,
    features: [
      "Dedicated Team Workspaces with Role Management",
      "Two-Way Calendar Sync with Google Calendar",
      "Smart Suggestions & AI Task Insights",
      "Offline Mode, File Sharing & Third-Party Integrations",
    ],
    highlight: true,
  },
];

interface BillingCardsProps {
  currentPlan: SubscriptionTier;
  onPlanChange: (plan: Plan) => void;
  showAnnual?: boolean;
  isPending: boolean;
}

const dotColors: Record<SubscriptionTier, string> = {
  [SubscriptionTier.Free]: "bg-green-500",
  [SubscriptionTier.Pro]: "bg-blue-500",
  [SubscriptionTier.Premium]: "bg-purple-500",
};

// Define the tier order for comparison
const tierOrder = {
  [SubscriptionTier.Free]: 0,
  [SubscriptionTier.Pro]: 1,
  [SubscriptionTier.Premium]: 2,
};

const BillingCards: React.FC<BillingCardsProps> = ({
  currentPlan,
  onPlanChange,
  showAnnual = false,
  isPending,
}) => {
  const [pendingTier, setPendingTier] = useState<SubscriptionTier | null>(null);

  const handlePlanChange = (plan: Plan) => {
    setPendingTier(plan.tier);
    onPlanChange(plan);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {plans.map((plan) => {
        const isCurrent = plan.tier === currentPlan;
        const isThisPending = pendingTier === plan.tier && isPending;

        const isUpgrade = tierOrder[plan.tier] > tierOrder[currentPlan];
        const isDowngrade = tierOrder[plan.tier] < tierOrder[currentPlan];
        const isFreeButUserIsPaid =
          plan.tier === SubscriptionTier.Free &&
          currentPlan !== SubscriptionTier.Free;

        let buttonLabel = "";
        if (isCurrent) {
          buttonLabel = "Current Plan";
        } else if (isFreeButUserIsPaid) {
          buttonLabel = "Cancel Membership";
        } else if (isUpgrade) {
          buttonLabel = "Upgrade";
        } else if (isDowngrade) {
          buttonLabel = "Downgrade";
        } else {
          buttonLabel = "Subscribe";
        }

        const displayPrice = showAnnual
          ? (parseFloat(plan.price.annual) * 12).toFixed(2)
          : plan.price.monthly;

        const savePercent = showAnnual
          ? Math.round(
              100 -
                (parseFloat(plan.price.annual) * 100) /
                  parseFloat(plan.price.monthly)
            )
          : 0;

        return (
          <Card
            key={plan.tier}
            className={clsx(
              "w-full flex flex-col justify-between rounded-xl border shadow-sm bg-white dark:bg-input/30 relative",
              "border-border dark:border-muted",
              isCurrent &&
                "border-primary/70 ring-1 ring-primary/40 dark:ring-primary/30 dark:border-primary/40"
            )}
          >
            {(plan.highlight ||
              (showAnnual && savePercent > 0 && !isCurrent)) && (
              <div className="absolute top-3 right-3 flex gap-2">
                {plan.highlight && (
                  <Badge
                    variant="outline"
                    className={clsx(
                      "text-xs px-2 py-0.5 font-medium rounded-full backdrop-blur-md",
                      "bg-purple-100 text-purple-700 border-purple-300",
                      "dark:bg-purple-400/10 dark:text-purple-300 dark:border-purple-400/50"
                    )}
                  >
                    Best Value
                  </Badge>
                )}
                {showAnnual && savePercent > 0 && !isCurrent && (
                  <Badge
                    variant="outline"
                    className={clsx(
                      "text-xs px-2 py-0.5 font-medium rounded-full backdrop-blur-md",
                      "bg-green-100 text-green-700 border-green-300",
                      "dark:bg-green-400/10 dark:text-green-300 dark:border-green-400/50"
                    )}
                  >
                    Save {savePercent}%
                  </Badge>
                )}
              </div>
            )}

            <CardHeader className="pb-3 space-y-2">
              <div className="flex items-center gap-2">
                {plan.icon}
                <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
                  {plan.title}
                </CardTitle>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-foreground">
                  ${displayPrice}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    /{showAnnual ? "year" : "mo"}
                  </span>
                </div>
                {showAnnual && plan.tier !== SubscriptionTier.Free && (
                  <div className="text-xs text-muted-foreground">
                    Equivalent to{" "}
                    <span className="font-medium">${plan.price.annual}/mo</span>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span
                    className={clsx(
                      "mt-2 h-1.5 w-1.5 rounded-full",
                      dotColors[plan.tier]
                    )}
                  />
                  <span>{feature}</span>
                </div>
              ))}
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                variant={isCurrent ? "outline" : "default"}
                disabled={isCurrent || isThisPending}
                onClick={() => handlePlanChange(plan)}
              >
                {isThisPending && (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                )}
                {buttonLabel}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default BillingCards;
