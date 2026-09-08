import { FastifyPluginAsync } from "fastify";
import { createEventSchema, updateEventSchema } from "./events.schemas";
import { sendError } from "../helpers";
import { EventsService } from "./events.services";

export const eventsRoutes: FastifyPluginAsync = async (app) => {
  const eventsService = new EventsService();

  // CREATE
  app.post("/", { preHandler: [app.authenticate] }, async (request, reply) => {
    const parseBody = createEventSchema.safeParse(request.body);

    if (!parseBody.success) {
      return sendError(reply, 400, "Validation error", parseBody.error);
    }

    try {
      const event = await eventsService.create(
        parseBody.data,
        request.user.sub,
      );
      return reply.code(201).send(event);
    } catch (error: any) {
      return sendError(reply, 400, error.message);
    }
  });

  // GET ALL
  app.get("/", async () => {
    return await eventsService.findAll();
  });

  // UPDATE
  app.patch(
    "/:id",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const parseBody = updateEventSchema.safeParse(request.body);

      if (!parseBody.success) {
        return sendError(reply, 400, "Validation error", parseBody.error);
      }

      try {
        const updated = await eventsService.update(
          id,
          request.user.sub,
          parseBody.data,
        );
        return reply.send(updated);
      } catch (error: any) {
        const status = error.message === "Event not found" ? 404 : 403;
        return sendError(reply, status, error.message);
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
        const status = error.message === "Event not found" ? 404 : 403;
        return sendError(reply, status, error.message);
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
        return sendError(reply, 403, error.message);
      }
    },
  );

  app.post(
    "/join",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const { id, eventId } = request.params as { id: string; eventId: string };
      try {
        const participant = await eventsService.joinEvent(eventId, id);
        return reply.code(201).send(participant);
      } catch (error: any) {
        return sendError(reply, 400, error.message, error);
      }
    },
  );
};
