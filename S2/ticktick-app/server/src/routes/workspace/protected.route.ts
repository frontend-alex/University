import taskRoutes from './task.routes';
import listRoutes from './list.routes';
import workspaceRoutes from './workspace.routes';
import activityRoutes from './activity.routes';
import { notificationRoutes } from './notification.routes';

import { Router } from 'express';
import { jwtMiddleware } from '../../middleware/jwtMiddleware';

const router = Router();

router.use(jwtMiddleware);

router.use(taskRoutes);
router.use(listRoutes);
router.use(workspaceRoutes);
router.use(activityRoutes);
router.use(notificationRoutes)

export { router as protectedWorkspaceRoutes };
