import { createResponseSizeDecorator } from "./responseSize/responseSizeDecorator.js";

declare module "fastify" {
  interface FastifyInstance {
    responseSize: ReturnType<typeof createResponseSizeDecorator>;
  }
}
