import { Generic } from './Generic.interface.ts';

export interface User extends Generic<'User'> {
  email: string;
  firstName: string;
  lastName: string;
};
