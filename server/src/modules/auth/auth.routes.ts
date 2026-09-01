import { FastifyPluginAsync } from "fastify";
import { AppDataSource } from "../../db/data-source";
import { User } from "../../db/entities/user.entity";
import { loginSchema, registerSchema } from "./auth.schemas";
import argon2 from "argon2";

export const authRoutes: FastifyPluginAsync = async (app) => {
  const userRepository = AppDataSource.getRepository(User);

  app.post("/register", async (request, reply) => {
    const parseBody = registerSchema.safeParse(request.body);

    if (!parseBody.success) {
      return reply.code(400).send({
        message: "Validation error",
        errors: parseBody.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { name, email, password } = parseBody.data;

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return reply.code(409).send({
        message: "User with this email already exists",
      });
    }

    const passwordHash = await argon2.hash(password);
    const user = userRepository.create({ email, passwordHash, name });
    const savedUser = await userRepository.save(user);

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
  });

  app.post("/login", async (request, reply) => {
    const parseBody = loginSchema.safeParse(request.body);

    if (!parseBody.success) {
      return reply.code(400).send({
        message: "Validation error",
        errors: parseBody.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { email, password } = parseBody.data;

    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return reply.code(401).send({
        message: "Login or password is not correct",
      });
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, password);
    if (!isPasswordValid) {
      return reply.code(401).send({
        message: "Login or password is not correct",
      });
    }

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
  });
};
