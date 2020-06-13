import { hash } from 'https://deno.land/x/bcrypt/mod.ts';
import { RouterContext, Status } from 'https://deno.land/x/oak/mod.ts';

import bodyParser from '../../utilities/body-parser.ts';
import database, {
  collections,
  Password as PasswordInterface,
} from '../../database/index.ts';
import response from '../../utilities/response.ts';
import sanitize from '../../utilities/sanitize.ts';
import { SERVER_MESSAGES } from '../../config/index.ts';
import { UpdatePasswordData } from './types.ts';

/**
 * Update user password
 * @param {RouterContext} ctx - context
 * @returns {Promise<void>}
 */
export default async function (ctx: RouterContext): Promise<void> {
  try {
    // check data
    const {
      code = '',
      newPassword = '',
    }: UpdatePasswordData = await bodyParser(ctx, ['code', 'newPassword']);
    const trimmedCode = sanitize(code.trim());
    const trimmedNewPassword = sanitize(newPassword.trim());
    if (!(trimmedCode && trimmedNewPassword)) {
      return response(ctx, Status.BadRequest, SERVER_MESSAGES.missingData);
    }

    // get Password record
    const Password = database.collection(collections.Password);
    const passwordRecord: PasswordInterface = await Password.findOne({
      recoveryCode: trimmedCode,
    });
    if (!passwordRecord) {
      return response(ctx, Status.BadRequest, SERVER_MESSAGES.invalidRecoveryCode);
    }

    // make sure that the code is not expired
    const ttl = 1000 * 60 * 60 * 4;
    if (Number(passwordRecord.updated) + ttl < Date.now()) {
      return response(ctx, Status.BadRequest, SERVER_MESSAGES.expiredRecoveryCode);
    }

    // hash the new password and update the Password record
    const hashed = hash(trimmedNewPassword);
    await Password.updateOne(
      {
        id: passwordRecord.id,
      },
      {
        $set: {
          hash: hashed,
          recoveryCode: null,
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
