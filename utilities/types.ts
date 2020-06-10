export interface InternalErrorTemplate {
  template: string;
  topic: string;
};


export interface Response {
  data?: any;
  datetime: number;
  info: string;
  misc: string;
  request: string;
  status: number;
};

export interface TokenPair {
  access: string;
  refresh: string;
};
