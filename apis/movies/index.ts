import { Router } from 'https://deno.land/x/oak/mod.ts';

import search from './search.controller.ts';

const router = new Router({ prefix: '/api/movies' });
router.get('/search', search);

export default router;
