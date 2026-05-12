import { useState, useEffect, Suspense } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Sun, Moon, BookCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useTheme } from "@/contexts/ThemeProvider";
import { useAuth } from "@/contexts/AuthProvider";
import { navbarLinks } from "@/constants/data";

import { UserDropdown } from "@/components/dropdowns/index";


export const NavbarLogo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <BookCheck className="h-6 w-6 text-indigo-600" />
      <span className="font-semibold text-xl tracking-tight">TaskTide</span>
    </Link>
  );
};

const Navbar = () => {
  const location = useLocation();

  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const [isScrolled, setIsScrolled] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-sm border-b shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <NavbarLogo />
        <nav className="hidden md:flex items-center space-x-8">
          {navbarLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(item.path) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hidden md:flex"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {user ? (
            <Suspense fallback={null}>
              <UserDropdown/>
            </Suspense>
          ) : (
            <div className="flex-row-3">
              <Button variant={"main"} size="sm" className="hidden md:flex">
                <Link to="/create-account">Create an account</Link>
              </Button>

              <Button size="sm" variant={"ghost"} className="hidden md:flex">
                <Link to="/login">Login</Link>
              </Button>
            </div>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open meny</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between border-b">
                  <span className="font-semibold text-lg p-5">
                    Menu
                  </span>
                  <SheetClose asChild className="p-3">
                    <Button variant="ghost" size="icon">
                      <span className="sr-only">
                        Close menu
                      </span>
                    </Button>
                  </SheetClose>
                </div>

                <nav className="flex flex-col gap-2 px-3 mt-6">
                  {navbarLinks.map((item) => (
                    <SheetClose key={item.path} asChild>
                      <Link
                        to={item.path}
                        className={`py-2 px-3 rounded-md transition-colors hover:bg-accent ${
                          isActive(item.path)
                            ? "bg-accent font-medium text-accent-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>

                <div className="mt-auto flex flex-col gap-3 pt-6 border-t p-5">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="justify-start"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="h-5 w-5 mr-2" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="h-5 w-5 mr-2" />
                        Dark Mode
                      </>
                    )}
                  </Button>

                  <Button asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
