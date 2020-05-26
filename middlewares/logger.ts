import { bold, blue, green } from 'https://deno.land/std@0.53.0/fmt/colors.ts';

/**
 * Logger middleware
 * @param {Context} ctx - Oak Context
 * @param {*} next - call the next middleware
 * @returns {Promise<void>}
 */
export default async function (ctx: any, next: any): Promise<void> {
  await next();
  const rt = ctx.response.headers.get('X-Response-Time');
  console.log(
    `${green(ctx.request.method)} ${blue(ctx.request.url.pathname)} - ${
      bold(
        String(rt),
      )
    }`,
  );
}
