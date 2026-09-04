import "@fastify/jwt";
import "fastify";
import { FastifyReply, FastifyRequest } from "fastify";
import { Role } from "./roles";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { sub: string; email: string };
    user: { sub: string; email: string };
  }
}
