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
    // get pagination data
    const { limit, offset, page }: Pagination = paginate(ctx);

    // get Followers
    const Follower = database.collection(collections.Follower);
    const records = await Follower.aggregate([
      { 
        $match: {
          followedId: ctx.id,
        },
      },
      {
        $lookup: {
          from: collections.User,
          localField: 'userId',
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
          // TODO: fields to get
        },
      },
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
