import { Generic } from './Generic.interface.ts';

export interface Follower extends Generic {
  userId: string;
  followedId: string;
};
