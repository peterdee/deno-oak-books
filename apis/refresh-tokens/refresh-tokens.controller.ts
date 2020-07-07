import { RouterContext, Status } from 'https://deno.land/x/oak/mod.ts';
import { validateJwt } from 'https://deno.land/x/djwt/validate.ts';

import database, {
  collections,
  RefreshToken as RefreshTokenInterface,
  User as UserInterface,
} from '../../database/index.ts';
import generateTokens from '../../utilities/generate-tokens.ts';
import response from '../../utilities/response.ts';
import { SERVER_MESSAGES, TOKENS } from '../../config/index.ts';
import { TokenPair } from '../../utilities/types.ts';

/**
 * Refresh tokens
 * @param {RouterContext} ctx - context
 * @returns {Promise<any>}
 */
export default async function (ctx: RouterContext): Promise<any> {
  try {
    // check the token
    const token = ctx.request.headers.get('X-Refresh-Token') || '';
    if (!token) {
      return response(ctx, Status.BadRequest, SERVER_MESSAGES.missingRefreshToken);
    }

    // decode & validate the token
    const decoded: any = await validateJwt(token, TOKENS.refresh.secret);
    if (!(decoded && decoded.isValid)) {
      return response(ctx, Status.Unauthorized, SERVER_MESSAGES.accessDenied);
    }
    if (decoded && (decoded.isExpired || decoded.error)) {
      return response(ctx, Status.Unauthorized, SERVER_MESSAGES.accessDenied);
    }

    // get the User record and RefreshToken record
    const RefreshToken = database.collection(collections.RefreshToken);
    const User = database.collection(collections.User);
    const [
      tokenRecord,
      userRecord,
    ]: [RefreshTokenInterface, UserInterface] = await Promise.all([
      RefreshToken.findOne({
        token,
        userId: decoded.payload.iss,
      }),
      User.findOne({
        id: decoded.payload.iss,
      }),
    ]);
    if (!(tokenRecord && userRecord)) {
      return response(ctx, Status.Unauthorized, SERVER_MESSAGES.accessDenied);
    }

    // delete the used Refresh Token
    await RefreshToken.deleteOne({
      id: tokenRecord.id,
    });

    // generate a new set of tokens
    const tokens: TokenPair = generateTokens(decoded.payload.iss);

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
