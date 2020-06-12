import { Router } from 'https://deno.land/x/oak/mod.ts';

import authenticate from '../../middlewares/authenticate.ts';
import controller from './change-password.controller.ts';

const router = new Router({ prefix: '/api' });
router.post('/change-password', authenticate, controller);

export default router;
