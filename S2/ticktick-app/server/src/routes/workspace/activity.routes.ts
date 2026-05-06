import { Router } from 'express';
import { ActivityController } from '../../controllers/workspace/activityController';

const router = Router();
const controller = new ActivityController();

router.get('/:workspaceId/activity-log', controller.getWorkspaceActivities.bind(controller));

export default router;
