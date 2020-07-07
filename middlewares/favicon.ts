import { Status } from 'https://deno.land/x/oak/mod.ts';

import response from '../utilities/response.ts';
import { Response } from '../utilities/types.ts';

/**
 * Response time middleware
 * @param {Context|RouterContext} ctx - context
 * @param {*} next - call the next middleware
 */
export default async function (ctx: any, next: any): Promise<Response|any> {
  if (ctx.request.url.pathname === '/favicon.ico' && ctx.request.method === 'GET') {
    return response(ctx, Status.NoContent);
  }
  return next();
}
