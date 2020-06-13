  /**
   * Generate a random alpha-numeric string
   * @param {number} length - string length (optional)
   * @return {string}
   */
export default (length: number = 16): string => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; i -= 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};
