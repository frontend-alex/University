import LoadingScreen from "../LoadingScreen";

import { Suspense } from "react";
import { LogOut } from "lucide-react";
import { logout } from "@/services/authService";
import { useAuth } from "@/contexts/AuthProvider";
import { DASHBOARD_LINKS } from "@/constants/data";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageProvider";
import { UserDropdown } from "@/components/dropdowns/index";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export function AppSidebar() {
  const location = useLocation();

  const { user, loading } = useAuth();
  const { translations } = useLanguage();

  if (loading) return <LoadingScreen/>;

  if (!user) return;

  return (
    <div className="w-[45px] hidden bg-accent/30 lg:flex border-r border-accent flex-col justify-between">
      <div className="pt-3">
        <div className="flex-col-3">
          <div className="flex-center">
            <Suspense fallback={<Skeleton className="size-11 rounded-lg"/>}>
              <UserDropdown />
            </Suspense>
          </div>
          <div>
            <div className="list-none flex items-center gap-1 flex-col">
              {DASHBOARD_LINKS.map((item, idx) => {
                const isActive = location.pathname.endsWith(item.path);

                return (
                  <SidebarMenuItem key={idx}>
                    <SidebarMenuButton
                      asChild
                      className={isActive ? "bg-accent" : ""}
                    >
                      <Link
                        to={item.path}
                        className={
                          isActive ? "text-indigo-600" : "text-stone-400"
                        }
                      >
                        <item.icon />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="flex-center">
                  <div className="flex-row-2">
                    <Avatar className="size-5">
                      <AvatarImage src={user?.imageUrl} />
                      <AvatarFallback/>
                    </Avatar>
                    <h1 className="lg:hidden">{user.username}</h1>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[15em]">
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="text-red-500" size={15} />
                  <span className="text-red-500">
                    {translations.logout || "Logout"}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
