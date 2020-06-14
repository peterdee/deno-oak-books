import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { User } from '../../database/index.ts';

export interface Context extends RouterContext {
  id?: string;
  user?: User; 
};

export interface PasswordData {
  newPassword?: string;
  oldPassword?: string;
};
