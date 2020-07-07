import { RouterContext } from 'https://deno.land/x/oak/mod.ts';

export interface Context extends RouterContext {
  id?: string;
};

export interface QueryParams {
  limit?: number|string;
  page?: number|string;
};

export interface Pagination extends QueryParams {
  offset?: number;
};

export interface Response {
  data?: any;
  datetime: number;
  info: string;
  misc: string;
  request: string;
  status: number;
};

export interface Template {
  template: string;
  topic: string;
};

export interface TokenPair {
  access: string;
  refresh: string;
};
