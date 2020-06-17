import { compare, hash } from 'https://deno.land/x/bcrypt/mod.ts';
import { Status } from 'https://deno.land/x/oak/mod.ts';

import bodyParser from '../../utilities/body-parser.ts';
import { Context, PasswordData } from './types.ts';
import database, {
  collections,
  Password as PasswordInterface,
} from '../../database/index.ts';
import response from '../../utilities/response.ts';
import sanitize from '../../utilities/sanitize.ts';
import { SERVER_MESSAGES } from '../../config/index.ts';

/**
 * Change user password
 * @param {Context} ctx - context
 * @returns {Promise<void>}
 */
export default async function (ctx: Context): Promise<void> {
  try {
    // check data
    const {
      newPassword = '',
      oldPassword = '',
    }: PasswordData = await bodyParser(ctx, [
      'newPassword',
      'oldPassword',
    ]);
    const trimmedNewPassword = sanitize(newPassword.trim());
    const trimmedOldPassword = sanitize(oldPassword.trim());
    if (!(trimmedNewPassword && trimmedOldPassword)) {
      return response(ctx, Status.BadRequest, SERVER_MESSAGES.missingData);
    }

    // get the password record
    const Password = database.collection(collections.Password);
    const password: PasswordInterface = await Password.findOne({
      userId: ctx.id,
    });
    if (!password) {
      return response(ctx, Status.Unauthorized, SERVER_MESSAGES.accessDenied);
    }

    // compare the hashes
    const matching = await compare(trimmedOldPassword, password.hash);
    if (!matching) {
      return response(ctx, Status.Unauthorized, SERVER_MESSAGES.oldPasswordIsInvalid);
    }

    // update the Password record
    const hashed = await hash(trimmedNewPassword);
    await Password.updateOne(
      {
        userId: ctx.id,
      },
      {
        $set: {
          hash: hashed,
          updated: `${Date.now()}`,
        },
      },
    );

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
