export interface Password {
  _id: {
    $oid: string;
  };
  entity: 'Password';
  created: string;
  hash: string;
  userId: string;
  updated: string;
};
