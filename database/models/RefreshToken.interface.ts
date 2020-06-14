import { Generic } from './Generic.interface.ts';

export interface RefreshToken extends Generic {
  token: string;
  userId: string;
};
