import { AppError } from "../types/errors";

import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

const errorHandlerPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.setErrorHandler((error: AppError, request, reply) => {
    if (error.code === "FST_ERR_VALIDATION" || error.validation) {
      return reply.status(400).send({
        statusCode: 400,
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: error.validation ?? null,
      });
    }

    if (error.code === "FST_ERR_CTP_INVALID_JSON_BODY") {
      return reply.status(400).send({
        statusCode: 400,
        code: "INVALID_JSON",
        message: "Invalid JSON body",
        details: null,
      });
    }

    if (typeof error.status === "number" && typeof error.code === "string") {
      return reply.status(error.status).send({
        statusCode: error.status,
        code: error.code,
        message: error.message,
        details: (error as any).details ?? null,
      });
    }

    return reply.status(error.statusCode ?? 500).send({
      statusCode: error.statusCode ?? 500,
      code: error.code ?? "INTERNAL_ERROR",
      message: error.message ?? "Internal server error",
      details: null,
    });
  });
};

export default fp(errorHandlerPlugin, {
  name: "error-handler",
});
