import "reflect-metadata";
import { AppDataSource } from "../db/data-source";
import { seedEvents } from "./seed.events";
import { seedUsers } from "./seed.users";
import { seedParticipants } from "./seed.participants";

const args = process.argv.slice(2);
const shouldSeedEvents = args.includes("--events") || args.length === 0;
const shouldSeedUsers = args.includes("--users") || args.length === 0;
const shouldSeedParticipants =
  args.includes("--participants") || args.length === 0;
const shouldClear = args.includes("--clear");

async function run() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected");

    if (shouldClear) {
      console.log("Clearing all data...");
      await AppDataSource.query(
        'TRUNCATE TABLE "event_participants", "event_tags", "events", "user" CASCADE',
      );
    }

    if (shouldSeedUsers) await seedUsers();
    if (shouldSeedEvents) await seedEvents();
    if (shouldSeedParticipants) await seedParticipants();

    console.log("Seeding complete");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

run();
