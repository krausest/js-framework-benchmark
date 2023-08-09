import { getFrameworksVersions } from "./frameworksControllers.js";

/**
 * A plugin that provide encapsulated routes
 * @param {import("fastify").FastifyInstance} fastify
 */
async function routes(fastify) {
  fastify.get("/ls", getFrameworksVersions);
}

export default routes;
