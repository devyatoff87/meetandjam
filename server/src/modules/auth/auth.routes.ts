import { FastifyPluginAsync } from "fastify";
import { AppDataSource } from "../../db/data-source";
import { User } from "../../db/entities/user.entity";
import { registerSchema } from "./auth.schemas";
import argon2 from "argon2";

export const authRoutes: FastifyPluginAsync = async (app) => {
  const userRepository = AppDataSource.getRepository(User);

  app.post("/register", async (request, reply) => {
    const parseBody = registerSchema.safeParse(request.body);

    if (!parseBody.success) {
      return reply.code(400).send({
        message: "Validation error",
        error: parseBody.error.issues.map((issue) => {
          return {
            path: issue.path.join("."),
            message: issue.message,
          };
        }),
      });
    }

    const { name, email, password } = parseBody.data;
    const isUserExist = await userRepository.findOne({ where: { email } });
    if (isUserExist) {
      return reply
        .code(409)
        .send({ message: "User with this email already exists" });
    }
    const passwordHash = await argon2.hash(password);
    const user = userRepository.create({
      email,
      passwordHash,
      name,
    });

    const savedUser = await userRepository.save(user);
    const token = await reply.jwtSign({
      sub: savedUser.id,
      email: savedUser.email,
    });

    reply.code(201).send({
      token,
      user: {
        sub: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
      },
    });
  });
};
