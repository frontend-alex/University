import { Suspense } from "react";
import { Workspace } from "@/types/types";
import { getListEmoji } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserDropdown } from "@/components/dropdowns/index";

import InviteNotification from "@/components/NotificationButton";
import ActivityNotificationDropdown from "@/components/ActivityButton";

const InboxHeader = ({ workspaceIdData }: { workspaceIdData: Workspace }) => {
  const isPersonal = workspaceIdData?.type === "personal";

  return (
    <div className="flex-between border-b border-accent px-5 py-[14px] sticky top-0">
      <div className="flex-between w-full">
        <div className="flex-row-2">
          <SidebarTrigger className="flex md:hidden" />
          <h1 className="text-3xl font-corm font-bold">Inbox</h1>
          <span>{getListEmoji("Inbox")}</span>
        </div>
        <div className="flex-row-2">
          {isPersonal ? null : <ActivityNotificationDropdown />}
          <InviteNotification />
          <Suspense fallback={null}>
            <UserDropdown />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default InboxHeader;
