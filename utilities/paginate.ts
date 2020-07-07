import { helpers } from 'https://deno.land/x/oak/mod.ts';

import { Pagination, QueryParams } from './types.ts';

export { Pagination };

/**
 * Get pagination
 * @param {Context|RouterContext} ctx - context
 * @returns {Pagination}
 */
export default (ctx: any): Pagination => {
  let { limit = '', page = '' }: QueryParams = helpers.getQuery(ctx);
  if (!limit || Number.isNaN(Number(limit))) limit = 15;
  if (!page || Number.isNaN(Number(page))) page = 1;
  return {
    limit: Number(limit),
    offset: (Number(page) - 1) * Number(limit),
    page: Number(page),
  };
};
