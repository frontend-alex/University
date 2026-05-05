import { useState } from "react";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarWeekView } from "./CalendarWeekView";
import { CalendarDayView } from "./CalendarDayView";
import { CalendarListView } from "./CalendarListView";
import { FiltersDialog } from "@/components/dialogs/calendar/CalendarFilterDialog";
import { CalendarSettingsDialog } from "@/components/dialogs/calendar/CalendarSettingsDialog";
import { useCalendarConfig } from "@/contexts/CalendarContext";
import { CalendarMonthView } from "./CalendarMonthView";
import { ItemsSidebar } from "../components/CalendarItemsSidebar";
import { TodoPriority, TodoStatus } from "@/types/enums";
import { Task } from "@/types/response";
import { EventType, ItemType } from "@/types/types";

interface CalendarViewProps {
  items: Task[];
  onItemClick: (item: Task) => void;
  onCreateItem: () => void;
  onUpdateItem: (item: Task) => void;
}

interface Filters {
  priority: TodoPriority[];
  status: TodoStatus[];
  type: ItemType[];
  eventType: EventType[];
  category: string[];
  dateRange: {
    start: string;
    end: string;
  };
}

export function CalendarView({
  items,
  onItemClick,
  onCreateItem,
  onUpdateItem,
}: CalendarViewProps) {
  const { config } = useCalendarConfig();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week" | "list">("week");
  const [showItems, setShowItems] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    priority: [],
    status: [],
    type: [],
    eventType: [],
    category: [],
    dateRange: { start: "", end: "" },
  });

  const [mobileView, setMobileView] = useState<"list" | "month" | "day">(
    "month"
  );
  const [selectedMobileDate, setSelectedMobileDate] = useState<Date | null>(
    null
  );

  const filteredItems = items.filter((item) => {
    if (
      filters.priority &&
      filters.priority.length > 0 &&
      !filters.priority.includes(item.priority as TodoPriority)
    ) {
      return false;
    }

    if (
      filters.status &&
      filters.status.length > 0 &&
      !filters.status.includes(item.status)
    ) {
      return false;
    }

    if (
      filters.type &&
      filters.type.length > 0 &&
      !filters.type.includes(item.type)
    ) {
      return false;
    }

    if (
      filters.category &&
      filters.category.length > 0 &&
      item.category &&
      !filters.category.includes(item.category)
    ) {
      return false;
    }

    if (filters.dateRange && (filters.dateRange.start || filters.dateRange.end)) {
      const itemDate = new Date(item.time);
      if (
        filters.dateRange.start &&
        itemDate < new Date(filters.dateRange.start)
      )
        return false;
      if (filters.dateRange.end && itemDate > new Date(filters.dateRange.end))
        return false;
    }

    return true;
  });

  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const getItemDateRange = () => {
    if (view === "day") {
      return { start: currentDate, end: currentDate };
    }
    const start = getStartOfWeek(currentDate);
    const end = new Date(start);
    end.setDate(start.getDate() + (config.showWeekends ? 6 : 4));
    return { start, end };
  };

  const hasActiveFilters = Boolean(
    (filters.priority && filters.priority.length > 0) ||
      (filters.status && filters.status.length > 0) ||
      (filters.type && filters.type.length > 0) ||
      (filters.eventType && filters.eventType.length > 0) ||
      (filters.category && filters.category.length > 0) ||
      (filters.dateRange && (filters.dateRange.start || filters.dateRange.end))
  );

  const handleMobileDateSelect = (date: Date) => {
    setSelectedMobileDate(date);
    setMobileView("day");
  };

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="h-screen flex flex-col">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        mobileView={mobileView}
        showItems={showItems}
        hasActiveFilters={hasActiveFilters}
        selectedMobileDate={selectedMobileDate}
        onDateChange={setCurrentDate}
        onViewChange={setView}
        onMobileViewChange={setMobileView}
        onToggleItems={() => setShowItems(!showItems)}
        onShowFilters={() => setShowFilters(true)}
        onShowSettings={() => setShowSettings(true)}
        onCreateItem={onCreateItem}
        onMobileBack={() => {
          if (mobileView === "day") {
            setMobileView("month");
          } else if (mobileView === "list") {
            setMobileView("month");
          }
        }}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <div className="hidden md:block h-full">
            {view === "week" && (
              <CalendarWeekView
                currentDate={currentDate}
                items={filteredItems}
                onItemClick={onItemClick}
              />
            )}

            {view === "day" && (
              <CalendarDayView
                currentDate={currentDate}
                items={filteredItems}
                onItemClick={onItemClick}
              />
            )}

            {view === "list" && (
              <CalendarListView
                items={filteredItems}
                onItemClick={onItemClick}
              />
            )}
          </div>

          <div className="md:hidden h-full">
            {mobileView === "month" && (
              <CalendarMonthView
                currentDate={currentDate}
                items={filteredItems}
                onDateSelect={handleMobileDateSelect}
                onItemClick={onItemClick}
                onNavigate={(direction) => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(
                    currentDate.getMonth() + (direction === "prev" ? -1 : 1)
                  );
                  setCurrentDate(newDate);
                }}
              />
            )}

            {mobileView === "list" && (
              <CalendarListView
                items={filteredItems}
                onItemClick={onItemClick}
              />
            )}

            {mobileView === "day" && selectedMobileDate && (
              <CalendarDayView
                currentDate={selectedMobileDate}
                items={filteredItems}
                onItemClick={onItemClick}
                showBackButton={true}
                onBack={() => setMobileView("month")}
                onNavigate={(direction) => {
                  const newDate = new Date(selectedMobileDate)
                  newDate.setDate(selectedMobileDate.getDate() + (direction === "prev" ? -1 : 1))
                  setSelectedMobileDate(newDate)
                }}
              />
            )}
          </div>
        </div>

        {showItems && (
          <div className="hidden lg:block">
            <ItemsSidebar
              items={filteredItems}
              dateRange={getItemDateRange()}
              onItemClick={onItemClick}
              onCreateItem={onCreateItem}
              onUpdateItem={onUpdateItem}
            />
          </div>
        )}
      </div>

      <FiltersDialog
        open={showFilters}
        onOpenChange={setShowFilters}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        items={items}
      />

      <CalendarSettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
      />
    </div>
  );
}