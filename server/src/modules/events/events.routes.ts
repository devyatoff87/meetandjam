import { FastifyPluginAsync } from "fastify";
import {
  createEventSchema,
  uuidSchema,
  eventIdSchema,
  updateEventSchema,
  allEventsSchema,
  eventsListResponseSchema,
  eventResponseSchema,
} from "./events.schemas";
import { EventsService } from "./events.services";
import { validateEventsQueries } from "../helpers/validations";
import { sendBusinessError } from "../helpers/errors";
import z from "zod";

export const eventsRoutes: FastifyPluginAsync = async (app) => {
  const eventsService = new EventsService();

  // CREATE
  app.post(
    "/",
    {
      preHandler: [app.authenticate],
      schema: {
        body: createEventSchema,
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

  // GET ALL
  app.get(
    "/",
    {
      schema: {
        querystring: allEventsSchema,
      },
    },
    async (request, reply) => {
      const parseQueries = validateEventsQueries(request.query, reply);
      if (!parseQueries) return;

      try {
        const events = await eventsService.findAll(parseQueries);
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

  // GET MY EVENTS
  app.get(
    "/me",
    {
      preHandler: [app.authenticate],
      schema: {
        querystring: allEventsSchema,
      },
    },
    async (request, reply) => {
      const parseQueries = validateEventsQueries(request.query, reply);
      if (!parseQueries) return;

      try {
        const events = await eventsService.getAllByUser(
          request.user.sub,
          parseQueries,
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

  // JOINED EVENTS
  app.get(
    "/joined",
    {
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const userId = request.user.sub;

      try {
        const joined = await eventsService.findParticipations(userId);
        reply.code(200).send(joined);
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

  // JOIN
  app.post<{ Body: z.infer<typeof eventIdSchema> }>(
    "/join",
    {
      preHandler: [app.authenticate],
      schema: {
        body: eventIdSchema,
      },
    },
    async (request, reply) => {
      const { eventId } = request.body;

      try {
        const participant = await eventsService.joinEvent(
          eventId,
          request.user.sub,
          "join",
        );
        return reply.code(201).send(participant);
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

  // LEAVE
  app.post(
    "/leave",
    {
      preHandler: [app.authenticate],
      schema: {
        body: eventIdSchema,
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

  // DELETE ALL
  app.delete(
    "/all",
    {
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      try {
        await eventsService.deleteAll(request.user.sub);
        return reply.code(200).send({ message: "All events deleted" });
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

  // PARTICIPANTS LIST
  app.get<{ Params: z.infer<typeof eventIdSchema> }>(
    "/:id/participants",
    {
      schema: {
        params: uuidSchema,
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;

      try {
        const participants = await eventsService.findParticipants(eventId);
        reply.code(200).send(participants);
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

  // GET USERS EVENTS
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

  // GET ONE EVENT
  app.get<{ Params: z.infer<typeof uuidSchema> }>(
    "/:id",
    {
      schema: {
        params: uuidSchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      try {
        const event = await eventsService.findOne(id, request.user?.sub || "");
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

  // UPDATE
  app.patch<{
    Params: z.infer<typeof uuidSchema>;
    Body: z.infer<typeof updateEventSchema>;
  }>(
    "/:id",
    {
      preHandler: [app.authenticate],
      schema: {
        params: uuidSchema,
        body: updateEventSchema,
        response: {
          200: eventResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const data = request.body;

      try {
        const updated = await eventsService.update(id, request.user.sub, data);
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

  // DELETE ONE
  app.delete<{
    Params: z.infer<typeof eventIdSchema>;
  }>(
    "/:id",
    {
      preHandler: [app.authenticate],
      schema: {
        params: uuidSchema,
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
