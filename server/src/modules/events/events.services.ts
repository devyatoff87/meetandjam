import { AppDataSource } from "../../db/data-source";
import { Category } from "../../db/entities/category.entity";
import { Event } from "../../db/entities/event.entity";
import { EventParticipant } from "../../db/entities/participant.entity";
import { CategorySlug } from "../../types/categories";
import {
  checkAdminship,
  checkEventOwnership,
} from "../helpers/check.credentials";

const eventErrors = {
  eventNotFound: { status: 404, message: "Event not found" },
  categoryNotFound: { status: 404, message: "Category not found" },
  accessDenied: {
    status: 403,
    message: "You don't have access for this operation",
  },
  alreadyJoined: { status: 409, message: "You have already joined this event" },
  notJoined: { status: 409, message: "You haven't joined this event before" },
} as const;

export class EventsService {
  private eventRepository = AppDataSource.getRepository(Event);
  private participantRepository = AppDataSource.getRepository(EventParticipant);
  private categoryRepository = AppDataSource.getRepository(Category);

  async create(data: any, ownerId: string) {
    const { categorySlug, ...rest } = data;

    const category = await this.categoryRepository.findOne({
      where: { slug: categorySlug },
    });

    if (!category) {
      throw eventErrors.categoryNotFound;
    }

    const event = this.eventRepository.create({
      ...rest,
      categoryId: category.id,
      ownerId,
    });
    return await this.eventRepository.save(event);
  }

  async findAll(options: {
    limit: number;
    page: number;
    search?: string;
    category?: CategorySlug;
  }) {
    const { limit, page, search = "", category } = options;
    const skip = (page - 1) * limit;

    const query = this.eventRepository.createQueryBuilder("event");

    if (category) {
      query.leftJoin("event.category", "category");
      query.andWhere("category.slug = :category", { category });
    }

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

    return { events, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string, userId: string) {
    const { event, isOwner, isAdmin } = await checkEventOwnership(id, userId);

    if (!event) throw eventErrors.eventNotFound;
    if (!isOwner && !isAdmin) throw eventErrors.accessDenied;

    return event;
  }

  async update(id: string, userId: string, data: any) {
    const { event, isOwner } = await checkEventOwnership(id, userId);

    if (!event) throw eventErrors.eventNotFound;
    if (!isOwner) throw eventErrors.accessDenied;

    const { categorySlug, ...rest } = data;

    if (categorySlug) {
      const category = await this.categoryRepository.findOne({
        where: { slug: categorySlug },
      });

      if (!category) {
        throw eventErrors.categoryNotFound;
      }

      event.categoryId = category.id;
    }

    return await this.eventRepository.save({
      ...event,
      ...rest,
    });
  }

  async deleteAll(userId: string) {
    const isAdmin = await checkAdminship(userId);

    if (!isAdmin) throw eventErrors.accessDenied;

    await this.eventRepository
      .createQueryBuilder()
      .delete()
      .from(Event)
      .execute();
  }

  async delete(id: string, userId: string) {
    const { event, isOwner, isAdmin } = await checkEventOwnership(id, userId);

    if (!event) throw eventErrors.eventNotFound;
    if (!isOwner && !isAdmin) throw eventErrors.accessDenied;

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

    if (!event) throw eventErrors.eventNotFound;

    const joinedToEvent = await this.participantRepository.findOne({
      where: { eventId, userId },
    });

    if (operation === "join") {
      if (!!joinedToEvent) throw eventErrors.alreadyJoined;

      return await this.participantRepository.save({
        eventId,
        userId,
      });
    }

    // leave
    if (!joinedToEvent) throw eventErrors.notJoined;

    await this.participantRepository.delete({
      eventId,
      userId,
    });

    return { message: "Successfully left the event" };
  }

  async getAllByUser(
    userId: string,
    options: { page?: number; limit?: number; search?: string },
  ) {
    const { limit = 10, page = 1, search = "" } = options;
    const skip = (page - 1) * limit;

    const query = this.eventRepository
      .createQueryBuilder("event")
      .where("event.ownerId = :userId", { userId });

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

  async findParticipants(eventId: string) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw eventErrors.eventNotFound;
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
