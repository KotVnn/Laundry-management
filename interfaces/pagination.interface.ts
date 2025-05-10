export interface IPagination {
  page_index: number;
  page_size: number;
  page_total: number;
  total: number;
}

export interface IMetaPagination {
  meta: IPagination;
  data: any;
}

export interface IQueryString {
  page_index: number;
  page_size: number;
  from: string;
  to: string;
  sort: string;
  phone?: string;
  status?: string;
}
