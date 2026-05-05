import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  PanelRight,
  Settings,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCalendarConfig } from "@/contexts/CalendarContext";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface CalendarHeaderProps {
  currentDate: Date;
  view: "day" | "week" | "list";
  mobileView: "list" | "month" | "day";
  showItems: boolean;
  hasActiveFilters: boolean;
  selectedMobileDate?: Date | null;
  onDateChange: (date: Date) => void;
  onViewChange: (view: "day" | "week" | "list") => void;
  onMobileViewChange: (view: "list" | "month" | "day") => void;
  onToggleItems: () => void;
  onShowFilters: () => void;
  onShowSettings: () => void;
  onCreateItem: () => void;
  onMobileBack: () => void;
}

export function CalendarHeader({
  currentDate,
  view,
  mobileView,
  showItems,
  hasActiveFilters,
  selectedMobileDate,
  onDateChange,
  onViewChange,
  onMobileViewChange,
  onToggleItems,
  onShowFilters,
  onShowSettings,
  onCreateItem,
  onMobileBack,
}: CalendarHeaderProps) {
  const { config } = useCalendarConfig();

  const navigate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);

    if (window.innerWidth < 768) {
      if (mobileView === "month") {
        newDate.setMonth(
          currentDate.getMonth() + (direction === "prev" ? -1 : 1)
        );
      } else if (mobileView === "day") {
        newDate.setDate(
          currentDate.getDate() + (direction === "prev" ? -1 : 1)
        );
      }
    } else {
      if (view === "day") {
        newDate.setDate(
          currentDate.getDate() + (direction === "prev" ? -1 : 1)
        );
      } else if (view === "week") {
        newDate.setDate(
          currentDate.getDate() + (direction === "prev" ? -7 : 7)
        );
      } else if (view === "list") {
        newDate.setDate(
          currentDate.getDate() + (direction === "prev" ? -7 : 7)
        );
      }
    }

    onDateChange(newDate);
  };

  const goToToday = () => onDateChange(new Date());

  const formatDateRange = () => {
    if (view === "day") {
      return currentDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
    const getStartOfWeek = (date: Date) => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(d.setDate(diff));
    };
    const start = getStartOfWeek(currentDate);
    const end = new Date(start);
    end.setDate(start.getDate() + (config.showWeekends ? 6 : 4));
    return `${start.getDate()} ${start.toLocaleString("default", {
      month: "short",
    })} — ${end.getDate()} ${end.toLocaleString("default", {
      month: "short",
    })} ${end.getFullYear()}`;
  };

  const getMobileTitle = () => {
    if (mobileView === "day" && selectedMobileDate) {
      return selectedMobileDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    }
    if (mobileView === "month") {
      return currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    }
    return "All Events";
  };

  return (
    <div className="border-b border-accent px-4 sm:px-6 lg:px-8 py-4 lg:py-3.5 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 lg:space-x-8">
          <div className="md:hidden flex items-center space-x-3">
            {(mobileView === "day" || mobileView === "list") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMobileBack}
                className="p-1"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">{getMobileTitle()}</h1>
            <Button
              variant="ghost"
              onClick={goToToday}
              className="text-sm transition-colors"
            >
              Today
            </Button>
          </div>

          <div className="hidden md:block">
            <h1 className="text-lg lg:text-xl font-medium">Calendar</h1>
          </div>

          <div className="hidden sm:flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={goToToday}
              className="text-sm transition-colors"
            >
              Today
            </Button>

            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-stone-400 font-medium hidden md:block">
                {formatDateRange()}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("next")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2">
          {/* Mobile view toggle - List button when in month view */}
          <div className="md:hidden">
            {mobileView === "month" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMobileViewChange("list")}
                className="px-3 py-2 font-medium"
                title="List view"
              >
                <List className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Desktop view toggle */}
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(val) =>
              val && onViewChange(val as "day" | "week" | "list")
            }
            className="hidden md:flex"
          >
            {["day", "week", "list"].map((viewType) => (
              <ToggleGroupItem
                key={viewType}
                value={viewType}
                className="px-2 lg:px-3 py-1 text-sm"
              >
                <span className="hidden sm:inline">
                  {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                </span>
                <span className="sm:hidden">
                  {viewType.charAt(0).toUpperCase()}
                </span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          {/* Action buttons */}
          <Button
            onClick={onShowSettings}
            variant="ghost"
            size="sm"
            title="Settings"
            className="hidden lg:flex"
          >
            <Settings className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onShowFilters}
            className={`${hasActiveFilters ? "bg-red-100 text-red-500" : ""}`}
            title="Filters"
          >
            <Filter className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleItems}
            className={`hidden lg:flex ${
              showItems ? "bg-gray-100 text-gray-900" : ""
            }`}
            title={showItems ? "Hide sidebar" : "Show sidebar"}
          >
            <PanelRight className="h-4 w-4" />
          </Button>

          <Button onClick={onCreateItem} size="sm">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">Add</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
