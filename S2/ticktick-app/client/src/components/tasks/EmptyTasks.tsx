import { cn } from "@/lib/utils";

const EmptyState = ({
    title = "No tasks yet",
    description = "Start by adding a new task to get things moving.",
    image = '/images/no-found.png',
    imageClassName,
}: {
    title?: string;
    description?: string;
    image?: string;
    imageClassName?: string;
}) => (
  <div className="flex flex-col justify-center items-center gap-3 min-h-[60dvh] select-none">
    <img className={cn('size-44', imageClassName)} src={image} alt="No tasks found" />
    <div className="text-center">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-sm text-muted-foreground max-w-[300px]">
        {description}
      </p>
    </div>
  </div>
);

export default EmptyState;
