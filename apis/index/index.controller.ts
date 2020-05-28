import response from '../../utilities/response.ts';

/**
 * Handle the index route
 * @param {Context} ctx - Oak Context
 * @returns {void}
 */
export default function (ctx: any): void {
  return response(ctx);
};
