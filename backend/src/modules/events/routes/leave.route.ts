import { FastifyPluginAsync } from "fastify";
import { eventIdSchema, messageResponseSchema } from "../events.schemas";
import { EventsService } from "../events.services";
import { sendBusinessError } from "../../../helpers/errors";

export const leaveEventRoute: FastifyPluginAsync = async (app) => {
  const eventsService = new EventsService();
  app.post(
    "/leave",
    {
      preHandler: [app.authenticate],
      schema: {
        body: eventIdSchema,
        response: { 200: messageResponseSchema },
      },
    },
    async (request, reply) => {
      const { eventId } = request.body as { eventId: string };

      try {
        const result = await eventsService.joinEvent(
          eventId,
          request.user.sub,
          "leave",
        );
        return reply.code(200).send(result);
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
