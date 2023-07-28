import { addCSP, disableCSP, enableCSP, getCSP } from "./cspControllers.js";

/**
 * A plugin that provide encapsulated routes
 * @param {import("fastify").FastifyInstance} fastify
 * @param {import("fastify").RegisterOptions} options
 */
async function routes(fastify, _options) {
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
