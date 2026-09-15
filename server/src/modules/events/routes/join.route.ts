import { FastifyPluginAsync } from "fastify";
import { eventIdSchema, joinResponseSchema } from "../events.schemas";
import { EventsService } from "../events.services";
import { sendBusinessError } from "../../helpers/errors";
import z from "zod";

export const joinEventRoute: FastifyPluginAsync = async (app) => {
  const eventsService = new EventsService();
  app.post<{ Body: z.infer<typeof eventIdSchema> }>(
    "/join",
    {
      preHandler: [app.authenticate],
      schema: {
        body: eventIdSchema,
        response: { 201: joinResponseSchema },
      },
    },
    async (request, reply) => {
      const { eventId } = request.body;
      const userId = request.user.sub;

      try {
        const participant = await eventsService.joinEvent(
          eventId,
          userId,
          "join",
        );
        return reply.code(201).send(participant);
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
