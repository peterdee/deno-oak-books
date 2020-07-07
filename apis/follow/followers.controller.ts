import { Status } from 'https://deno.land/x/oak/mod.ts';

import { Context } from './types.ts';
import database, {
  collections,
  Follower,
  generateId,
  User,
} from '../../database/index.ts';
import paginate, { Pagination } from '../../utilities/paginate.ts';
import response, { Response } from '../../utilities/response.ts';
import { SERVER_MESSAGES } from '../../config/index.ts';

/**
 * Get user's followers list
 * @param {Context} ctx - context
 * @returns {Promise<Response|*>}
 */
export default async function (ctx: Context): Promise<Response|any> {
  try {
    const { limit, offset, page }: Pagination = paginate(ctx);


    return response(ctx, Status.OK, SERVER_MESSAGES.ok);
  } catch (error) {
    return response(
      ctx,
      Status.InternalServerError,
      SERVER_MESSAGES.internalServerError,
      error,
    );
  }
};
