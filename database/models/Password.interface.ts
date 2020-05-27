import { Generic } from './Generic.interface.ts';

export interface Password extends Generic {
  hash: string;
  userId: string;
};
