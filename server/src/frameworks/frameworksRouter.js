import { loadFrameworkVersionInformation } from "./frameworksControllers.js";

/**
 * A plugin that provide encapsulated routes
 * @param {import("fastify").FastifyInstance} fastify
 * @param {import("fastify").RegisterOptions} options
 */
async function routes(fastify, _options) {
  fastify.get("/ls", async function (_request, reply) {
    performance.mark("Start");

    const frameworks = await loadFrameworkVersionInformation();
    reply.send(frameworks);

    performance.mark("End");
    const executionTime = performance.measure(
      "/ls duration measurement",
      "Start",
      "End",
    ).duration;

    console.log(`/ls duration: ${executionTime}ms`);
    return;
  });
}

export default routes;
