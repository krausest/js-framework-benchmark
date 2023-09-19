import fastifyStatic from "@fastify/static";
import path from "node:path";
import { cwd } from "node:process";

import { isCSPEnabled } from "../csp/cspControllers.js";
import { frameworksDirectory } from "../config/directories.js";
import { generateAndServeIndex } from "../frameworks/frameworksControllers.js";

const projectRootPath = path.join(cwd(), "..");

/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {import("fastify").RegisterOptions} options
 */
async function routes(fastify) {
  fastify.register(fastifyStatic, {
    root: frameworksDirectory,
    prefix: "/frameworks",
    setHeaders: (res, path) => {
      if (isCSPEnabled && path.endsWith("index.html")) {
        res.setHeader(
          "Content-Security-Policy",
          "default-src 'self'; report-uri /csp",
        );
      }
    },
  });

  fastify.register(fastifyStatic, {
    root: path.join(projectRootPath, "css"),
    prefix: "/css",
    decorateReply: false,
  });

  fastify.register(fastifyStatic, {
    root: path.join(projectRootPath, "webdriver-ts-results"),
    prefix: "/webdriver-ts-results",
    decorateReply: false,
  });

  fastify.get("/", generateAndServeIndex);
  fastify.get("/index.html", generateAndServeIndex);
}

export default routes;
