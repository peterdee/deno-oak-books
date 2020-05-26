export interface Generic<T> {
  _id: {
    $oid: string;
  };
  entity: T;
  created: string;
  updated: string;
};
