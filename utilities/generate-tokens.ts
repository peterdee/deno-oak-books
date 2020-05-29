import {
  Jose,
  JwtInput,
  makeJwt,
  Payload,
  setExpiration,
} from 'https://deno.land/x/djwt/create.ts';

import { TokenPair } from './types.ts';
import { TOKENS } from '../config/index.ts';

/**
 * Create a token object for the JWT module
 * @param {string} id - User ID
 * @param {number} expiration - token expiration
 * @param {string} secret - token secret
 * @returns {JwtInput}
 */
const token = (id: string, expiration: number, secret: string): JwtInput => {
  const header: Jose = {
    alg: 'HS256' as const,
    typ: 'JWT',
  };
  const payload: Payload = {
    exp: setExpiration(Date.now() + (expiration * 1000)),
    iss: id,
  };

  return {
    header,
    key: secret,
    payload,
  };
};


/**
 * Generate tokens
 * @param {string} id - User ID
 * @returns {Tokens} 
 */
export default function (id: string): TokenPair {
  return {
    access: makeJwt(token(id, TOKENS.access.expiration, TOKENS.access.secret)),
    refresh: makeJwt(token(id, TOKENS.refresh.expiration, TOKENS.refresh.secret)),
  };
}
