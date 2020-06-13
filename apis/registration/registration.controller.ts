import { hash } from 'https://deno.land/x/bcrypt/mod.ts';
import { RouterContext, Status } from 'https://deno.land/x/oak/mod.ts';

import { ACCOUNT_TYPES, SERVER_MESSAGES } from '../../config/index.ts';
import bodyParser from '../../utilities/body-parser.ts';
import database, {
  collections,
  generateId,
  User as UserInterface,
} from '../../database/index.ts';
import generateTokens from '../../utilities/generate-tokens.ts';
import { RegistrationData } from './types.ts';
import response from '../../utilities/response.ts';
import sanitize from '../../utilities/sanitize.ts';
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
      firstName = '',
      lastName = '',
      password = '',
    }: RegistrationData = await bodyParser(ctx, [
      'email',
      'firstName',
      'lastName',
      'password',
    ]);
    const trimmedEmail = sanitize(email.trim());
    const trimmedFirstName = sanitize(firstName.trim());
    const trimmedLastName = sanitize(lastName.trim());
    const trimmedPassword = sanitize(password.trim());
    if (!(trimmedEmail && trimmedFirstName && trimmedLastName && trimmedPassword)) {
      return response(ctx, Status.BadRequest, SERVER_MESSAGES.missingData);
    }

    // check if email is available
    const User = database.collection(collections.User);
    const existingRecord: UserInterface = await User.findOne({
      email: trimmedEmail,
    });
    if (existingRecord) {
      return response(ctx, Status.Unauthorized, SERVER_MESSAGES.emailIsAlreadyInUse);
    }

    // create a new User record, hash the password
    const now = Date.now();
    const userId = generateId();
    const [hashed] = await Promise.all([
      hash(trimmedPassword),
      User.insertOne({
        accountType: ACCOUNT_TYPES.user,
        created: `${now}`,
        email: trimmedEmail,
        entity: collections.User,
        firstName: trimmedFirstName,
        id: userId,
        lastName: trimmedLastName,
        updated: `${now}`,
      }),
    ]);

    // create the Password record
    await database.collection(collections.Password).insertOne({
      created: `${now}`,
      entity: collections.Password,
      hash: hashed,
      id: generateId(),
      recoveryCode: null,
      updated: `${now}`,
      userId,
    });

    // generate the tokens
    const tokens: TokenPair = generateTokens(userId);

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
