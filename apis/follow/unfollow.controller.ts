import { Status } from 'https://deno.land/x/oak/mod.ts';

import { Context } from './types.ts';
import database, { collections } from '../../database/index.ts';
import response, { Response } from '../../utilities/response.ts';
import { SERVER_MESSAGES } from '../../config/index.ts';

/**
 * Unfollow user
 * @param {Context} ctx - context
 * @returns {Promise<Response|*>}
 */
export default async function (ctx: Context): Promise<Response|any> {
  try {
    // check data
    const { params: { id = '' } = {} } = ctx;
    if (!id) {
      return response(ctx, Status.BadRequest, SERVER_MESSAGES.missingData);
    }

    // delete the record, do not perform any additional checks
    await database.collection(collections.Follower).deleteOne({
      followedId: id,
      userId: ctx.id,
    });

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
