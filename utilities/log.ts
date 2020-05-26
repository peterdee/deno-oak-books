import { green } from 'https://deno.land/std@0.53.0/fmt/colors.ts';

import { ENV, ENVS } from '../config/index.ts';

/**
 * Log the text and data
 * @param {string} text - text to show
 * @param {*} data - additional value to show
 * @returns {void}
 */
export default function (text: string = '', data: any = null): void {
  if (ENV === ENVS.dev) {
    return console.log(green(`${text} ${data || ''}`));
  }
}
