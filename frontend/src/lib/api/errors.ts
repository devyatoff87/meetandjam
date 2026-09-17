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
  | "VALIDATION_ERROR"
  | "INVALID_JSON"
  | "INTERNAL_ERROR"
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
  if (!body || typeof body !== "object") {
    return new ApiError(httpStatus, "UNKNOWN", `HTTP ${httpStatus}`);
  }

  const b = body as Record<string, unknown>;

  return new ApiError(
    typeof b.statusCode === "number" ? b.statusCode : httpStatus,
    typeof b.code === "string" ? b.code : "UNKNOWN",
    typeof b.message === "string" ? b.message : `HTTP ${httpStatus}`,
    b.details,
  );
}
