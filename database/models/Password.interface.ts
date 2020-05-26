import { Generic } from './Generic.interface.ts';

export interface Password extends Generic<'Password'> {
  hash: string;
  userId: string;
};
