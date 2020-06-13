import { Generic } from './Generic.interface.ts';

export interface UserEmail extends Generic {
  code: string;
  newEmail: string;
  oldEmail: string;
};
