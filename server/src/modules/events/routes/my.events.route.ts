import { FastifyPluginAsync } from "fastify";
import { allEventsSchema, eventsListResponseSchema } from "../events.schemas";
import { EventsService } from "../events.services";
import { sendBusinessError } from "../../helpers/errors";
import z from "zod";

export const myEventsRoute: FastifyPluginAsync = async (app) => {
  const eventsService = new EventsService();

  app.get<{ Querystring: z.infer<typeof allEventsSchema> }>(
    "/me",
    {
      preHandler: [app.authenticate],
      schema: {
        querystring: allEventsSchema,
        response: { 200: eventsListResponseSchema },
      },
    },
    async (request, reply) => {
      const options = request.query;
      try {
        const events = await eventsService.getAllByUser(
          request.user.sub,
          options,
        );
        return reply.code(200).send(events);
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
