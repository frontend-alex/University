import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Theme, useTheme } from "@/contexts/ThemeProvider";
import { LaptopMinimal, Moon, Sun } from "lucide-react";

const ChangeTheme = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid-3 gap-5 lg:gap-0">
      <div className="flex-col-1">
        <h1 className="font-bold text-xl">Theme</h1>
        <p className="text-stone-400 text-sm">Change your theme based on your preference.</p>
      </div>
      <div className="col-span-2 lg:w-3/5">
        <ToggleGroup
          type="single"
          value={theme}
          onValueChange={(value: Theme) => {
            if (value) setTheme(value);
          }}
          defaultValue={theme}
          className="w-full lg:w-[300px]"
        >
          <ToggleGroupItem value="light">
            <Sun /> Light
          </ToggleGroupItem>
          <ToggleGroupItem value="dark">
            <Moon />
            Dark
          </ToggleGroupItem>
          <ToggleGroupItem value="system">
            <LaptopMinimal />
            System
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default ChangeTheme;
