import { Status } from 'https://deno.land/x/oak@v5.3.1/mod.ts';

import bodyParser from '../../utilities/body-parser.ts';
import database, { collections } from '../../database/index.ts';
import { Context, UpdateUserData } from './types.ts';
import response from '../../utilities/response.ts';
import sanitize from '../../utilities/sanitize.ts';
import { SERVER_MESSAGES } from '../../config/index.ts';

/**
 * Update user data
 * @param {Context} ctx - context
 * @returns {Promise<any>}
 */
export default async function (ctx: Context): Promise<any> {
  try {
    // check data
    const { firstName = '', lastName = '' }: UpdateUserData = await bodyParser(ctx, [
      'firstName',
      'lastName',
    ]);
    const trimmedFirstName = sanitize(firstName.trim());
    const trimmedLastName = sanitize(lastName.trim());
    if (!(trimmedFirstName && trimmedLastName)) {
      return response(ctx, Status.BadRequest, SERVER_MESSAGES.missingData);
    }

    // update the User record
    await database.collection(collections.User).updateOne(
      {
        id: ctx.id,
      },
      {
        $set: {
          firstName: trimmedFirstName,
          fullName: `${trimmedFirstName} ${trimmedLastName}`,
          lastName: trimmedLastName,
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
