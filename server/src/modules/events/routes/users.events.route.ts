import { FastifyPluginAsync } from "fastify";
import {
  allEventsSchema,
  eventsListResponseSchema,
  uuidSchema,
} from "../events.schemas";
import { EventsService } from "../events.services";
import { sendBusinessError } from "../../helpers/errors";
import z from "zod";

export const usersEventsRoute: FastifyPluginAsync = async (app) => {
  const eventsService = new EventsService();
  app.get<{
    Params: z.infer<typeof uuidSchema>;
    Querystring: z.infer<typeof allEventsSchema>;
  }>(
    "/user/:id",
    {
      schema: {
        params: uuidSchema,
        querystring: allEventsSchema,
        response: {
          200: eventsListResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const query = request.query;

      try {
        const events = await eventsService.getAllByUser(id, query);
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
