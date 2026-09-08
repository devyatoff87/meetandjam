import { FastifyPluginAsync } from "fastify";
import { loginSchema, registerSchema } from "./auth.schemas";
import { sendError } from "../helpers";
import AuthService from "./auth.service";

export const authRoutes: FastifyPluginAsync = async (app) => {
  const authService = new AuthService();

  // REGISTER
  app.post("/register", async (request, reply) => {
    const parseBody = registerSchema.safeParse(request.body);

    if (!parseBody.success) {
      return sendError(reply, 400, "Validation error", parseBody.error);
    }

    try {
      const savedUser = await authService.register(parseBody.data);
      const token = await reply.jwtSign({
        sub: savedUser.id,
        email: savedUser.email,
      });

      return reply.code(201).send({
        token,
        user: {
          id: savedUser.id,
          email: savedUser.email,
          name: savedUser.name,
        },
      });
    } catch (error: any) {
      if (error.message === "An account with this email is already exists") {
        return sendError(reply, 409, error.message);
      }
      return sendError(reply, 400, error.message);
    }
  });

  // LOGIN
  app.post("/login", async (request, reply) => {
    const parseBody = loginSchema.safeParse(request.body);

    if (!parseBody.success) {
      return sendError(reply, 400, "Validation error", parseBody.error);
    }

    try {
      const user = await authService.login(parseBody.data);
      const token = await reply.jwtSign({
        sub: user.id,
        email: user.email,
      });

      return reply.send({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (error: any) {
      return sendError(reply, 401, error.message);
    }
  });

  // GET /me
  app.get("/me", { preHandler: [app.authenticate] }, async (request, reply) => {
    const userId = request.user.sub;

    try {
      const user = await authService.me(userId);
      return reply.code(200).send({
        id: user.id,
        email: user.email,
        name: user.name,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt,
      });
    } catch (error: any) {
      return sendError(reply, 404, error.message);
    }
  });
};
