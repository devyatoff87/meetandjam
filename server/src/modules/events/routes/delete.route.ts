import { FastifyPluginAsync } from "fastify";
import { eventIdSchema, messageResponseSchema } from "../events.schemas";
import { EventsService } from "../events.services";
import { sendBusinessError } from "../../helpers/errors";
import z from "zod";

export const deleteEventRoute: FastifyPluginAsync = async (app) => {
  const eventsService = new EventsService();
  app.delete<{
    Params: z.infer<typeof eventIdSchema>;
  }>(
    "/:eventId",
    {
      preHandler: [app.authenticate],
      schema: {
        params: eventIdSchema,
        response: {
          200: messageResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;

      try {
        await eventsService.delete(eventId, request.user.sub);
        return reply.code(200).send({ message: "Event deleted" });
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
