import { Generic } from './Generic.interface.ts';

export interface Password extends Generic {
  userId: string;
  hash: string;
  recoveryCode: string|null;
};
