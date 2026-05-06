import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import { useEnhanceAI } from "@/hooks/useAI";
import { SubscriptionTier } from "@/types/enums";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthProvider";
import AIUsageBar, { AI_LIMIT } from "../ui/AIIndicator";
import { PremiumButton } from "../dialogs/PremimDialog";

interface EnhanceWithAIButtonProps {
  value: string;
  onEnhance: (newValue: string) => void;
  disabled?: boolean;
}

const EnhanceWithAIButton = ({
  value,
  onEnhance,
  disabled,
}: EnhanceWithAIButtonProps) => {
  const { user } = useAuth();
  const { enahceDescription } = useEnhanceAI();

  const [showEnhancer, setShowEnhancer] = useState(false);
  const [enhancePrompt, setEnhancePrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const tier = user?.subscription?.tier ?? SubscriptionTier.Free;
  const used = user?.aiUsage?.count ?? 0;
  const limit = AI_LIMIT[tier];
  const usageExceeded = limit !== Infinity && used >= limit;

  const handleEnhance = () => {
    if (!enhancePrompt?.trim()) return;
    if (usageExceeded) {
      toast.error("You’ve reached your AI usage limit for this month.");
      return;
    }

    setLoading(true);

    enahceDescription.mutate(
      {
        text: value,
        instruction: enhancePrompt,
      },
      {
        onSuccess: (data) => {
          onEnhance(data.description);
          toast.success("Description enhanced!");
          setEnhancePrompt("");
          setShowEnhancer(false);
        },
        onError: () => toast.error("AI enhancement failed"),
        onSettled: () => setLoading(false),
      }
    );
  };

  return (
    <Popover open={showEnhancer} onOpenChange={setShowEnhancer}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-[2px]"
          disabled={disabled}
        >
          ✨
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-3 w-80 p-4 border border-transparent rounded-xl bg-background shadow-xl">
        <h1 className="text-sm font-bold">Enhance with AI ✨</h1>

        {usageExceeded && tier !== SubscriptionTier.Premium ? (
          <div className="text-sm text-center px-2 py-6 rounded-xl bg-muted">
            <h2 className="font-semibold text-base mb-1">AI Limit Reached</h2>
            <p className="text-muted-foreground mb-3">
              You’ve reached your monthly AI enhancement limit. Upgrade to
              Premium for unlimited access.
            </p>
            <PremiumButton/>
          </div>
        ) : (
          <>
            <div className="relative rounded-xl p-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
              <div className="rounded-[10px] bg-background">
                <Textarea
                  placeholder="e.g. Make it more concise"
                  value={enhancePrompt}
                  onChange={(e) => setEnhancePrompt(e.target.value)}
                  disabled={loading}
                  className="min-h-[100px] w-full resize-none rounded-xl bg-background text-sm focus-visible:ring-0 focus-visible:ring-offset-0 border-none"
                />
                <Button
                  size="sm"
                  onClick={handleEnhance}
                  disabled={loading || !enhancePrompt.trim()}
                  className={cn(
                    "w-max bottom-3 right-3 text-white flex items-center absolute justify-center gap-2",
                    "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:opacity-90"
                  )}
                >
                  <Send /> {loading ? "Enhancing..." : ""}
                </Button>
              </div>
            </div>
            {tier !== SubscriptionTier.Premium && (
              <AIUsageBar tier={tier} used={used} />
            )}
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default EnhanceWithAIButton;
