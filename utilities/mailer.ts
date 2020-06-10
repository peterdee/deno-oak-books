import { sendMail } from 'https://deno.land/x/sendgrid/mod.ts';

import log from './log.ts';
import { MAILER_FROM, SENDGRID_KEY } from '../config/index.ts';

/**
 * Send an email via SendGrid
 * @param {string} destination - destination email address
 * @param {string} message - message to send (HTML)
 * @param {string} topic - topic of the message
 * @returns {Promise<void>}
 */
export default async function (
  destination: string,
  message: string,
  topic: string,
): Promise<void> {
  try {
    const response = await sendMail(
      {
        personalizations: [{
          subject: topic,
          to: [{ email: destination }],
        }],
        content: [{
          type: 'text/html',
          value: message,
        }],
        from: { email: MAILER_FROM },
      },
      {
        apiKey: SENDGRID_KEY,
      },
    );

    // check the response
    if (!(response && response.success)) {
      throw response;
    }

    return log(`-- MAILER: sent mail to ${destination}`);
  } catch (error) {
    return log(`-- MAILER: ERROR!\n${JSON.stringify(error)}`, null, true);
  }
}
