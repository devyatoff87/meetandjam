import { AppDataSource } from "../../db/data-source";
import { Event } from "../../db/entities/event.entity";
import { EventParticipant } from "../../db/entities/participant.entity";
import { checkAdminship, checkEventOwnership, errorTrigger } from "../helpers";

export class EventsService {
  private eventRepository = AppDataSource.getRepository(Event);
  private participantRepository = AppDataSource.getRepository(EventParticipant);

  async create(data: any, ownerId: string) {
    const event = this.eventRepository.create({
      ...data,
      ownerId,
    });
    return await this.eventRepository.save(event);
  }

  async findAll() {
    return await this.eventRepository.find({
      order: { startsAt: "ASC" },
    });
  }

  async findOne(id: string, userId: string) {
    const { event, isOwner, isAdmin } = await checkEventOwnership(id, userId);

    errorTrigger(!event, "Event not found", 404);
    errorTrigger(
      !isOwner && !isAdmin,
      "You don't have access for the action",
      403,
    );

    return event;
  }

  async update(id: string, userId: string, data: any) {
    const { event, isOwner, isAdmin } = await checkEventOwnership(id, userId);

    errorTrigger(!event, "Event not found", 404);
    errorTrigger(
      !isOwner && !isAdmin,
      "You don't have access for the action",
      403,
    );

    return await this.eventRepository.save({
      ...event,
      ...data,
    });
  }

  async delete(id: string, userId: string) {
    const { event, isOwner, isAdmin } = await checkEventOwnership(id, userId);

    errorTrigger(
      !isOwner && !isAdmin,
      "You don't have access to the action.",
      403,
    );

    errorTrigger(!event, "Event not found", 404);

    event && (await this.eventRepository.remove(event));
  }

  async deleteAll(userId: string) {
    const isAdmin = await checkAdminship(userId);

    errorTrigger(!isAdmin, "Admin access required", 403);

    await this.eventRepository
      .createQueryBuilder()
      .delete()
      .from(Event)
      .execute();
  }

  async joinEvent(eventId: string, userId: string): Promise<EventParticipant> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    errorTrigger(!event, "Event not found", 404);

    const joinedToEvent = await this.participantRepository.findOne({
      where: { eventId, userId },
    });
    errorTrigger(!joinedToEvent, "You have already joined this event", 409);

    return await this.participantRepository.save({
      eventId,
      userId,
    });
  }
}
