import { FastifyPluginAsync } from "fastify";
import {
  createEventSchema,
  uuidSchema,
  eventIdSchema,
  updateEventSchema,
  allEventsSchema,
  eventsListResponseSchema,
  eventResponseSchema,
  messageResponseSchema,
  participantResponseSchema,
  participantsListResponseSchema,
  joinedEventsResponseSchema,
} from "./events.schemas";
import { EventsService } from "./events.services";
import { validateEventsQueries, validateZ } from '../helpers/validations';
import { sendBusinessError } from '../helpers/errors';

export const eventsRoutes: FastifyPluginAsync = async (app) => {
  const eventsService = new EventsService();

  // CREATE
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
      const parseBody = validateZ(createEventSchema, request.body, reply);
      if (!parseBody) return;

      try {
        const event = await eventsService.create(parseBody, request.user.sub);
        return reply.code(201).send(event);
      } catch (error: any) {
        return sendBusinessError(reply, error.status || 500, error.message);
      }
    },
  );

  // GET ALL
  app.get(
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
      const parseQueries = validateEventsQueries(request.query, reply);
      if (!parseQueries) return;

      try {
        const events = await eventsService.findAll(parseQueries);
        reply.code(200).send(events);
      } catch (error: any) {
        return sendBusinessError(reply, error.status || 500, error.message);
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
        response: {
          200: eventsListResponseSchema,
        },
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
        return sendBusinessError(reply, error.status || 500, error.message);
      }
    },
  );

  // GET ONE EVENT
  app.get(
    "/:id",
    {
      schema: {
        params: uuidSchema,
        response: {
          200: eventResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const parseId = validateZ(uuidSchema, request.params, reply);
      if (!parseId) return;
      const { id } = parseId;

      try {
        const event = await eventsService.findOne(id, request.user?.sub || "");
        return reply.code(200).send(event);
      } catch (error: any) {
        return sendBusinessError(reply, error.status || 500, error.message);
      }
    },
  );

  //GET USERS EVENTS
  app.get(
    "/user/:userId",
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
      const parseId = validateZ(uuidSchema, request.params, reply);
      if (!parseId) return;
      const { id } = parseId;

      const parseQueries = validateEventsQueries(request.query, reply);
      if (!parseQueries) return;

      try {
        const events = await eventsService.getAllByUser(id, parseQueries);
        return reply.code(200).send(events);
      } catch (error: any) {
        return sendBusinessError(reply, error.status || 500, error.message);
      }
    },
  );
  // UPDATE
  app.patch(
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
      const parseId = validateZ(uuidSchema, request.params, reply);
      if (!parseId) return;
      const { id } = parseId;

      const parseBody = validateZ(updateEventSchema, request.body, reply);
      if (!parseBody) return;

      try {
        const updated = await eventsService.update(
          id,
          request.user.sub,
          parseBody,
        );
        return reply.send(updated);
      } catch (error: any) {
        return sendBusinessError(reply, error.status || 500, error.message);
      }
    },
  );

  // DELETE ALL
  app.delete(
    "/all",
    {
      preHandler: [app.authenticate],
      schema: {
        response: {
          200: messageResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        await eventsService.deleteAll(request.user.sub);
        return reply.code(200).send({ message: "All events deleted" });
      } catch (error: any) {
        return sendBusinessError(reply, error.status || 500, error.message);
      }
    },
  );

  // DELETE ONE
  app.delete(
    "/:id",
    {
      preHandler: [app.authenticate],
      schema: {
        params: uuidSchema,
        response: {
          200: messageResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const parseId = validateZ(uuidSchema, request.params, reply);
      if (!parseId) return;
      const { id } = parseId;

      try {
        await eventsService.delete(id, request.user.sub);
        return reply.code(200).send({ message: "Event deleted" });
      } catch (error: any) {
        return sendBusinessError(reply, error.status || 500, error.message);
      }
    },
  );

  // JOIN
  app.post(
    "/join",
    {
      preHandler: [app.authenticate],
      schema: {
        body: eventIdSchema,
        response: {
          201: participantResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const parseBody = validateZ(eventIdSchema, request.body, reply);
      if (!parseBody) return;
      const { eventId } = parseBody;

      try {
        const participant = await eventsService.joinEvent(
          eventId,
          request.user.sub,
          "join",
        );
        return reply.code(201).send(participant);
      } catch (error: any) {
        return sendBusinessError(reply, error.status || 500, error.message);
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
        response: {
          200: messageResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const parseBody = validateZ(eventIdSchema, request.body, reply);
      if (!parseBody) return;
      const { eventId } = parseBody;

      try {
        const result = await eventsService.joinEvent(
          eventId,
          request.user.sub,
          "leave",
        );
        return reply.code(200).send(result);
      } catch (error: any) {
        return sendBusinessError(reply, error.status || 500, error.message);
      }
    },
  );

  // PARTICIPANTS LIST
  app.get(
    "/:id/participants",
    {
      schema: {
        params: uuidSchema,
        response: {
          200: participantsListResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const parseId = validateZ(uuidSchema, request.params, reply);
      if (!parseId) return;
      const { id } = parseId;

      try {
        const participants = await eventsService.findParticipants(id);
        reply.code(200).send(participants);
      } catch (error: any) {
        return sendBusinessError(reply, error.status || 500, error.message);
      }
    },
  );

  // JOINED EVENTS
  app.get(
    "/joined",
    {
      preHandler: [app.authenticate],
      schema: {
        response: {
          200: joinedEventsResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub;

      try {
        const joined = await eventsService.findParticipations(userId);
        reply.code(200).send(joined);
      } catch (error: any) {
        return sendBusinessError(reply, error.status || 500, error.message);
      }
    },
  );
};
