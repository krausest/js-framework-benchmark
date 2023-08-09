import { loadFrameworkVersions } from "./frameworksServices.js";

/**
 * @typedef {import("fastify").FastifyRequest} Request
 * @typedef {import("fastify").FastifyReply} Reply
 */

/**
 * @param {Request} request
 * @param {Reply} reply
 */
export async function getFrameworksVersions(_request, reply) {
  performance.mark("Start");

  const frameworks = await loadFrameworkVersions();

  performance.mark("End");

  const executionTime = performance.measure(
    "/ls duration measurement",
    "Start",
    "End",
  ).duration;

  console.log(`/ls duration: ${executionTime}ms`);

  return reply.send(frameworks);
}
