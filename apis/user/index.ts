import { Router } from 'https://deno.land/x/oak/mod.ts';

import authenticate from '../../middlewares/authenticate.ts';
import get from './get.controller.ts';
import update from './update.controller.ts';

const router = new Router({ prefix: '/api' });
router.get('/user', authenticate, get);
router.patch('/user', authenticate, update);

export default router;
