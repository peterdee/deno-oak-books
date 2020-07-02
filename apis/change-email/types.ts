import { RouterContext } from 'https://deno.land/x/oak@v5.3.1/mod.ts';
import { User } from '../../database/index.ts';

export interface Context extends RouterContext {
  id?: string;
  user?: User; 
};

export interface ChangeEmailData {
  newEmail?: string;
};
