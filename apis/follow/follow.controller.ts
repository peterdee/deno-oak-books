import { Status } from 'https://deno.land/x/oak@v5.3.1/mod.ts';

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
 * Follow user
 * @param {Context} ctx - context
 * @returns {Promise<any>}
 */
export default async function (ctx: Context): Promise<any> {
  try {
    // check data
    const { params: { id = '' } = {} } = ctx;
    if (!id) {
      return response(ctx, Status.BadRequest, SERVER_MESSAGES.missingData);
    }

    // check if already following
    const Follower = database.collection(collections.Follower);
    const followingRecord: Follower = await Follower.findOne({
      followedId: id,
      userId: ctx.id,
    });
    if (followingRecord) {
      return response(ctx, Status.OK, SERVER_MESSAGES.ok);
    }

    // check if User ID is valid
    const User = database.collection(collections.User);
    const existingUser: User = await User.findOne({ id });
    if (!existingUser) {
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
