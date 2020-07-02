import { Router } from 'https://deno.land/x/oak@v5.3.1/mod.ts';

import authenticate from '../../middlewares/authenticate.ts';
import controller from './change-password.controller.ts';

const router = new Router({ prefix: '/api' });
router.post('/change-password', authenticate, controller);

export default router;
