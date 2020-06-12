import { Status } from 'https://deno.land/x/oak/mod.ts';

import { Context } from './types.ts';
import database, {
  collections,
  Follower,
  generateId,
  User,
} from '../../database/index.ts';
import response from '../../utilities/response.ts';
import { SERVER_MESSAGES } from '../../config/index.ts';

/**
 * Get user's following list
 * @param {Context} ctx - context
 * @returns {Promise<void>}
 */
export default async function (ctx: Context): Promise<void> {
  try {
    // check data
    const { params: { id = '' } = {} } = ctx;
    if (!id) {
      return response(ctx, Status.BadRequest, SERVER_MESSAGES.missingData);
    }

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
