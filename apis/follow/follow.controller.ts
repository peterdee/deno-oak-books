import { Status } from 'https://deno.land/x/oak/mod.ts';

import { Context } from './types.ts';
import database, {
  collections,
  Follower,
  generateId,
} from '../../database/index.ts';
import response from '../../utilities/response.ts';
import { SERVER_MESSAGES } from '../../config/index.ts';

/**
 * Follow user
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

    // check if already following
    const Follower = database.collection('Follower');
    const [{ id: recordId = '', userId = '' } = {}] = await Follower.aggregate([
      { 
        $match: {
          followedId: id,
          userId: ctx.id,
        },
      },
      {
        $lookup: {
          from: collections.User,
          localField: 'followedId',
          foreignField: 'id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          id: 1,
          userId: '$user.id',
        },
      },
    ]);
    console.log(recordId, '|', userId)
    if (recordId && userId) {
      return response(ctx, Status.OK, SERVER_MESSAGES.ok);
    }
    if (!userId) {
      return response(ctx, Status.BadRequest, SERVER_MESSAGES.userNotFound);
    }

    // create a new record
    const now = Date.now();
    await Follower.insertOne({
      userId: ctx.id,
      created: `${now}`,
      entity: collections.Follower,
      followedId: id,
      id: generateId(),
      updated: `${now}`,
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
