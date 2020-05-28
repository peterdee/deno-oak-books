import { Router } from 'https://deno.land/x/oak/mod.ts';

import controller from './login.controller.ts';

const router = new Router();
router.post('/api/login', controller);

export default router;
