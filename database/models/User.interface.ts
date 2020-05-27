import { Generic } from './Generic.interface.ts';

export interface User extends Generic {
  email: string;
  firstName: string;
  lastName: string;
};
