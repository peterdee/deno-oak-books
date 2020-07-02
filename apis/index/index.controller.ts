import { RouterContext } from 'https://deno.land/x/oak@v5.3.1/mod.ts';

import response from '../../utilities/response.ts';

/**
 * Handle the index route
 * @param {RouterContext} ctx - Oak Context
 * @returns {void}
 */
export default function (ctx: RouterContext) {
  return response(ctx);
};
