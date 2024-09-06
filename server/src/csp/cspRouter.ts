import { FastifyInstance } from "fastify";
import { addCSP, disableCSP, enableCSP, getCSP } from "./cspControllers.js";

async function routes(fastify: FastifyInstance) {
  fastify.addContentTypeParser(
    "application/csp-report",
    { parseAs: "string" },
    fastify.getDefaultJsonParser("ignore", "ignore")
  );

  fastify.get("/enable", enableCSP);
  fastify.get("/disable", disableCSP);
  fastify.get("/", getCSP);
  fastify.post("/", addCSP);
}

export default routes;
