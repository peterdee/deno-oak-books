import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { User } from '../../database/index.ts';

export interface Context extends RouterContext {
  id?: string;
  user?: User; 
};

export interface FollowData {
  id?: string;
};

export interface FollowerData {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
};
