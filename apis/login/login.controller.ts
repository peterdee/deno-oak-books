import { compare } from 'https://deno.land/x/bcrypt/mod.ts';
import { RouterContext, Status } from 'https://deno.land/x/oak/mod.ts';

import bodyParser from '../../utilities/body-parser.ts';
import database, { collections, generateId } from '../../database/index.ts';
import generateTokens from '../../utilities/generate-tokens.ts';
import { LoginData } from './types.ts';
import response from '../../utilities/response.ts';
import sanitize from '../../utilities/sanitize.ts';
import { SERVER_MESSAGES } from '../../config/index.ts';
import { TokenPair } from '../../utilities/types.ts';

/**
 * Handle the Login route
 * @param {RouterContext} ctx - context
 * @returns {Promise<void>}
 */
export default async function (ctx: RouterContext): Promise<void> {
  try {
    // check data
    const {
      email = '',
      password = '',
    }: LoginData = await bodyParser(ctx, ['email', 'password']);
    const trimmedEmail = sanitize(email.trim().toLowerCase());
    const trimmedPassword = sanitize(password.trim());
    if (!(trimmedEmail && trimmedPassword)) {
      return response(ctx, Status.BadRequest, SERVER_MESSAGES.missingData);
    }

    // get user record
    const User = database.collection(collections.User);
    const [{ hash = '', id = '' } = {}] = await User.aggregate([
      { 
        $match: {
          email: trimmedEmail,
        },
      },
      {
        $lookup: {
          from: collections.Password,
          localField: 'id',
          foreignField: 'userId',
          as: 'password',
        },
      },
      {
        $unwind: {
          path: '$password',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          hash: '$password.hash',
          id: 1,
        },
      },
    ]);
    if (!(hash && id)) {
      return response(ctx, Status.Unauthorized, SERVER_MESSAGES.accessDenied);
    }

    // compare the hashes
    const matching = await compare(trimmedPassword, hash);
    if (!matching) {
      return response(ctx, Status.Unauthorized, SERVER_MESSAGES.accessDenied);
    }

    // generate the tokens
    const tokens: TokenPair = generateTokens(id);

    // store Refresh Token
    const now = `${Date.now()}`;
    await database.collection(collections.RefreshToken).insertOne({
      created: now,
      entity: collections.RefreshToken,
      id: generateId(),
      token: tokens.refresh,
      updated: now,
      userId: id,
    });

    return response(ctx, Status.OK, SERVER_MESSAGES.ok, tokens);
  } catch (error) {
    return response(
      ctx,
      Status.InternalServerError,
      SERVER_MESSAGES.internalServerError,
      error,
    );
  }
};
