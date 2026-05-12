import { lazy } from 'react';

//user dropdowns
export const ManageUsersDropdown = lazy(() => import('@/components/dropdowns/users/ManageUsersDropdown'))
export const AssignUserDropdown = lazy(() => import('@/components/dropdowns/users/AssignUserDropdown'))
export const UserDropdown = lazy(() => import ('@/components/dropdowns/users/UserDropdown'))


//list dropdowns
export const EditListDropdown = lazy(() => import('@/components/dropdowns/list/EditListDropdown'));

//workspace dropdowns
export const WorkspaceDropdown = lazy(() => import('@/components/dropdowns/workspace/WorkspaceDropdown'));

//task dropdowns
export const PriorityDropdown = lazy(() => import("@/components/dropdowns/task/PriorityDropdown"));