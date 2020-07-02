import { RouterContext } from 'https://deno.land/x/oak@v5.3.1/mod.ts';

const decoder = new TextDecoder();

/**
 * Parse the request body recursively
 * @param {string} string - string to parse
 * @param {string[]} keys - keys array
 * @returns {object}
 */
const parseRecursively = (string: string, keys: string[]): object => {
  // find the positions of the keys and sort them
  const keysPositions: number[] = keys.map((key: string) => string.indexOf(key));
  const keysWithValues: number[] = keysPositions.filter((position: number) => position >= 0);
  const sortedPositions: number[] = keysWithValues.sort((a: number, b: number) => a - b);

  /**
   * Actual loop
   * @param {string} string - string to parse
   * @param {string[]} keys - keys array
   * @param {number} index - current key index
   * @param  {object} result - result object
   * @returns {object}
   */
  const loop = (
    string: string,
    keys: string[],
    index: number,
    result: object,
  ): object => {
    if (index === keys.length) {
      return result;
    }
    const object: any = { ...result };
  
    // check if the key is there
    const key: string = keys[index];
    if (!string.includes(key)) {
      object[key] = '';
      return loop(string, keys, index + 1, object);
    }
  
    const keyPosition: number = string.indexOf(key);
    const valuePosition: number = keyPosition + key.length + 1;

    // get the position of the next key
    const [nextPosition] = sortedPositions.filter((position: number) => position > valuePosition);

    // get the value
    const value: string = string.slice(valuePosition, nextPosition && nextPosition - 1);
    object[key] = value;
    return loop(string, keys, index + 1, object);
  };

  return loop(string, keys, 0, {});
}

/**
 * Parse the request body
 * @param {RouterContext} ctx - context
 * @returns {Promise<*>}
 */
export default async (ctx: RouterContext, fields: string[]) => {
  try {
    // return the empty object if no fields are specified
    if (fields.length === 0) {
      return {};
    }

    // leave only unique fields
    const unique = [...new Set(fields)];

    // get the body text string
    const buffer = new Uint8Array(1024);
    const reader = await ctx.request.body({ asReader: true });
    const numBytesRead = await reader.value.read(buffer) || 0;
    const bodyText = decoder.decode(buffer.subarray(0, numBytesRead));

    // decode the URI
    const decoded = decodeURIComponent(bodyText);

    // check if this is a JSON string
    try {
      return JSON.parse(decoded);
    } catch {
      return parseRecursively(decoded, unique);
    }
  } catch (error) {
    throw error;
  }
};
