import { AppDataSource } from "../../db/data-source";
import { Event } from "../../db/entities/event.entity";
import { checkAdminship, checkEventOwnership } from "../helpers";

export class EventsService {
  private eventRepository = AppDataSource.getRepository(Event);

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
    if (!event) {
      throw new Error("Event not found");
    }
    if (!isOwner && !isAdmin) {
      throw new Error("Forbidden");
    }
    return event;
  }

  async update(id: string, userId: string, data: any) {
    const { event, isOwner, isAdmin } = await checkEventOwnership(id, userId);
    if (!event) {
      throw new Error("Event not found");
    }
    if (!isOwner && !isAdmin) {
      throw new Error("Forbidden");
    }
    return await this.eventRepository.save({
      ...event,
      ...data,
    });
  }

  async delete(id: string, userId: string) {
    const { event, isOwner, isAdmin } = await checkEventOwnership(id, userId);
    if (!event) {
      throw new Error("Event not found");
    }
    if (!isOwner && !isAdmin) {
      throw new Error("Forbidden");
    }
    await this.eventRepository.remove(event);
  }

  async deleteAll(userId: string) {
    const isAdmin = await checkAdminship(userId);
    if (!isAdmin) {
      throw new Error("Admin access required");
    }
    await this.eventRepository
      .createQueryBuilder()
      .delete()
      .from(Event)
      .execute();
  }
}
