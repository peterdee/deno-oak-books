import { Status } from 'https://deno.land/x/oak/mod.ts';

import database, { collections } from '../../database/index.ts';
import { Context } from './types.ts';
import response from '../../utilities/response.ts';
import { SERVER_MESSAGES } from '../../config/index.ts';

/**
 * Delete all of the user data
 * @param {Context} ctx - context
 * @returns {Promise<void>}
 */
export default async function (ctx: Context): Promise<void> {
  try {
    const { id: userId = '' } = ctx;
    await Promise.all([
      database.collection(collections.Follower).deleteMany({ userId }),
      database.collection(collections.Password).deleteOne({ userId }),
      database.collection(collections.RefreshToken).deleteMany({ userId }),
      database.collection(collections.User).deleteOne({ id: userId }),
      database.collection(collections.UserEmail).deleteMany({ userId }),
    ]);

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
