export const SOCKET_EVENTS = {
  //tasks
  NEW_TASK: "newTask",
  TASK_UPDATED: "taskUpdated",
  TASK_ASSIGNED: "taskAssigned",
  TASK_RESTORED: "taskRestored",
  TASK_SOFT_DELETED: "taskSoftDeleted",
  TASK_PERM_DELETED: "taskPermanentlyDeleted",

  //list
  NEW_LIST: "newList",
  LIST_UPDATED: "listUpdated",
  LIST_DELETED: "listDeleted",

  //members
  MEMBER_LEFT: "workspaceMemberLeft",
  MEMBER_JOINED: "workspaceMemberJoined",

  //notifications
  NEW_NOTIFICATION: "newNotification",

  //workspace
  WORKSPACE_INVITATION: "workspaceInvitation",
  WORKSPACE_UPDATED: "workspaceUpdated",

  //workspaces
  JOIN_WORKSPACE_AND_PERSIST: "joinWorkspaceAndPersist",
  JOIN_WORKSPACE_ROOM: "joinWorkspaceRoom",
  JOIN_CONVERSATION: "joinConversation",

  //chat
  TYPING: "typing",
  MARK_AS_READ: "markAsRead",
  STOP_TYPING: "stopTyping",
  DIRECT_MESSAGE: "directMessage",
  NEW_DIRECT_MESSAGE: "newDirectMessage",
};
