import { FastifyPluginAsync } from "fastify";
import {
  authResponseSchema,
  loginSchema,
  meResponseSchema,
  registerSchema,
} from "./auth.schemas";
import {} from "../helpers/check.credentials";
import AuthService from "./auth.service";
import { sendBusinessError, sendValidationError } from "../helpers/errors";

export const authRoutes: FastifyPluginAsync = async (app) => {
  const authService = new AuthService();

  // REGISTER
  app.post(
    "/register",
    {
      schema: {
        body: registerSchema,
        response: {
          201: authResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const parseBody = registerSchema.safeParse(request.body);

      if (!parseBody.success) {
        return sendValidationError(reply, parseBody.error);
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
        return sendBusinessError(
          reply,
          error.status || 500,
          error.message,
          error.code,
        );
      }
    },
  );

  // LOGIN
  app.post(
    "/login",
    {
      schema: {
        body: loginSchema,
        response: {
          200: authResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const parseBody = loginSchema.safeParse(request.body);

      if (!parseBody.success) {
        return sendValidationError(reply, parseBody.error);
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
        return sendBusinessError(
          reply,
          error.status || 500,
          error.message,
          error.code,
        );
      }
    },
  );

  // GET /me
  app.get(
    "/me",
    {
      preHandler: [app.authenticate],
      schema: {
        response: {
          200: meResponseSchema,
        },
      },
    },
    async (request, reply) => {
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
