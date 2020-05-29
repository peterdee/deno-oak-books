import { green, red } from 'https://deno.land/std@0.53.0/fmt/colors.ts';

import { ENV, ENVS } from '../config/index.ts';

/**
 * Log the text and data
 * @param {string} text - text to show
 * @param {*} data - additional value to show
 * @param {boolean} isError - display the message in a different color
 * @returns {void}
 */
export default function (text: string = '', data: any = null, isError: boolean = false): void {
  const color = isError ? red : green;
  if (ENV === ENVS.dev) {
    return console.log(color(`${text} ${data || ''}`));
  }
}
