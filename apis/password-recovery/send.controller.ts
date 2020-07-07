import { RouterContext, Status } from 'https://deno.land/x/oak/mod.ts';

import bodyParser from '../../utilities/body-parser.ts';
import { createPasswordRecoveryTemplate } from '../../utilities/templates.ts';
import database, { collections } from '../../database/index.ts';
import { FRONTEND_URI, SERVER_MESSAGES } from '../../config/index.ts';
import generateString from '../../utilities/generate-string.ts';
import response from '../../utilities/response.ts';
import sanitize from '../../utilities/sanitize.ts';
import { SendLinkData } from './types.ts';
import mailer from '../../utilities/mailer.ts';

/**
 * Send password recovery link
 * @param {RouterContext} ctx - context
 * @returns {Promise<any>}
 */
export default async function (ctx: RouterContext): Promise<any> {
  try {
    // check data
    const { email = '' }: SendLinkData = await bodyParser(ctx, ['email']);
    const trimmedEmail = sanitize(email.trim());
    if (!trimmedEmail) {
      return response(ctx, Status.BadRequest, SERVER_MESSAGES.missingData);
    }

    // find User and Password records
    const User = database.collection(collections.User);
    const [{
      firstName = '',
      hash = '',
      id = '',
      lastName = '',
    } = {}] = await User.aggregate([
      { 
        $match: {
          email: trimmedEmail,
        },
      },
      {
        $lookup: {
          from: collections.Password,
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
      {
        $project: {
          firstName: 1,
          hash: '$password.hash',
          id: 1,
          lastName: 1,
        },
      },
    ]);
    if (!(firstName && hash && id && lastName)) {
      return response(ctx, Status.Unauthorized, SERVER_MESSAGES.accessDenied);
    }

    // generate a code and send recovery email
    const code = generateString(24);
    const link = `${FRONTEND_URI}/password-recovery/${code}`;
    const { template = '', topic = '' } = createPasswordRecoveryTemplate(
      firstName,
      lastName,
      link,
    );
    mailer(trimmedEmail, template, topic);

    // update the Password record
    await database.collection(collections.Password).updateOne(
      {
        userId: id,
      },
      {
        $set: {
          recoveryCode: code,
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
