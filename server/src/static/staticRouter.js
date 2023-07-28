import fastifyStatic from "@fastify/static";
import path from "path";
import { cwd } from "process";

import { isCSPEnabled } from "../csp/cspControllers.js";
import { frameworksDirectory } from "../config/directories.js";

const pathToIndex = path.join(cwd(), "..");

/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {import("fastify").RegisterOptions} options
 */
async function routes(fastify, _options) {
  fastify.register(fastifyStatic, {
    root: frameworksDirectory,
    prefix: "/frameworks",
    setHeaders: (res, path, _stat) => {
      if (isCSPEnabled && path.endsWith("index.html")) {
        res.setHeader(
          "Content-Security-Policy",
          "default-src 'self'; report-uri /csp"
        );
      }
    },
  });

  fastify.register(fastifyStatic, {
    root: path.join(cwd(), "..", "css"),
    prefix: "/css",
    decorateReply: false,
  });

  fastify.register(fastifyStatic, {
    root: path.join(cwd(), "..", "webdriver-ts-results"),
    prefix: "/webdriver-ts-results",
    decorateReply: false,
  });

  fastify.get("/index.html", (_request, reply) => {
    reply.sendFile("index.html", pathToIndex);
  });
}

export default routes;
