import { AppDataSource } from "../db/data-source";
import { Event } from "../db/entities/event.entity";
import { Category } from "../db/entities/category.entity";
import { mockEvents } from "./mock/events";

export async function seedEvents() {
  const eventRepository = AppDataSource.getRepository(Event);
  const categoryRepository = AppDataSource.getRepository(Category);

  let count = 0;

  for (const eventData of mockEvents) {
    const { categorySlug, ...rest } = eventData;

    const category = await categoryRepository.findOne({
      where: { slug: categorySlug },
    });

    if (!category) {
      console.log(`Skipped (no category): ${eventData.title}`);
      continue;
    }

    const exists = await eventRepository.findOne({
      where: {
        title: eventData.title,
        startsAt: new Date(eventData.startsAt),
      },
    });

    if (!exists) {
      await eventRepository.save({
        ...rest,
        startsAt: new Date(rest.startsAt),
        categoryId: category.id,
      });
      count++;
    }
  }

  console.log(`Seeded ${count} events`);
}
