import { RouterContext } from 'https://deno.land/x/oak/mod.ts';

import response from '../../utilities/response.ts';

/**
 * Handle the index route
 * @param {RouterContext} ctx - Oak Context
 * @returns {void}
 */
export default async function (ctx: RouterContext): Promise<any> {
  return response(ctx);
};
