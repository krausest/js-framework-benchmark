import { FastifyReply, FastifyRequest } from "fastify";
import { loadFrameworkVersions } from "./frameworksServices.js";
import { prepareFrameworkData } from "./helpers/index.js";

export async function getFrameworksVersions(request: FastifyRequest, reply: FastifyReply) {
  performance.mark("Start");

  const frameworks = await loadFrameworkVersions();

  performance.mark("End");

  const executionTime = performance.measure("/ls duration measurement", "Start", "End").duration;

  console.log(`/ls duration: ${executionTime}ms`);

  return reply.send(frameworks);
}

/**
 * Get and serve the index HTML page.
 */
export async function generateAndServeIndex(request: FastifyRequest, reply: FastifyReply) {
  return reply.view("templates/index.ejs", { frameworks: await prepareFrameworkData() });
}
