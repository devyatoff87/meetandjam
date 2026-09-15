import { FastifyPluginAsync } from "fastify";
import { eventIdSchema } from "../events.schemas";
import { EventsService } from "../events.services";
import { sendBusinessError } from "../../helpers/errors";
import z from "zod";

export const deleteEventRoute: FastifyPluginAsync = async (app) => {
  const eventsService = new EventsService();
  app.delete<{
    Params: z.infer<typeof eventIdSchema>;
  }>(
    "/:eventId",
    {
      preHandler: [app.authenticate],
      schema: {
        params: eventIdSchema,
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;
      console.log("🔍 DELETE /:id");
      console.log("📦 request.params.eventId:", request.params.eventId);
      console.log("👤 request.user:", request.user);
      console.log("🆔 request.user.sub:", request.user?.sub);
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
