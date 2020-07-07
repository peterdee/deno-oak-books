import { Router } from 'https://deno.land/x/oak/mod.ts';

import authenticate from '../../middlewares/authenticate.ts';
import follow from './follow.controller.ts';
import followers from './followers.controller.ts';
import following from './following.controller.ts';
import unfollow from './unfollow.controller.ts';

const router = new Router({ prefix: '/api' });
router.get('/follow/:id', authenticate, follow);
router.get('/followers', authenticate, followers);
router.get('/following', authenticate, following);
router.delete('/unfollow/:id', authenticate, unfollow);

export default router;
