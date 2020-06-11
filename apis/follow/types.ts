
import { RouterContext } from 'https://deno.land/x/oak/mod.ts';

export interface Context extends RouterContext {
  id?: string;
};

export interface FollowData {
  id?: string;
};
