import { FastifyReply } from "fastify";
import { ZodError } from "zod";

export const sendValidationError = (reply: FastifyReply, error: ZodError) => {
  return reply.code(400).send({
    statusCode: 400,
    code: "VALIDATION_ERROR",
    message: "Validation error",
    details: error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    })),
  });
};
export const sendBusinessError = (
  reply: FastifyReply,
  statusCode: number,
  message: string,
  code?: string,
  details?: unknown,
) => {
  return reply.code(statusCode).send({
    statusCode,
    code: code || "UNKNOWN_ERROR",
    message,
    details: details ?? null,
  });
};
