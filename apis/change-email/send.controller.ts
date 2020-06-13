import { Status } from 'https://deno.land/x/oak/mod.ts';

import bodyParser from '../../utilities/body-parser.ts';
import { ChangeEmailData, Context } from './types.ts';
import database, {
  collections,
  Password as PasswordInterface,
} from '../../database/index.ts';
import response from '../../utilities/response.ts';
import sanitize from '../../utilities/sanitize.ts';
import { SERVER_MESSAGES } from '../../config/index.ts';

/**
 * Send a link to change user email address
 * @param {Context} ctx - context
 * @returns {Promise<void>}
 */
export default async function (ctx: Context): Promise<void> {
  try {
    // check data
    const { newEmail = '' }: ChangeEmailData = await bodyParser(ctx, ['newEmail']);
    const trimmedNewEmail = sanitize(newEmail.trim());
    if (!trimmedNewEmail) {
      return response(ctx, Status.BadRequest, SERVER_MESSAGES.missingData);
    }

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
