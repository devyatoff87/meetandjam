import { FastifyPluginAsync } from "fastify";
import {
  eventResponseSchema,
  updateEventSchema,
  eventIdSchema,
} from "../events.schemas";
import { EventsService } from "../events.services";
import { sendBusinessError } from "../../helpers/errors";
import z from "zod";

export const updateEventRoute: FastifyPluginAsync = async (app) => {
  const eventsService = new EventsService();
  app.patch<{
    Params: z.infer<typeof eventIdSchema>;
    Body: z.infer<typeof updateEventSchema>;
  }>(
    "/:eventId",
    {
      preHandler: [app.authenticate],
      schema: {
        params: eventIdSchema,
        body: updateEventSchema,
        response: {
          200: eventResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;
      const data = request.body;

      try {
        const updated = await eventsService.update(
          eventId,
          request.user.sub,
          data,
        );
        return reply.send(updated);
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
