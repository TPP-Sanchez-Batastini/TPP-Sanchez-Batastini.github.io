
const { createHash } = require('crypto');

export const hash = (string) => {
  return createHash('sha256').update(string).digest('hex');
}