import { AppDataSource } from "../../db/data-source";
import { Event } from "../../db/entities/event.entity";
import { EventParticipant } from "../../db/entities/participant.entity";
import { checkAdminship, checkEventOwnership } from "../helpers";

const eventErros = {
  notFound: { status: 404, message: "Event not found" },
  accessDenied: {
    status: 403,
    message: "I don't have access for this operation",
  },
  conflict: {
    status: 409,
    message: "I don't have access for this operation",
  },
} as const;

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

  async findAll(options: { limit: number; page: number; search?: string }) {
    const { limit, page, search = "" } = options;

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

    if (!event) throw eventErros.notFound;
    if (!isOwner && !isAdmin) throw eventErros.accessDenied;

    return event;
  }

  async update(id: string, userId: string, data: any) {
    const { event, isOwner } = await checkEventOwnership(id, userId);

    if (!event) throw eventErros.notFound;
    if (!isOwner) throw eventErros.accessDenied;

    return await this.eventRepository.save({
      ...event,
      ...data,
    });
  }

  async deleteAll(userId: string) {
    const isAdmin = await checkAdminship(userId);

    if (!isAdmin) throw eventErros.accessDenied;

    await this.eventRepository
      .createQueryBuilder()
      .delete()
      .from(Event)
      .execute();
  }

  async delete(id: string, userId: string) {
    const { event, isOwner, isAdmin } = await checkEventOwnership(id, userId);

    if (!event) throw eventErros.notFound;
    if (!isOwner && !isAdmin) throw eventErros.accessDenied;

    event && (await this.eventRepository.remove(event));
  }

  async joinEvent(
    eventId: string,
    userId: string,
    operation: "join" | "leave",
  ): Promise<EventParticipant | { message: string }> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) throw eventErros.notFound;

    const joinedToEvent = await this.participantRepository.findOne({
      where: { eventId, userId },
    });

    if (operation === "join") {
      if (!!joinedToEvent)
        throw { status: 409, message: "You have already joined the event." };

      return await this.participantRepository.save({
        eventId,
        userId,
      });
    }

    // leave
    if (!joinedToEvent)
      throw { status: 409, message: "You haven't joined this event before" };

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
    if (events.length === 0) {
      return [];
    }

    return events;
  }

  async findParticipants(eventId: string) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw eventErros.notFound;
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
