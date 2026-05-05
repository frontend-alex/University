import clsx from "clsx";
import LoadingScreen from "../LoadingScreen";
import NotificationButton from "../NotificationButton";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { useAuth } from "@/contexts/AuthProvider";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useMessageNotifier } from "@/hooks/useMessageNotifier";
import { BREADCRUMBS_TRANSLATION, ProfileLinks } from "@/constants/data";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const ProfileLayout = () => {

  useMessageNotifier();

  const navigate = useNavigate();
  const location = useLocation();
  const breadcrumbTranslationMap = BREADCRUMBS_TRANSLATION();

  const { loading, user } = useAuth();
  const { translations } = useLanguage();

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/unauthorized", { replace: true });
      } else {
        setAuthorized(true);
      }
    }
  }, [loading, user, navigate]);

  if (loading) return <LoadingScreen />;

  if (!authorized) return null;

  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);

    return pathnames.map((value, index) => {
      const to = "/" + pathnames.slice(0, index + 1).join("/");

      const label =
        breadcrumbTranslationMap[value] ||
        value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

      return { label, to, isLast: index === pathnames.length - 1 };
    });
  };
  const breadcrumbs = generateBreadcrumbs();
  const pageTitle =
    breadcrumbs.length > 0
      ? breadcrumbs[breadcrumbs.length - 1].label
      : translations.home || "Home";

  return (
    <div>
      <div className="flex-between w-full border-b border-accent px-5 py-3 ">
        <div className="flex-col-1">
          <div className="flex-row-2">
            <SidebarTrigger className="flex md:hidden"/>
            <h1 className="text-3xl font-corm font-bold">{pageTitle}</h1>
          </div>
          {/* <Breadcrumb className="hidden lg:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  {translations.home || "Home"}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {crumb.isLast ? (
                      <span className="text-muted-foreground">
                        {crumb.label}
                      </span>
                    ) : (
                      <BreadcrumbLink href={crumb.to}>
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb> */}
        </div>
        <div className="flex-row-3">
          <div className="relative h-max">
            <Input
              placeholder="Search..."
              className="max-w-md no-ring box-border px-9"
            />
            <Search
              size={15}
              className="absolute text-stone-400 top-[12px] left-3"
            />
          </div>
          <NotificationButton />
        </div>
      </div>
      <div className="grid grid-cols-8 h-[calc(100vh-80px)]">
        {" "}
        <div className="border-r border-accent p-5 hidden lg:col-span-2 2xl:col-span-1 lg:flex flex-col gap-1">
          {ProfileLinks.map(({ name, path, icon: Icon }, idx) => {
            const isActive = location.pathname === path;

            return (
              <Link to={path} key={idx}>
                <Button
                  className={clsx(
                    "w-full flex-start font-normal text-base",
                    isActive && "bg-accent"
                  )}
                  variant="ghost"
                >
                  <Icon />
                  {name}
                </Button>
              </Link>
            );
          })}
        </div>
        <div className="col-span-8 lg:col-span-6 2xl:col-span-7 overflow-y-auto p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
