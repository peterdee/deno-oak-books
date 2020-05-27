import { makeJwt, setExpiration } from 'https://deno.land/x/djwt/create.ts';

import { TokenHeader, TokenPayload, Tokens } from './types.ts';
import { TOKENS } from '../config/index.ts';

class TokenData {
  public header: TokenHeader;
  public key: string;
  public payload: TokenPayload;

  constructor(id: number|string, expiration: number, secret: string) {
    this.header = {
      alg: 'HS256',
      typ: 'JWT',
    };
    this.key = secret;
    this.payload = {
      exp: setExpiration(Date.now() + (expiration * 1000)),
      iss: id,
    };
  }
}

/**
 * Generate tokens
 * @param {number|string} id - User ID
 * @returns {Tokens} 
 */
export default function (id: number|string): Tokens {
  return {
    access: makeJwt(new TokenData(id, TOKENS.access.expiration, TOKENS.access.secret)),
    refresh: makeJwt(new TokenData(id, TOKENS.refresh.expiration, TOKENS.refresh.secret)),
  };
}
