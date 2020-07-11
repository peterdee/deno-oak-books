import { RouterContext, Status } from 'https://deno.land/x/oak/mod.ts';

import response, { Response } from '../../utilities/response.ts';
import { SERVER_MESSAGES } from '../../config/index.ts';
import tmdb from '../../utilities/tmdb.ts';

/**
 * Get movie by ID
 * @param {RouterContext} ctx - context
 * @returns {Promise<Response|*>}
 */
export default async (ctx: RouterContext): Promise<Response|any> => {
  try {
    // check data
    const { params: { id = '' } = {} } = ctx;
    if (!id) {
      return response(ctx, Status.BadRequest, SERVER_MESSAGES.missingData);
    }

    // search TMDB
    const raw = await tmdb.movie(id);
    const result = await raw.json();

    // check result
    if (result.status_code && result.status_code === 34) {
      return response(ctx, Status.NotFound, SERVER_MESSAGES.movieNotFound);
    }

    return response(ctx, Status.OK, SERVER_MESSAGES.ok, result);
  } catch (error) {
    return response(
      ctx,
      Status.InternalServerError,
      SERVER_MESSAGES.internalServerError,
      error,
    );
  }
};
