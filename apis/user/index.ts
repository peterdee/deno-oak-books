import { Router } from 'https://deno.land/x/oak@v5.3.1/mod.ts';

import authenticate from '../../middlewares/authenticate.ts';
import deleteUser from './delete.controller.ts';
import get from './get.controller.ts';
import update from './update.controller.ts';

const router = new Router({ prefix: '/api' });
router.delete('/user', authenticate, deleteUser);
router.get('/user', authenticate, get);
router.patch('/user', authenticate, update);

export default router;
