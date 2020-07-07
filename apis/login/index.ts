import { Router } from 'https://deno.land/x/oak/mod.ts';

import controller from './login.controller.ts';

const router = new Router({ prefix: '/api' });
router.post('/login', controller);

export default router;
