export interface IErrorSource {
  path: string;
  message: string;
}

export interface IErrorResponse {
  success: false;
  message: string;
  errorSources?: IErrorSource[];
  stack?: string | null;
}
