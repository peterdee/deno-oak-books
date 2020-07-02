import { RouterContext, Status } from 'https://deno.land/x/oak@v5.3.1/mod.ts';

import bodyParser from '../../utilities/body-parser.ts';
import database, { collections, generateId } from '../../database/index.ts';
import { LoginData } from './types.ts';
import response from '../../utilities/response.ts';
import sanitize from '../../utilities/sanitize.ts';
import { SERVER_MESSAGES } from '../../config/index.ts';
import tmdb from '../../utilities/tmdb.ts';

/**
 * Search movies by name
 * @param {RouterContext} ctx - context
 * @returns {Promise<any>}
 */
export default async function (ctx: RouterContext): Promise<any> {
  try {
    const raw = await tmdb.search('dragons');
    const data = await raw.json();

    return response(ctx, Status.OK, SERVER_MESSAGES.ok, data);
  } catch (error) {
    return response(
      ctx,
      Status.InternalServerError,
      SERVER_MESSAGES.internalServerError,
      error,
    );
  }
};
