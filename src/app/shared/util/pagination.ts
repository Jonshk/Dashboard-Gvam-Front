export interface Pagination {
  pageSize: number;
  currentPage: number;
}

export const NO_PAGINATION: Pagination = {
  pageSize: -1,
  currentPage: -1,
};

export const DEFAULT_PAGE_SIZE = 20;
export const INITIAL_PAGE = 1;

export const DEFAULT_PAGINATION: Pagination = {
  pageSize: DEFAULT_PAGE_SIZE,
  currentPage: INITIAL_PAGE,
};

export function getPaginationParams(pagination: Pagination) {
  return {
    page: pagination.currentPage,
    size: pagination.pageSize,
  };
}
