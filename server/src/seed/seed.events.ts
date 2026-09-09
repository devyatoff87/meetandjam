import { AppDataSource } from "../db/data-source";
import { Event } from "../db/entities/event.entity";
import { mockEvents } from "./mock/events";

export async function seedEvents() {
  const eventRepository = AppDataSource.getRepository(Event);

  for (const eventData of mockEvents) {
    const exists = await eventRepository.findOne({
      where: {
        title: eventData.title,
        startsAt: new Date(eventData.startsAt),
      },
    });

    if (!exists) {
      await eventRepository.save(eventData);
    }
  }
}
