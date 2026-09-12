import { FastifyReply } from "fastify";
import { ZodError } from "zod";

export const sendValidationError = (reply: FastifyReply, error: ZodError) => {
  return reply.code(400).send({
    status: 400,
    code: "VALIDATION_ERROR",
    message: "Validation error",
    errors: error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    })),
  });
};

export const sendBusinessError = (
  reply: FastifyReply,
  status: number,
  message: string,
  code?: string,
) => {
  return reply.code(status).send({
    status,
    code: code || "UNKNOWN_ERROR",
    message,
  });
};
