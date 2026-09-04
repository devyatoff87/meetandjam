import { FastifyReply, FastifyRequest } from "fastify";
import { AppDataSource } from "../db/data-source";
import { User } from "../db/entities/user.entity";
import { Event } from "../db/entities/event.entity";
import { Role, ROLES } from "../types/roles";

type SendError = (
  reply: any,
  code: number,
  message: string,
  errors?: any,
) => void;

export const sendError: SendError = (reply, code, message, errors) => {
  const response: any = { message };
  if (errors) {
    response.errors = errors.issues.map((issue: any) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  }
  reply.code(code).send(response);
};

export const checkAdminship = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<boolean> => {
  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.findOne({
    where: { id: request.user.sub },
  });

  if (!user || user.role !== ROLES.ADMIN) {
    sendError(reply, 403, "Forbidden: Admin access required");
    return false;
  }

  return true;
};

export const checkEventOwnership = async (
  eventId: string,
  userId: string,
  reply: FastifyReply,
): Promise<Event | null> => {
  const eventRepository = AppDataSource.getRepository(Event);

  const event = await eventRepository.findOne({
    where: { id: eventId },
  });

  if (!event) {
    sendError(reply, 404, "Event not found");
    return null;
  }

  if (event.ownerId !== userId) {
    sendError(reply, 403, "Forbidden: You are not the owner of this event");
    return null;
  }

  return event;
};
