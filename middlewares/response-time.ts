/**
 * Response time middleware
 * @param {RouterContext} ctx - context
 * @param {*} next - call the next middleware
 */
export default async function (ctx: any, next: any) {
  const start = Date.now();
  await next();
  ctx.response.headers.set('X-Response-Time', `${Date.now() - start}ms`);
}
