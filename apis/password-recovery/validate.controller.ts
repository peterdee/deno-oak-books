import { RouterContext, Status } from 'https://deno.land/x/oak/mod.ts';

import database, {
  collections,
  Password as PasswordInterface,
} from '../../database/index.ts';
import response from '../../utilities/response.ts';
import sanitize from '../../utilities/sanitize.ts';
import { SERVER_MESSAGES } from '../../config/index.ts';

/**
 * Validate password recovery code
 * @param {RouterContext} ctx - context
 * @returns {Promise<void>}
 */
export default async function (ctx: RouterContext): Promise<void> {
  try {
    // check data
    const { params: { code = '' } = {} } = ctx;
    const sanitizedCode = sanitize(code);
    if (!sanitizedCode) {
      return response(ctx, Status.BadRequest, SERVER_MESSAGES.missingData);
    }

    // get Password record
    const Password = database.collection(collections.Password);
    const passwordRecord: PasswordInterface = await Password.findOne({
      recoveryCode: sanitizedCode,
    });
    if (!passwordRecord) {
      return response(ctx, Status.BadRequest, SERVER_MESSAGES.invalidRecoveryCode);
    }

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
