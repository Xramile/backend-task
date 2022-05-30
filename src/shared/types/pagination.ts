export interface PaginationInterface {
  count: number;
  total: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
  has: {
    next: boolean;
    prev: boolean;
  };
}
