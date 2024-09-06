import { createResponseSizeDecorator } from "./responseSize/responseSizeDecorator.js";
import { createCSPDecorator } from "./csp/cspDecorator.js";

declare module "fastify" {
  interface FastifyInstance {
    responseSize: ReturnType<typeof createResponseSizeDecorator>;
    csp: ReturnType<typeof createCSPDecorator>;
  }
}
