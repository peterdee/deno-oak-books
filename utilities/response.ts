import { Status } from 'https://deno.land/std/http/http_status.ts';

import { Response } from './types.ts';
import { SERVER_MESSAGES } from '../config/index.ts';

/**
 * Send response to the frontend
 * @param {Context} ctx - Oak Context
 * @param {number} status - response status
 * @param {string} info - response info
 * @param {*} data - data object (optional)
 * @param {string} misc - additional information (optional)
 * @returns {void} 
 */
export default function (
  ctx: any,
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
    request: `${ctx.originalUrl} [${ctx.method}]`,
    status,
  };
  if (data) {
    response.data = data;
  }

  // send response
  ctx.status = status;
  ctx.body = response;
  return ctx.body;
};
