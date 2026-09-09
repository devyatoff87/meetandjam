import { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { createEventSchema, updateEventSchema } from "./events.schemas";
import { sendBusinessError, sendValidationError } from "../helpers";
import { EventsService } from "./events.services";

export const eventsRoutes: FastifyPluginAsync = async (app) => {
  const eventsService = new EventsService();

  // CREATE
  app.post("/", { preHandler: [app.authenticate] }, async (request, reply) => {
    const parseBody = createEventSchema.safeParse(request.body);

    if (!parseBody.success) {
      return sendValidationError(reply, parseBody.error);
    }

    try {
      const event = await eventsService.create(
        parseBody.data,
        request.user.sub,
      );
      return reply.code(201).send(event);
    } catch (error: any) {
      return sendBusinessError(reply, error.status || 500, error.message);
    }
  });

  // GET ALL
  app.get("/", async (request, reply) => {
    const query = request.query as {
      page?: string;
      limit?: string;
      search: string;
    };
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const search = query.search || "";

    try {
      const filteredEvents = await eventsService.findAll(limit, page, search);
      reply.code(200).send(filteredEvents);
    } catch (error: any) {
      return sendBusinessError(reply, error.status || 500, error.message);
    }
  });

  // GET MY EVENTS
  app.get("/me", { preHandler: [app.authenticate] }, async (request, reply) => {
    try {
      const events = await eventsService.getAllByUser(request.user.sub);
      return reply.code(200).send(events);
    } catch (error: any) {
      return sendBusinessError(reply, error.status || 500, error.message);
    }
  });

  // GET USERS EVENTS
  app.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const events = await eventsService.getAllByUser(id);
      return reply.code(200).send(events);
    } catch (error: any) {
      return sendBusinessError(reply, error.status || 500, error.message);
    }
  });

  // UPDATE
  app.patch(
    "/:id",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const parseBody = updateEventSchema.safeParse(request.body);

      if (!parseBody.success) {
        return sendValidationError(reply, parseBody.error);
      }

      try {
        const updated = await eventsService.update(
          id,
          request.user.sub,
          parseBody.data,
        );
        return reply.send(updated);
      } catch (error: any) {
        return sendBusinessError(reply, error.status || 500, error.message);
      }
    },
  );

  // DELETE ONE
  app.delete(
    "/:id",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      try {
        await eventsService.delete(id, request.user.sub);
        return reply.code(200).send({ message: "Event deleted" });
      } catch (error: any) {
        return sendBusinessError(reply, error.status || 500, error.message);
      }
    },
  );

  // DELETE ALL
  app.delete(
    "/all",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      try {
        await eventsService.deleteAll(request.user.sub);
        return reply.code(200).send({ message: "All events deleted" });
      } catch (error: any) {
        return sendBusinessError(reply, error.status || 500, error.message);
      }
    },
  );

  // JOIN
  app.post(
    "/join",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const { eventId } = request.body as { eventId: string };
      const userId = request.user.sub;

      try {
        const participant = await eventsService.joinEvent(
          eventId,
          userId,
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
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const { eventId } = request.body as { eventId: string };
      const userId = request.user.sub;

      try {
        const result = await eventsService.joinEvent(eventId, userId, "leave");
        return reply.code(200).send(result);
      } catch (error: any) {
        return sendBusinessError(reply, error.status || 500, error.message);
      }
    },
  );

  //PARTICIPANTS LIST
  app.get(
    "/:id/participants",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.query as { id: string };
      try {
        const participants = await eventsService.findEventParticipants(id);
        1;
        reply.code(200).send(participants);
      } catch (error) {}
    },
  );
};
