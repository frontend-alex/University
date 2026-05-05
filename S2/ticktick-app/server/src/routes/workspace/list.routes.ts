import { Router } from 'express';
import { ListController } from '../../controllers/workspace/listController';

const router = Router();
const controller = new ListController();

router.get('/:workspaceId/lists', controller.getListsByWorkspace.bind(controller));
router.get('/list/:listId', controller.getListById.bind(controller));
router.put('/list', controller.updateList.bind(controller));
router.post('/list', controller.createList.bind(controller));
router.delete('/list/:listId', controller.deleteList.bind(controller));

export default router;
