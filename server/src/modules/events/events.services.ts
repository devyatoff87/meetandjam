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

  async findAll(limit: number, page: number, search: string = "") {
    const skip = (page - 1) * limit;

    const query = this.eventRepository.createQueryBuilder("event");

    if (search) {
      query.andWhere(
        "event.title ILIKE :search OR event.description ILIKE :search OR event.address ILIKE :search",
        { search: `%${search}%` },
      );
    }

    const [events, total] = await query
      .orderBy("event.startsAt", "ASC")
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      events,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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

    errorTrigger(!event, "Event not found", 404);
    errorTrigger(
      !isOwner && !isAdmin,
      "You don't have access to the action.",
      403,
    );

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

  async joinEvent(
    eventId: string,
    userId: string,
    operation: "join" | "leave",
  ): Promise<EventParticipant | { message: string }> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    errorTrigger(!event, "Event not found", 404);

    const joinedToEvent = await this.participantRepository.findOne({
      where: { eventId, userId },
    });

    if (operation === "join") {
      errorTrigger(!!joinedToEvent, "You have already joined this event", 409);

      return await this.participantRepository.save({
        eventId,
        userId,
      });
    }

    // leave
    errorTrigger(!joinedToEvent, "You haven't joined this event before", 409);

    await this.participantRepository.delete({
      eventId,
      userId,
    });

    return { message: "Successfully left the event" };
  }
  async getAllByUser(userId: string): Promise<Event[]> {
    const events = await this.eventRepository.find({
      where: {
        ownerId: userId,
      },
    });
    errorTrigger(!events, "This user have not created any events yet", 404);

    return events;
  }

  async findEventParticipants(eventId: string) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw { status: 404, message: "Event not found" };
    }

    const participants = await this.participantRepository.find({
      where: { eventId },
      relations: ["user"],
    });
    return participants.map((p) => ({
      id: p.user.id,
      name: p.user.name,
      email: p.user.email,
      joinedAt: p.joinedAt,
    }));
  }

  async findParticipations(userId: string) {
    const participations = await this.participantRepository.find({
      where: { userId },
      relations: ["event"],
      order: { joinedAt: "DESC" },
    });
    return participations.map((p) => p.event);
  }
}
