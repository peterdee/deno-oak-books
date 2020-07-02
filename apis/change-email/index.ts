import { Router } from 'https://deno.land/x/oak@v5.3.1/mod.ts';

import authenticate from '../../middlewares/authenticate.ts';
import confirm from './confirm.controller.ts';
import send from './send.controller.ts';

const router = new Router({ prefix: '/api' });
router.get('/change-email/:code', confirm);
router.post('/change-email', authenticate, send);

export default router;
