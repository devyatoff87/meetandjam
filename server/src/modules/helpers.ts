import { AppDataSource } from "../db/data-source";
import { User } from "../db/entities/user.entity";
import { Event } from "../db/entities/event.entity";
import { ROLES } from "../types/roles";
import { FastifyReply } from "fastify";
import { ZodType } from "zod";
import { allEventsSchema } from "./events/events.schemas";

export const sendBusinessError = (
  reply: FastifyReply,
  status: number,
  message: string,
) => {
  return reply.code(status).send({ message });
};

export const sendValidationError = (reply: FastifyReply, error: any) => {
  return reply.code(400).send({
    message: "Validation error",
    errors: error.issues.map((issue: any) => ({
      path: issue.path.join("."),
      message: issue.message,
    })),
  });
};

export const checkAdminship = async (userId: string): Promise<boolean> => {
  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.findOne({
    where: { id: userId },
    select: ["role"],
  });

  return user?.role === ROLES.ADMIN;
};

export const checkEventOwnership = async (eventId: string, userId: string) => {
  const eventRepository = AppDataSource.getRepository(Event);
  const event = await eventRepository.findOne({
    where: { id: eventId },
  });

  if (!event) {
    return { event: null, isOwner: false, isAdmin: false };
  }

  const isOwner = event.ownerId === userId;

  let isAdmin = false;

  if (!isOwner) {
    isAdmin = await checkAdminship(userId);
  }

  return { event, isOwner, isAdmin };
};

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

export const validateEventsQueries = (
  query: { page: string; limit: string; search: string },
  reply: FastifyReply,
) => {
  const { page = 1, limit = 10, search = "" } = query;

  return validateZ(allEventsSchema, { page, limit, search }, reply);
};
