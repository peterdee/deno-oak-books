import { Status } from 'https://deno.land/x/oak@v5.3.1/mod.ts';

import bodyParser from '../../utilities/body-parser.ts';
import database, { collections } from '../../database/index.ts';
import { Context, LogoutData } from './types.ts';
import response from '../../utilities/response.ts';
import sanitize from '../../utilities/sanitize.ts';
import { SERVER_MESSAGES } from '../../config/index.ts';

/**
 * Handle the logout
 * @param {Context} ctx - context
 * @returns {Promise<any>}
 */
export default async function (ctx: Context): Promise<any> {
  try {
    // check data
    const { refreshToken = '' }: LogoutData = await bodyParser(ctx, ['refreshToken']);
    const trimmedRefreshToken = sanitize(refreshToken.trim());
    if (!trimmedRefreshToken) {
      // logout anyway
      return response(ctx, Status.OK, SERVER_MESSAGES.ok);
    }

    // delete RefreshToken record (don't check if it exists)
    const RefreshToken = database.collection(collections.RefreshToken);
    await RefreshToken.deleteOne({
      userId: ctx.id,
      token: refreshToken,
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
