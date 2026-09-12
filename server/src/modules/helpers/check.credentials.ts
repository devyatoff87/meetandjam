import { AppDataSource } from "../../db/data-source";
import { User } from "../../db/entities/user.entity";
import { Event } from "../../db/entities/event.entity";
import { ROLES } from "../../types/roles";

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
