import { RouterContext, Status } from 'https://deno.land/x/oak/mod.ts';

import { internalServerError } from './templates.ts';
import log from './log.ts';
import mailer from './mailer.ts';
import { Response } from './types.ts';
import { MAILER_FROM, SEND_ERROR_MESSAGES, SERVER_MESSAGES } from '../config/index.ts';

/**
 * Send response to the frontend
 * @param {RouterContext} ctx - context
 * @param {number} status - response status
 * @param {string} info - response info
 * @param {*} data - data object (optional)
 * @param {string} misc - additional information (optional)
 * @returns {void} 
 */
export default function (
  ctx: RouterContext,
  status: number = Status.OK,
  info: string = SERVER_MESSAGES.ok,
  data: any = null,
  misc: string = SERVER_MESSAGES.noAdditionalInformation,
): void {
  // create the response
  const response: Response = {
    datetime: Date.now(),
    info,
    misc,
    request: `${ctx.request.url} [${ctx.request.method}]`,
    status,
  };
  if (data) {
    if (info !== SERVER_MESSAGES.internalServerError) {
      response.data = data;
    } else {
      if (SEND_ERROR_MESSAGES) {
        const { template, topic } = internalServerError(data);
        mailer(MAILER_FROM, template, topic);
      }
      log(`-- INTERNAL SERVER ERROR: ${data}`, null, true);
    }
  }

  // send response
  ctx.response.status = status;
  ctx.response.body = response;
  return ctx.response.body;
};
