export type ApiResponse<T> = {
  ok: boolean;
  requestId: string;
  data?: T;
  error?: string;
};

