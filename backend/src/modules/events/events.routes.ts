import { FastifyPluginAsync } from "fastify";
import { createEventRoute } from "./routes/create.route";
import { myEventsRoute } from "./routes/my.events.route";
import { allEventsRoute } from "./routes/events.route";
import { joinedEventsRoute } from "./routes/joined.route";
import { joinEventRoute } from "./routes/join.route";
import { leaveEventRoute } from "./routes/leave.route";
import { deleteEventRoute } from "./routes/delete.route";
import { updateEventRoute } from "./routes/update.route";
import { oneEventRoute } from "./routes/event.route";
import { usersEventsRoute } from "./routes/users.events.route";
import { participantsRoute } from "./routes/participants.route";

export const eventsRoutes: FastifyPluginAsync = async (app) => {
  app.register(createEventRoute);
  app.register(allEventsRoute);
  app.register(myEventsRoute);
  app.register(joinedEventsRoute);
  app.register(joinEventRoute);
  app.register(leaveEventRoute);

  app.register(participantsRoute);
  app.register(usersEventsRoute);

  app.register(oneEventRoute);
  app.register(updateEventRoute);
  app.register(deleteEventRoute);
};
