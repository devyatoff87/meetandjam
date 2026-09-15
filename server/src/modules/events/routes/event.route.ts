import { FastifyPluginAsync } from "fastify";
import { eventIdSchema, eventResponseSchema } from "../events.schemas";
import { EventsService } from "../events.services";
import { sendBusinessError } from "../../helpers/errors";
import z from "zod";

export const oneEventRoute: FastifyPluginAsync = async (app) => {
  const eventsService = new EventsService();
  app.get<{ Params: z.infer<typeof eventIdSchema> }>(
    "/:eventId",
    {
      schema: {
        params: eventIdSchema,
        response: {
          200: eventResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;

      try {
        const event = await eventsService.findOne(
          eventId,
          request.user?.sub || "",
        );
        return reply.code(200).send(event);
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
