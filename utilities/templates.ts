import destr from 'https://deno.land/x/destr/src/index.ts';

import { ENV } from '../config/index.ts';
import { Template } from './types.ts';

/**
 * Create a template for the password recovery
 * @param {string} firstName - user's first name
 * @param {string} lastName - user's last name
 * @param {string} link - recovery link
 * @returns {Template}
 */
export const createPasswordRecoveryTemplate = (
  firstName: string = '',
  lastName: string = '',
  link: string = '',
): Template => ({
  template: `
<h1>Password recovery</h1>
<br>
<div>Hey ${firstName} ${lastName}!</div>
<div>Please click the link below to change your password:</div>
<br>
<div><a href="${link}">${link}</a></div>
  `,
  topic: `Password recovery`
});

/**
 * Create a template for the internal server error
 * @param {Error} error - error object
 * @returns {Template}
 */
export const internalServerError = (error: Error): Template => ({
  template: `
<h1>INTERNAL SERVER ERROR!</h1>
<br>
<br>
<div>This is an internal error</div>
<div>Happened on ${new Date()} (${Date.now()})</div>
<br>
<br>
<div>Full error text:</div>
<div>${destr(error)}</div>
  `,
  topic: `DENO-OAK-BOOKS: INTERNAL SERVER ERROR [${ENV.toUpperCase()}]`
});
