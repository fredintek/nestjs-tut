export interface Paginated<T> {
  data: T[];
  metadata: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };
  pagination: {
    firstPage: number;
    prevPage: boolean;
    nextPage: boolean;
    lastPage: number;
    currentPage: number;
  };
}
