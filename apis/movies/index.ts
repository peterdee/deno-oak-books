import { Router } from 'https://deno.land/x/oak/mod.ts';

import search from './search.controller.ts';

const router = new Router({ prefix: '/api' });
router.get('/movies/search', search);

export default router;
