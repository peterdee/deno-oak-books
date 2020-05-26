import * as oak from 'https://deno.land/x/oak/mod.ts';
import { oakCors } from 'https://deno.land/x/cors/mod.ts';
import { Snelm } from 'https://deno.land/x/snelm/mod.ts';

import { ENV, ENVS, PORT as port } from './config/index.ts';
import log from './utilities/log.ts';
import logger from './middlewares/logger.ts';
import responseTime from './middlewares/response-time.ts';

const app = new oak.Application();

const snelm = new Snelm('oak');
await snelm.init();

// middlewares
app.use(oakCors());
app.use((ctx, next) => {
  ctx.response = snelm.snelm(ctx.request, ctx.response);
  return next();
});
app.use(logger);
app.use(responseTime);

// routing
app.use((ctx: oak.Context) => {
  ctx.response.body = "Hello World!";
});

log(`-- DENO + OAK is running on ${port} [${ENV.toUpperCase()}]`);
app.listen({
  hostname: (ENV === ENVS.heroku && '0.0.0.0') || '127.0.0.1',
  port,
});
