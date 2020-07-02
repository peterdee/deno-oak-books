import { RouterContext } from 'https://deno.land/x/oak@v5.3.1/mod.ts';

export interface Context extends RouterContext {
  id?: string;
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
