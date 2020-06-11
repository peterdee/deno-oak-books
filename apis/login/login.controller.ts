import { compare } from 'https://deno.land/x/bcrypt/mod.ts';
import { RouterContext, Status } from 'https://deno.land/x/oak/mod.ts';

import bodyParser from '../../utilities/body-parser.ts';
import database, {
  Password as PasswordInterface,
  User as UserInterface,
} from '../../database/index.ts';
import generateTokens from '../../utilities/generate-tokens.ts';
import { LoginData } from './types.ts';
import response from '../../utilities/response.ts';
import sanitize from '../../utilities/sanitize.ts';
import { SERVER_MESSAGES } from '../../config/index.ts';
import { TokenPair } from '../../utilities/types.ts';

/**
 * Handle the Login route
 * @param {RouterContext} ctx - context
 * @returns {Promise<void>}
 */
export default async function (ctx: RouterContext): Promise<void> {
  try {
    // check data
    const {
      email = '',
      password = '',
    }: LoginData = await bodyParser(ctx, ['email', 'password']);
    const trimmedEmail = sanitize(email.trim());
    const trimmedPassword = sanitize(password.trim());
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
      // userId: userRecord._id['$oid'],
      userId: userRecord.id,
    });
    if (!passwordRecord) {
      return response(ctx, Status.Unauthorized, SERVER_MESSAGES.accessDenied);
    }

    const x = await User.aggregate([
      { 
        $match: {
          email: trimmedEmail,
        },
      },
      {
        $lookup: {
          from: 'Password',
          localField: 'id',
          foreignField: 'userId',
          as: 'password',
        },
      },
      {
        $unwind: {
          path: '$password',
          preserveNullAndEmptyArrays: true,
        },
      },
      // {
      //   $project: {
      //     _id: 1,
      //     hash: '$password.hash',
      //   },
      // },
    ]);
    console.log('x', x);

    // compare the hashes
    const matching = await compare(trimmedPassword, passwordRecord.hash);
    if (!matching) {
      return response(ctx, Status.Unauthorized, SERVER_MESSAGES.accessDenied);
    }

    // generate the tokens
    const tokens: TokenPair = generateTokens(userRecord._id['$oid']);

    return response(ctx, Status.OK, SERVER_MESSAGES.ok, tokens);
  } catch (error) {
    return response(
      ctx,
      Status.InternalServerError,
      SERVER_MESSAGES.internalServerError,
      error,
    );
  }
};
