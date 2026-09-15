export type ApiErrorCode =
  | "EMAIL_ALREADY_EXISTS"
  | "INVALID_CREDENTIALS"
  | "USER_NOT_FOUND"
  | "EVENT_NOT_FOUND"
  | "CATEGORY_NOT_FOUND"
  | "FORBIDDEN"
  | "ALREADY_JOINED"
  | "NOT_JOINED"
  | "UNAUTHORIZED"
  | "FST_ERR_VALIDATION"
  | "FST_ERR_CTP_INVALID_JSON_BODY"
  | "UNKNOWN";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: ApiErrorCode | string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function parseApiError(httpStatus: number, body: unknown): ApiError {
  throw new Error("Not implemented");
}
