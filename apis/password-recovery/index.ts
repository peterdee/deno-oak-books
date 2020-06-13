import { Router } from 'https://deno.land/x/oak/mod.ts';

import send from './send.controller.ts';
import update from './update.controller.ts';
import validate from './validate.controller.ts';

const router = new Router({ prefix: '/api' });
router.post('/password-recovery', send);
router.patch('/password-recovery', update);
router.get('/password-recovery/:id', validate);

export default router;
