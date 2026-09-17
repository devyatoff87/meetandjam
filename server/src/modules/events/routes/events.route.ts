import { FastifyPluginAsync } from "fastify";
import {
  allEventsSchema,
   eventsListResponseSchema,
} from "../events.schemas";
import { EventsService } from "../events.services";
import { sendBusinessError } from "../../../helpers/errors";
import z from "zod";

export const allEventsRoute: FastifyPluginAsync = async (app) => {
  const eventsService = new EventsService();

  app.get<{ Querystring: z.infer<typeof allEventsSchema> }>(
    "/",
    {
      schema: {
        querystring: allEventsSchema,
        response: {
          200: eventsListResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const options = request.query;

      try {
        const events = await eventsService.findAll(options);
        reply.code(200).send(events);
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
