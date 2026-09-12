import { FastifyReply } from "fastify";
import { ZodType } from "zod";
import { sendValidationError } from "./errors";
import { allEventsSchema } from "../events/events.schemas";

export const validateZ = <T>(
  schema: ZodType<T>,
  data: unknown,
  reply: FastifyReply,
): T | null => {
  console.log(data);
  const result = schema.safeParse(data);

  if (!result.success) {
    sendValidationError(reply, result.error);
    return null;
  }

  return result.data;
};

export const validateEventsQueries = (data: unknown, reply: FastifyReply) => {
  return validateZ(allEventsSchema, data, reply);
};
