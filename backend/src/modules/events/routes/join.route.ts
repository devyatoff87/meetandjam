import { FastifyPluginAsync } from "fastify";
import { joinEventSchema, joinResponseSchema } from "../events.schemas";
import { EventsService } from "../events.services";
import { sendBusinessError } from "../../../helpers/errors";
import z from "zod";

export const joinEventRoute: FastifyPluginAsync = async (app) => {
  const eventsService = new EventsService();
  app.post<{ Body: z.infer<typeof joinEventSchema> }>(
    "/join",
    {
      preHandler: [app.authenticate],
      schema: {
        body: joinEventSchema,
        response: { 201: joinResponseSchema },
      },
    },
    async (request, reply) => {
      const { eventId, note } = request.body;
      const userId = request.user.sub;

      try {
        const participant = await eventsService.joinEvent(
          eventId,
          userId,
          "join",
          note,
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
