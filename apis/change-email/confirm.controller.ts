import { RouterContext, Status } from 'https://deno.land/x/oak/mod.ts';

import { Context } from './types.ts';
import database, {
  collections,
  User as UserInterface,
  UserEmail as UserEmailInterface,
} from '../../database/index.ts';
import response from '../../utilities/response.ts';
import { SERVER_MESSAGES } from '../../config/index.ts';

/**
 * Confirm a new email address
 * @param {Context|RouterContext} ctx - context
 * @returns {Promise<*>}
 */
export default async function (ctx: Context|RouterContext): Promise<any> {
  try {
    // check data
    const { params: { code = '' } = {} } = ctx;
    if (!code) {
      return response(ctx, Status.BadRequest, SERVER_MESSAGES.missingData);
    }

    // get the UserEmail record
    const UserEmail = database.collection(collections.UserEmail);
    const record: UserEmailInterface = await UserEmail.findOne({ code });
    if (!record) {
      return response(ctx, Status.BadRequest, SERVER_MESSAGES.invalidConfirmationCode);
    }

    // check if new email address is available
    const User = database.collection(collections.User);
    const existingUser: UserInterface = await User.findOne({
      email: record.newEmail,
      id: {
        $ne: record.userId,
      },
    });
    if (existingUser) {
      return response(ctx, Status.BadRequest, SERVER_MESSAGES.emailIsAlreadyInUse);
    }

    // update User record, delete UserEmail records
    await Promise.all([
      User.updateOne(
        {
          id: record.userId,
        },
        {
          $set: {
            email: record.newEmail,
            updated: `${Date.now()}`,
          },
        },
      ),
      UserEmail.deleteMany({ userId: record.userId }),
    ]);

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
