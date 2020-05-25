import * as oak from 'https://deno.land/x/oak/mod.ts';
import { Snelm } from 'https://deno.land/x/snelm/mod.ts';

import { ENV, ENVS, PORT as port } from './config/index.ts';

const app = new oak.Application();

const snelm = new Snelm('oak');
await snelm.init();

// use middlewares
app.use((ctx, next) => {
  ctx.response = snelm.snelm(ctx.request, ctx.response);
  return next();
});

app.use((ctx: oak.Context) => {
  ctx.response.body = "Hello World!";
});

console.log(`-- DENO + OAK is running on ${port} [${ENV}]`);
app.listen({
  hostname: (ENV === ENVS.heroku && '0.0.0.0') || '127.0.0.1',
  port,
});
