import { Router } from 'express';
import { NotificationController } from '../../controllers/workspace/notificationController';

const router = Router();
const notificationController = new NotificationController();

router.get('/notifications/get-all', notificationController.getNotifications.bind(notificationController));
router.put('/notifications/:notificaitionId', notificationController.markAsRead.bind(notificationController));
router.delete('/notifications/:notificaitionId', notificationController.deleteNotification.bind(notificationController));

export { router as notificationRoutes };
