import { FastifyPlugin, FastifyPluginAsync } from "fastify";
import { AppDataSource } from "../../db/data-source";
import { Event } from "../../db/entities/event.entity";
import { EventParticipant } from "../../db/entities/participant.entity";
import { createEventSchema } from "./events.schemas";
import { sendError } from "../helpers";

export const eventsRoutes: FastifyPluginAsync = async (app) => {
  const eventRepository = AppDataSource.getRepository(Event);
  const participantRepository = AppDataSource.getRepository(EventParticipant);

  //CREATE POST
  app.post(
    "/",
    {
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const parseBody = createEventSchema.safeParse(request.body);

      if (!parseBody.success)
        return sendError(reply, 400, "Validation error", parseBody.error);

      const {
        title,
        description,
        contactInfo,
        maxParticipants,
        address,
        startsAt,
        entryPrice,
        isDonationBased,
        donationInfo,
      } = parseBody.data;

      const event = eventRepository.create({
        title,
        description,
        maxParticipants,
        address,
        startsAt,
        contactInfo,
        entryPrice,
        ownerId: request.user.sub,
        isDonationBased,
        donationInfo,
      });

      const saveEvent = await eventRepository.save(event);
      return reply.code(201).send(saveEvent);
    },
  );

  //GET ALL EVENTS
  app.get("/", async () => {
    return eventRepository.find({
      order: {
        startsAt: "ASC",
      },
    });
  });

  app.delete("/all", async (request, reply) => {
    await eventRepository.createQueryBuilder().delete().from(Event).execute();

    return reply.code(200).send({ message: "All events deleted" });
  });
};
