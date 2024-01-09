export type QueryOptions = {
  sort?: any;
  filters?: any;
  populate?: any;
  fields?: any;
  pagination?: {
    pageSize: number;
    page: number;
  };
};

export type DataResponseFromBackend = {
  total?: number;
  responseStatus?: number;
  success: boolean;
  data: any;
  meta: any;
};
