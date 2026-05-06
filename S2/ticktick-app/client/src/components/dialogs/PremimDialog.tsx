import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Gem, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface PremiumDialogProps {
  triggerButton?: React.ReactNode;
  openExternally?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export const PremiumButton = () => (
  <Link to="/billing" className="flex-center">
    <Button
      variant="outline"
      size="sm"
      className="bg-purple-400 dark:bg-purple-600 hover:dark:bg-purple-800 hover:dark:text-black hover:bg-purple-500 text-black flex items-center gap-2"
    >
      <Gem size={15} />
      Go Premium
    </Button>
  </Link>
);

const PremiumDialog = ({
  triggerButton,
  openExternally,
  onOpenChange,
}: PremiumDialogProps) => {
  const navigate = useNavigate();
  const [internalOpen, setInternalOpen] = useState(false);

  const open = openExternally ?? internalOpen;
  const shouldAutoOpen = useMemo(
    () => openExternally && !triggerButton,
    [openExternally, triggerButton]
  );

  useEffect(() => {
    if (shouldAutoOpen) {
      setInternalOpen(true);
    }
  }, [shouldAutoOpen]);

  const handleOpenChange = (val: boolean) => {
    if (openExternally === undefined) {
      setInternalOpen(val);
    }
    onOpenChange?.(val);
    if (!val && openExternally) {
      navigate(-1);
    }
  };

  const Trigger = () => {
    const handleClick = () => setInternalOpen(true);

    if (triggerButton) {
      return <span onClick={handleClick}>{triggerButton}</span>;
    }

    if (!openExternally) {
      return (
        <span onClick={handleClick}>
          <Plus
            size={15}
            className="cursor-pointer text-stone-400 hover:text-black dark:hover:text-white z-[100]"
          />
        </span>
      );
    }

    return null;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <Trigger />

        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-600">
              <Gem className="w-5 h-5" />
              Premium Access Required
            </DialogTitle>
            <DialogDescription>
              Calendar access is available to premium members only. Upgrade to
              enjoy scheduling, planning, and more.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <PremiumButton />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PremiumDialog;
