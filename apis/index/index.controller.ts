import { Status } from 'https://deno.land/std/http/http_status.ts';

import response from '../../utilities/response.ts';
import { SERVER_MESSAGES } from '../../config/index.ts';

/**
 * Handle the index route
 * @param {Context} ctx - Oak Context
 * @returns {void}
 */
export default function (ctx: any): void {
  return response(ctx, Status.OK, SERVER_MESSAGES.ok);
};
