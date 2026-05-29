export type TApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
};

export type TDashboardStats = Record<string, unknown>;
