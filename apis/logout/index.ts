import { Router } from 'https://deno.land/x/oak@v5.3.1/mod.ts';

import authenticate from '../../middlewares/authenticate.ts';
import logout from './logout.controller.ts';

const router = new Router({ prefix: '/api' });
router.post('/logout', authenticate, logout);

export default router;
