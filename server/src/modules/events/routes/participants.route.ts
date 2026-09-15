import { FastifyPluginAsync } from "fastify";
import {
  eventIdSchema,
  uuidSchema,
} from "../events.schemas";
import { EventsService } from "../events.services";
import { sendBusinessError } from "../../helpers/errors";
import z from "zod";

export const participantsRoute: FastifyPluginAsync = async (app) => {
  const eventsService = new EventsService();
  app.get<{ Params: z.infer<typeof eventIdSchema> }>(
    "/:id/participants",
    {
      schema: {
        params: uuidSchema,
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;

      try {
        const participants = await eventsService.findParticipants(eventId);
        reply.code(200).send(participants);
      } catch (error: any) {
        return sendBusinessError(
          reply,
          error.status || 500,
          error.message,
          error.code,
        );
      }
    },
  );
};
