import { Router } from 'express';
import { WorkspaceController } from '../../controllers/workspace/workspaceController';

const router = Router();
const controller = new WorkspaceController();

router.get('/:workspaceId', controller.getWorkspaceById.bind(controller));
router.post('/onboard', controller.onboardUser.bind(controller));
router.post('/:workspaceId/invite', controller.inviteUsersToWorkspace.bind(controller));
router.post('/:workspaceId/accept-invite', controller.acceptWorkspaceInvite.bind(controller));
router.put('/:workspaceId/leave', controller.leaveWorkspace.bind(controller));

export default router;
