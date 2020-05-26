import { Status } from 'https://deno.land/std/http/http_status.ts';
import { validateJwt } from 'https://deno.land/x/djwt/validate.ts';

import database, { User } from '../database/index.ts';
import response from '../utilities/response.ts';
import { SERVER_MESSAGES, TOKENS } from '../config/index.ts';

/**
 * Authenticate the user
 * @param {Context} ctx - Oak Context
 * @param {*} next - call the next middleware
 * @returns {Promise<void>}
 */
export default async function (ctx: any, next: any): Promise<void> {
  try {
    // check the token
    const { request: { headers: { 'x-access-token': token = '' } = {} } = {} } = ctx;
    if (!token) {
      return response(ctx, Status.Unauthorized, SERVER_MESSAGES.missingToken);
    }

    const decoded = await validateJwt(token, TOKENS.access.secret, { isThrowing: true });

    // TODO: checks, the rest of the logic

    // get the record
    const Users = database.collection('Users');
    const user: User = await Users.findOne({
      _id: {
        '$oid': decoded.id,
      },
    });

    if (!user) {
      return response(ctx, Status.Unauthorized, SERVER_MESSAGES.accessDenied);
    }

    // continue
    ctx.id = decoded.id;
    return next();
  } catch (error) {
    // TODO: check if the error is caused by the token expiration

    return response(ctx, Status.Unauthorized, SERVER_MESSAGES.accessDenied);
  }
}
