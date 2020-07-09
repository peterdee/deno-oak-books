import { Status } from 'https://deno.land/x/oak/mod.ts';

import { Context, FollowerData } from './types.ts';
import database, { collections } from '../../database/index.ts';
import formatPagination from '../../utilities/format-pagination.ts';
import paginate, { Pagination } from '../../utilities/paginate.ts';
import response, { Response } from '../../utilities/response.ts';
import { SERVER_MESSAGES } from '../../config/index.ts';

/**
 * Get followers list
 * @param {Context} ctx - context
 * @returns {Promise<Response|*>}
 */
export default async function (ctx: Context): Promise<Response|any> {
  try {
    // get pagination data
    const { limit, offset, page }: Pagination = paginate(ctx);

    // get Followers
    const Follower = database.collection(collections.Follower);
    const [results, total]: [FollowerData[], number] = await Promise.all([
      Follower.aggregate([
        { 
          $match: {
            followedId: ctx.id,
          },
        },
        {
          $sort: {
            created: -1,
          },
        },
        {
          $skip: offset,
        },
        {
          $limit: limit,
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
            email: '$user.email',
            firstName: '$user.firstName',
            id: '$user.id',
            lastName: '$user.lastName',
          },
        },
      ]),
      Follower.count({ followedId: ctx.id }),
    ]);

    return response(
      ctx,
      Status.OK,
      SERVER_MESSAGES.ok,
      {
        pagination: formatPagination(Number(limit), Number(page), total),
        results,
      },
    );
  } catch (error) {
    return response(
      ctx,
      Status.InternalServerError,
      SERVER_MESSAGES.internalServerError,
      error,
    );
  }
};
