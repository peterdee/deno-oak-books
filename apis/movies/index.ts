import { Router } from 'https://deno.land/x/oak@v5.3.1/mod.ts';

import search from './search.controller.ts';

const router = new Router({ prefix: '/api' });
router.get('/movies/search', search);

export default router;
