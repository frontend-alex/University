import { lazy } from "react";

//workspace dialog
export const CreateWorkspaceDialog = lazy(() => import('./workspace/CreateWorkspaceDialog'))
export const EditWorkspaceDialog = lazy(() => import('./workspace/EditWorkspaceDialog'));


//list dialogs
export const CreateListDialog = lazy(() => import('./list/CreateListDialog'));

//users dialogs
export const InviteDialog = lazy(() => import('./users/InviteUsersDialog'))

//global dialogs
export const PremiumDialog = lazy(() => import('./PremimDialog'));
export const DeleteDialog = lazy(() => import('./DeleteDialog'));