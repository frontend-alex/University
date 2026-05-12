export const SOCKET_EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',

  // Workspace
  JOIN_WORKSPACE_ROOM: 'joinWorkspaceRoom',
  JOIN_WORKSPACE_AND_PERSIST: 'joinWorkspaceAndPersist',
  WORKSPACE_MEMBER_LEFT: 'workspaceMemberLeft',
  WORKSPACE_MEMBER_JOINED: 'workspaceMemberJoined',
  WORKSPACE_ACTIVITY: 'workspaceActivity',
  WORKSPACE_UPDATED: 'workspaceUpdated',

  // Tasks
  NEW_TASK: 'newTask',
  TASK_UPDATED: 'taskUpdated',
  TASK_SOFT_DELETED: 'taskSoftDeleted',
  TASK_RESTORED: 'taskRestored',
  TASK_PERMANENTLY_DELETED: 'taskPermanentlyDeleted',

  // Lists
  NEW_LIST: 'newList',
  LIST_UPDATED: 'listUpdated',
  LIST_DELETED: 'listDeleted',

  // Chat
  DIRECT_MESSAGE: 'directMessage',
  NEW_DIRECT_MESSAGE: 'newDirectMessage',
  MARK_AS_READ: 'markAsRead',
  TYPING: 'typing',
  STOP_TYPING: 'stopTyping',
  JOIN_CONVERSATION: 'joinConversation',
};
