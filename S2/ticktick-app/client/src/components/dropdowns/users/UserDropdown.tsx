import { logout } from "@/services/authService";
import { useLanguage } from "@/contexts/LanguageProvider";
import { Inbox, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { ProfileLinks } from "@/constants/data";
import { useAuth } from "@/contexts/AuthProvider";

const UserDropdown = () => {
  const { user } = useAuth();
  const { translations } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex-row-3">
          <Avatar className="rounded-md size-8">
            <AvatarImage src={user?.imageUrl} alt="User Avatar" />
            <AvatarFallback>{user?.username[0]}</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel className="dropdown-label">
          {translations.account || "Account"}
        </DropdownMenuLabel>

        <DropdownMenuItem asChild>
          <Link
            className="flex-row-2"
            to={`/${localStorage.getItem("activeWorkspaceId")}/inbox`}
          >
            <Inbox />
            Inbox
          </Link>
        </DropdownMenuItem>

        {ProfileLinks.map(({ path, name, icon: Icon }, idx) => (
          <DropdownMenuItem asChild key={idx}>
            <Link className="flex-row-2" to={path}>
              <Icon />
              {name}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />

        {/* Logout Button */}
        <DropdownMenuItem onClick={logout} className="text-red-500">
          <LogOut className="mr-2 text-red-500" />
          {translations.logout || "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
