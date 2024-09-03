import { getFrameworksVersions } from "./frameworksControllers.js";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
async function routes(fastify) {
  fastify.get("/ls", getFrameworksVersions);
}

export default routes;
