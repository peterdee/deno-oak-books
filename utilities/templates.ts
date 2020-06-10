import destr from 'https://deno.land/x/destr/src/index.ts';

import { ENV } from '../config/index.ts';
import { InternalErrorTemplate } from './types.ts';

/**
 * Create a template for the internal server error
 * @param {Error} error - error object
 * @returns {InternalErrorTemplate}
 */
export const internalServerError = (error: Error): InternalErrorTemplate => ({
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
