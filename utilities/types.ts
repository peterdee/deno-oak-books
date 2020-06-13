export interface Response {
  data?: any;
  datetime: number;
  info: string;
  misc: string;
  request: string;
  status: number;
};

export interface Template {
  template: string;
  topic: string;
};

export interface TokenPair {
  access: string;
  refresh: string;
};
