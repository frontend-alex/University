import { Button } from "./button";
import { LANGAUGES } from "@/constants/data";
import { useLanguage } from "@/contexts/LanguageProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "./dropdown-menu";

const ToggleLanguageButton = () => {
  const { language, changeLanguage } = useLanguage();

  const selectedLanguage = LANGAUGES.find((lang) => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={true} variant="secondary" className="w-max">
          {/* <Flag code={selectedLanguage?.flag || "GB"} className="h-5 w-5" /> */}
          <span>{selectedLanguage?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {LANGAUGES.map((item) => (
          <DropdownMenuItem
            key={item.code}
            onClick={() => changeLanguage(item.code)}
          >
            {/* <Flag className="w-5 h-5" code={item.flag} /> */}
            <span>{item.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ToggleLanguageButton;
