import { SubscriptionTier } from "@/types/enums";

export const AI_LIMIT = {
  [SubscriptionTier.Free]: 5,
  [SubscriptionTier.Pro]: 20,
  [SubscriptionTier.Premium]: Infinity,
};

interface AIUsageBarProps {
  tier: SubscriptionTier;
  used: number;
}

const AIUsageBar = ({ tier, used }: AIUsageBarProps) => {
  const limit = AI_LIMIT[tier];
  const percentUsed = Math.min((used / limit) * 100, 100);

  let color = "bg-green-500";
  if (percentUsed > 80) color = "bg-red-500";
  else if (percentUsed > 50) color = "bg-yellow-500";

  return (
    <div className="flex flex-col gap-1 text-xs">
      <div className="flex justify-between">
        <span className="text-muted-foreground">AI Usage</span>
        <span>
          {used} / {limit}
        </span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${percentUsed}%` }}
        />
      </div>
    </div>
  );
};

export default AIUsageBar;
