import {
  bold,
  cyan,
  green,
  magenta,
  red,
} from 'https://deno.land/std@0.53.0/fmt/colors.ts';

import log from '../utilities/log.ts';

/**
 * Logger middleware
 * @param {RouterContext} ctx - context
 * @param {*} next - call the next middleware
 * @returns {Promise<*>}
 */
export default async function (ctx: any, next: any): Promise<void> {
  await next();
  const responseTime = ctx.response.headers.get('X-Response-Time');
  const { response: { status = 200 } = {} } = ctx;
  let color = green;
  if (status >= 300) color = cyan;
  if (status >= 400) color = red;
  const fullPath = `${ctx.request.url.pathname}${ctx.request.url.search}`;
  const { method } = ctx.request;
  log(`${magenta(method)} ${fullPath} ${color(`${status}`)} - ${bold(`${responseTime}`)}`);
}
