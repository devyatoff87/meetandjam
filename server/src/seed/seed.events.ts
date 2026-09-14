import { AppDataSource } from "../db/data-source";
import { Event } from "../db/entities/event.entity";
import { Category } from "../db/entities/category.entity";
import { mockEvents } from "./mock/events";

import { User } from "../db/entities/user.entity";

export async function seedEvents() {
  const userRepository = AppDataSource.getRepository(User);
  const eventRepository = AppDataSource.getRepository(Event);
  const categoryRepository = AppDataSource.getRepository(Category);

  const users = await userRepository.find();

  if (users.length === 0) {
    throw new Error("No users found. Run `npm run seed -- --users` first.");
  }

  const categories = await categoryRepository.find();

  if (categories.length === 0) {
    throw new Error("No categories found. Seed categories first.");
  }

  const categoryMap = new Map(categories.map((c) => [c.slug, c.id]));

  let count = 0;

  for (const eventData of mockEvents) {
    const exists = await eventRepository.findOne({
      where: {
        title: eventData.title,
        startsAt: new Date(eventData.startsAt),
      },
    });

    if (exists) continue;

    const owner = users[Math.floor(Math.random() * users.length)];

    const categoryId = categoryMap.get(eventData.categorySlug);

    if (!categoryId) {
      console.warn(
        `Category "${eventData.categorySlug}" not found. Skipping.`,
      );
      continue;
    }

    await eventRepository.save({
      title: eventData.title,
      description: eventData.description,
      maxParticipants: eventData.maxParticipants,
      contactInfo: eventData.contactInfo,
      entryPrice: eventData.entryPrice,
      isDonationBased: eventData.isDonationBased,
      donationInfo: eventData.donationInfo,
      address: eventData.address,
      startsAt: new Date(eventData.startsAt),
      categoryId,
      ownerId: owner.id, // ✅ реальный ownerId
    });

    count++;
  }

  console.log(`✅ Seeded ${count} events`);
}
