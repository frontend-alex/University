import { Router } from 'express';
import { TaskController } from '../../controllers/workspace/taskController';

const router = Router();
const controller = new TaskController();

router.post('/task', controller.createTask.bind(controller));
router.put('/task/:taskId', controller.updateTask.bind(controller));
router.delete('/task/:taskId/soft', controller.softDeleteTask.bind(controller));
router.put('/task/:taskId/restore', controller.restoreTask.bind(controller));
router.delete('/task/:taskId', controller.deleteTask.bind(controller));
router.get('/tasks/deleted', controller.getSoftDeletedTasks.bind(controller));

router.get('/tasks/list/:listId', controller.getTasksByList.bind(controller));
router.get('/task/:taskId', controller.getTaskById.bind(controller));
router.get('/tasks/all-tasks', controller.getTasksByUser.bind(controller));

export default router;
