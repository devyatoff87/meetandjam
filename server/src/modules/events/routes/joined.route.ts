import { FastifyPluginAsync } from "fastify";
import { EventsService } from "../events.services";
import { sendBusinessError } from "../../helpers/errors";

export const joinedEventsRoute: FastifyPluginAsync = async (app) => {
  const eventsService = new EventsService();
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
};
