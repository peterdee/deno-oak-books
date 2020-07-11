import { Router } from 'https://deno.land/x/oak/mod.ts';

import getById from './get-by-id.controller.ts';
import search from './search.controller.ts';

const router = new Router({ prefix: '/api/movies' });
router.get('/id/:id', getById);
router.get('/search', search);

export default router;
