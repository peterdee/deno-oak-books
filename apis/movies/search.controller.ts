import { helpers, RouterContext, Status } from 'https://deno.land/x/oak/mod.ts';

import formatPagination from '../../utilities/format-pagination.ts';
import response, { Response } from '../../utilities/response.ts';
import sanitize from '../../utilities/sanitize.ts';
import { SERVER_MESSAGES } from '../../config/index.ts';
import tmdb from '../../utilities/tmdb.ts';

/**
 * Search movies by name
 * @param {RouterContext} ctx - context
 * @returns {Promise<Response|*>}
 */
export default async function (ctx: RouterContext): Promise<Response|any> {
  try {
    // check query params
    const { page = '', query = '' } = helpers.getQuery(ctx);
    const trimmedPage = Number(sanitize(page.trim().toLowerCase())) || 1;
    const trimmedQuery = sanitize(query.trim().toLowerCase());
    if (!trimmedQuery) {
      return response(ctx, Status.BadRequest, SERVER_MESSAGES.missingData);
    }

    // search TMDB
    const raw = await tmdb.search(trimmedQuery, trimmedPage);
    const {
      page: current = 1,
      total_pages: total = 0,
      results = [],
    } = await raw.json();

    return response(
      ctx,
      Status.OK,
      SERVER_MESSAGES.ok,
      {
        pagination: formatPagination(20, current, total),
        results,
      },
    );
  } catch (error) {
    return response(
      ctx,
      Status.InternalServerError,
      SERVER_MESSAGES.internalServerError,
      error,
    );
  }
};
