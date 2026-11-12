import { FastifyPluginAsync } from "fastify";
import { createEventSchema, eventResponseSchema } from "../events.schemas";
import { EventsService } from "../events.services";
import { sendBusinessError } from "../../../helpers/errors";

export const createEventRoute: FastifyPluginAsync = async (app) => {
  const eventsService = new EventsService();
  app.post(
    "/",
    {
      preHandler: [app.authenticate],
      schema: {
        body: createEventSchema,
        response: {
          201: eventResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const eventData = request.body;

      try {
        const event = await eventsService.create(eventData, request.user.sub);
        return reply.code(201).send(event);
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
