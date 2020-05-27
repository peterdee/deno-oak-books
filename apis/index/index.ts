import { Router } from 'https://deno.land/x/oak/mod.ts';

import controller from './index.controller.ts';

const router = new Router();
router.get('/', controller);

export default router;
