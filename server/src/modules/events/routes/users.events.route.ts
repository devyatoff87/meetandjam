import { FastifyPluginAsync } from "fastify";
import {
  allEventsSchema,
  eventsListResponseSchema,
  userIdSchema,
} from "../events.schemas";
import { EventsService } from "../events.services";
import { sendBusinessError } from "../../../helpers/errors";
import z from "zod";

export const usersEventsRoute: FastifyPluginAsync = async (app) => {
  const eventsService = new EventsService();
  app.get<{
    Params: z.infer<typeof userIdSchema>;
    Querystring: z.infer<typeof allEventsSchema>;
  }>(
    "/user/:userId",
    {
      schema: {
        params: userIdSchema,
        querystring: allEventsSchema,
        response: {
          200: eventsListResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { userId } = request.params;
      const query = request.query;

      try {
        const events = await eventsService.getAllByUser(userId, query);
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
