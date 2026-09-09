import { AppDataSource } from "../db/data-source";
import { EventParticipant } from "../db/entities/participant.entity";
import { mockParticipants } from "./mock/participants";

export async function seedParticipants() {
  const participantRepository = AppDataSource.getRepository(EventParticipant);
  let count = 0;

  interface mockParticipant {
    eventId: string;
    userId: string;
  }

  for (const data of mockParticipants as mockParticipant[]) {
    const exists = await participantRepository.findOne({
      where: {
        eventId: data.eventId,
        userId: data.userId,
      } as mockParticipant,
    });

    if (!exists) {
      await participantRepository.save(data);
      count++;
    }
  }
}
