import { Status } from 'https://deno.land/x/oak/mod.ts';

import { Context } from './types.ts';
import response from '../../utilities/response.ts';
import { SERVER_MESSAGES } from '../../config/index.ts';

/**
 * Get user data
 * @param {Context} ctx - context
 * @returns {Promise<void>}
 */
export default async function (ctx: Context): Promise<void> {
  return response(ctx, Status.OK, SERVER_MESSAGES.ok, ctx.user);
}
