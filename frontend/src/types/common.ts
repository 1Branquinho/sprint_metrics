export type Page<T> = {
  items: T[];
  total: number;
  limit: number;
  offset: number;
};

export type ApiError = {
  status: number;
  message: string;
};
