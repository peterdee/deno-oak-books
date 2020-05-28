import { compare } from 'https://deno.land/x/bcrypt/mod.ts';
import { Context, Status } from 'https://deno.land/x/oak/mod.ts';

import database, {
  Password as PasswordInterface,
  User as UserInterface,
} from '../../database/index.ts';
import generateTokens from '../../utilities/generate-tokens.ts';
import response from '../../utilities/response.ts';
import { SERVER_MESSAGES } from '../../config/index.ts';
import { Tokens } from '../../utilities/types.ts';

/**
 * Handle the Login route
 * @param {Context} ctx - request context
 * @returns {Promise<void>}
 */
export default async function (ctx: Context): Promise<void> {
  try {
    // check data
    const {
      value: {
        email = '',
        password = '',
      }
    } = await ctx.request.body();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    if (!(trimmedEmail && trimmedPassword)) {
      return response(ctx, Status.BadRequest, SERVER_MESSAGES.missingData);
    }

    // get user record
    const User = database.collection('User');
    const userRecord: UserInterface = await User.findOne({
      email: trimmedEmail,
    });
    if (!userRecord) {
      return response(ctx, Status.Unauthorized, SERVER_MESSAGES.accessDenied);
    }

    // get password record
    const Password = database.collection('Password');
    const passwordRecord: PasswordInterface = await Password.findOne({
      userId: userRecord._id['$oid'],
    });
    if (!passwordRecord) {
      return response(ctx, Status.Unauthorized, SERVER_MESSAGES.accessDenied);
    }

    // compare the hashes
    const matching = await compare(trimmedPassword, passwordRecord.hash);
    if (!matching) {
      return response(ctx, Status.Unauthorized, SERVER_MESSAGES.accessDenied);
    }

    // generate the tokens
    const tokens: Tokens = generateTokens(userRecord._id['$oid']);

    return response(ctx, Status.OK, SERVER_MESSAGES.ok, tokens);
  } catch (error) {
    return response(ctx, Status.InternalServerError, SERVER_MESSAGES.internalServerError);
  }
};
