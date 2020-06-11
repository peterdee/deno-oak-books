import { Status } from 'https://deno.land/x/oak/mod.ts';
import { validateJwt } from 'https://deno.land/x/djwt/validate.ts';

import database, { collections, User } from '../database/index.ts';
import response from '../utilities/response.ts';
import { SERVER_MESSAGES, TOKENS } from '../config/index.ts';

const expired = 'EXPIRED';
const invalid = 'INVALID';

/**
 * Authenticate the user
 * @param {RouterContext} ctx - context
 * @param {*} next - call the next middleware
 * @returns {Promise<void>}
 */
export default async function (ctx: any, next: any): Promise<void> {
  try {
    // check the token
    const token = ctx.request.headers.get('X-Access-Token') || '';
    if (!token) {
      return response(ctx, Status.Unauthorized, SERVER_MESSAGES.missingToken);
    }

    const decoded: any = await validateJwt(token, TOKENS.access.secret);
    if (!(decoded && decoded.isValid)) {
      throw invalid;
    }
    if (decoded && decoded.isExpired) {
      throw expired;
    }
    if (decoded && decoded.error) {
      throw decoded.error;
    }

    // get the record
    const User = database.collection(collections.User);
    const user: User = await User.findOne({ id: decoded.payload.iss });
    if (!user) {
      return response(ctx, Status.Unauthorized, SERVER_MESSAGES.accessDenied);
    }

    // continue
    ctx.id = decoded.payload.iss;
    return next();
  } catch (error) {
    if (error === expired) {
      return response(ctx, Status.Unauthorized, SERVER_MESSAGES.expiredToken);
    }
    if (error === invalid) {
      return response(ctx, Status.Unauthorized, SERVER_MESSAGES.invalidToken);
    }

    return response(ctx, Status.Unauthorized, SERVER_MESSAGES.accessDenied);
  }
}
