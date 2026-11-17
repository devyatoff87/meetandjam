import { FastifyPluginAsync } from "fastify";
import { eventIdSchema, membershipResponseSchema } from "../events.schemas";
import { EventsService } from "../events.services";
import { sendBusinessError } from "../../../helpers/errors";
import z from "zod";

export const membershipRoute: FastifyPluginAsync = async (app) => {
  const eventsService = new EventsService();
  app.get<{ Params: z.infer<typeof eventIdSchema> }>(
    "/:eventId/membership",
    {
      preHandler: [app.authenticate],
      schema: {
        params: eventIdSchema,
        response: { 200: membershipResponseSchema },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;
      const userId = request.user.sub;

      try {
        const result = await eventsService.getMembership(eventId, userId);
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
