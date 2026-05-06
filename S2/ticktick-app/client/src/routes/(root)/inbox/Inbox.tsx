import InboxLists from "./partials/InboxLists";
import InboxHeader from "./partials/InboxHeader";

import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { SOCKET_EVENTS } from "@/constants/socketEvents";
import useWorkspace from "./partials/hooks/useWorkspace";

const Inbox = () => {
  const socket = getSocket();
  const workspaceId = localStorage.getItem("activeWorkspaceId") ?? "";

  const { workspaceIdData } = useWorkspace(workspaceId);

  const isPersonal = workspaceIdData?.type === "personal";

  useEffect(() => {
    // if(isPersonal) return;
    if (workspaceId && socket) {
      socket.emit(SOCKET_EVENTS.JOIN_WORKSPACE_ROOM, workspaceId);
    }
  }, [workspaceId, socket]);


  return (
    <div className="flex flex-col h-screen">
      {workspaceIdData && <InboxHeader workspaceIdData={workspaceIdData} />}
      <div className="flex flex-1 overflow-hidden">
        {/* InboxLists takes full width when personal, otherwise 3/4 */}
        <div className="w-full">
          <InboxLists isPersonal={isPersonal} workspaceId={workspaceId} />
        </div>
      </div>
    </div>
  );
};

export default Inbox;
