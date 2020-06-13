import { hash } from 'https://deno.land/x/bcrypt/mod.ts';
import { RouterContext, Status } from 'https://deno.land/x/oak/mod.ts';

import { SERVER_MESSAGES } from '../../config/index.ts';
import bodyParser from '../../utilities/body-parser.ts';
import database, {
  collections,
  Password as PasswordInterface,
} from '../../database/index.ts';
import generateTokens from '../../utilities/generate-tokens.ts';
import response from '../../utilities/response.ts';
import sanitize from '../../utilities/sanitize.ts';

/**
 * Change user password
 * @param {RouterContext} ctx - context
 * @returns {Promise<void>}
 */
export default async function (ctx: RouterContext): Promise<void> {
  try {
    // TODO

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
