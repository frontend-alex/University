import { Checkbox } from "@/components/ui/checkbox";

interface TypeCardProps {
  type: string;
  selected: boolean;
  onToggle: (type: string) => void;
  emoji: string;
  description: string;
}

export const TypeCard = ({
  type,
  selected,
  onToggle,
  emoji,
  description,
}: TypeCardProps) => (
  <div
    className={`flex flex-col gap-2 p-4 rounded-lg border cursor-pointer transition-colors ${
      selected
        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
        : "border-accent"
    }`}
  >
    <div className="flex items-center gap-3">
      <Checkbox
        checked={selected}
        onCheckedChange={() => onToggle(type)}
        onClick={(e) => e.stopPropagation()}
      />
      <span className="text-sm font-medium">
        {emoji} {type}
      </span>
    </div>
    <p className="text-xs text-stone-400 ml-9">{description}</p>
  </div>
);