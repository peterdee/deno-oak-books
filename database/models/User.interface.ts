export interface User {
  _id: {
    $oid: string;
  };
  entity: 'User';
  created: string;
  email: string;
  firstName: string;
  lastName: string;
  updated: string;
};
