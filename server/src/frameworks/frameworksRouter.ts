import { FastifyInstance } from "fastify";
import { getFrameworksVersions } from "./frameworksControllers.js";

async function routes(fastify: FastifyInstance) {
  fastify.get("/ls", getFrameworksVersions);
}

export default routes;
