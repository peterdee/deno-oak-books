export interface Response {
  data?: any;
  datetime: number;
  info: string;
  misc: string;
  request: string;
  status: number;
};

export interface TokenHeader {
  alg: string;
  typ: string;
};

export interface TokenPayload {
  exp: number|string;
  iss: number|string;
};

export interface Tokens {
  access: string;
  refresh: string;
};
