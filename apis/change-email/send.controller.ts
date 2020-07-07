import { Status } from 'https://deno.land/x/oak/mod.ts';

import bodyParser from '../../utilities/body-parser.ts';
import { ChangeEmailData, Context } from './types.ts';
import { createChangeEmailTemplate } from '../../utilities/templates.ts';
import database, {
  collections,
  generateId,
  User as UserInterface,
} from '../../database/index.ts';
import { FRONTEND_URI, SERVER_MESSAGES } from '../../config/index.ts';
import generateString from '../../utilities/generate-string.ts';
import mailer from '../../utilities/mailer.ts';
import response from '../../utilities/response.ts';
import sanitize from '../../utilities/sanitize.ts';

/**
 * Send a link to change user email address
 * @param {Context} ctx - context
 * @returns {Promise<any>}
 */
export default async function (ctx: Context): Promise<any> {
  try {
    // check data
    const { newEmail = '' }: ChangeEmailData = await bodyParser(ctx, ['newEmail']);
    const trimmedNewEmail = sanitize(newEmail.trim().toLowerCase());
    if (!trimmedNewEmail) {
      return response(ctx, Status.BadRequest, SERVER_MESSAGES.missingData);
    }

    // check if new email address is available
    const User = database.collection(collections.User);
    const existingUser: UserInterface = await User.findOne({
      email: trimmedNewEmail,
      id: {
        $ne: ctx.id,
      },
    });
    if (existingUser) {
      return response(ctx, Status.BadRequest, SERVER_MESSAGES.emailIsAlreadyInUse);
    }

    // generate a code, send an email
    const code = generateString(24);
    const link = `${FRONTEND_URI}/change-email/${code}`;
    const { template = '', topic = '' } = createChangeEmailTemplate(
      ctx.user?.firstName,
      ctx.user?.lastName,
      link,
    );
    mailer(trimmedNewEmail, template, topic);

    // delete all of the existing UserEmail records
    const UserEmail = database.collection(collections.UserEmail);
    await UserEmail.deleteMany({
      userId: ctx.id,
    });

    // create a new UserEmail record
    const now = `${Date.now()}`;
    await UserEmail.insertOne({
      code,
      created: now,
      entity: collections.UserEmail,
      id: generateId(),
      newEmail: trimmedNewEmail,
      oldEmail: ctx.user?.email,
      updated: now,
      userId: ctx.id,
    });

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
