import { Router } from 'https://deno.land/x/oak@v5.3.1/mod.ts';

import controller from './index.controller.ts';

const router = new Router();
router.get('/', controller);

export default router;
