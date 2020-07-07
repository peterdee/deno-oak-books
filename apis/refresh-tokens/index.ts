import { Router } from 'https://deno.land/x/oak/mod.ts';

import controller from './refresh-tokens.controller.ts';

const router = new Router({ prefix: '/api' });
router.get('/refresh-tokens', controller);

export default router;
