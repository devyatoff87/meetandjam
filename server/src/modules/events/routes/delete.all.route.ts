import { FastifyPluginAsync } from "fastify";
import { EventsService } from "../events.services";
import { sendBusinessError } from "../../helpers/errors";

export const deleteAllEventsRoute: FastifyPluginAsync = async (app) => {
  const eventsService = new EventsService();
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
};
