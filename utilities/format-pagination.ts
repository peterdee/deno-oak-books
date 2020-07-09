import { FormattedPagination } from './types.ts';

/**
 * Format pagination
 * @param {number} limit - limit value
 * @param {number} page - current page
 * @param {number} total - total results count
 * @returns {FormattedPagination}
 */
export default (
  limit = 10,
  page = 1,
  total = 0,
): FormattedPagination => ({
  currentPage: page,
  limit,
  totalPages: Math.ceil(total / limit),
});
