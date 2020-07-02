import * as oak from 'https://deno.land/x/oak@v5.3.1/mod.ts';
import { oakCors } from 'https://deno.land/x/cors/mod.ts';
import { Snelm } from 'https://deno.land/x/snelm/mod.ts';

import { ENV, ENVS, PORT as port } from './config/index.ts';
import log from './utilities/log.ts';
import logger from './middlewares/logger.ts';
import responseTime from './middlewares/response-time.ts';

import changeEmail from './apis/change-email/index.ts';
import changePassword from './apis/change-password/index.ts';
import follow from './apis/follow/index.ts';
import index from './apis/index/index.ts';
import login from './apis/login/index.ts';
import logout from './apis/logout/index.ts';
import movies from './apis/movies/index.ts';
import passwordRecovery from './apis/password-recovery/index.ts';
import refreshTokens from './apis/refresh-tokens/index.ts';
import registration from './apis/registration/index.ts';
import user from './apis/user/index.ts';

const app = new oak.Application();

const snelm = new Snelm('oak');
await snelm.init();

// middlewares
app.use(oakCors());
app.use((ctx: oak.Context, next) => {
  ctx.response = snelm.snelm(ctx.request, ctx.response);
  return next();
});
app.use(logger);
app.use(responseTime);

// routing
app.use(changeEmail.routes());
app.use(changePassword.routes());
app.use(follow.routes());
app.use(index.routes());
app.use(login.routes());
app.use(logout.routes());
app.use(movies.routes());
app.use(passwordRecovery.routes());
app.use(refreshTokens.routes());
app.use(registration.routes());
app.use(user.routes());

log(`-- DENO + OAK is running on ${port} [${ENV.toUpperCase()}]`);
app.listen({
  hostname: (ENV === ENVS.heroku && '0.0.0.0') || '127.0.0.1',
  port,
});
