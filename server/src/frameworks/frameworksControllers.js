// @ts-check
import { loadFrameworkVersions } from "./frameworksServices.js";
import { generateIndexHtml } from "./helpers/index.js";
import path from "node:path";
import { cwd } from "node:process";

const projectRootPath = path.join(cwd(), "..");

/**
 * @typedef {import("fastify").FastifyRequest} Request
 * @typedef {import("fastify").FastifyReply} Reply
 */

/**
 * Get framework versions.
 * @param {Request} request
 * @param {Reply} reply
 */
export async function getFrameworksVersions(request, reply) {
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

/**
 * Get and serve the index HTML page.
 * @param {Request} request
 * @param {Reply} reply
 */
export async function generateAndServeIndex(request, reply) {
  await generateIndexHtml();

  return reply.sendFile("index.html", projectRootPath);
}
