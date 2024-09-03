import fastifyStatic from "@fastify/static";
import path from "node:path";
import { cwd } from "node:process";

import { frameworksDirectory } from "../config/directories.js";
import { generateAndServeIndex } from "../frameworks/frameworksControllers.js";
import { FastifyInstance } from "fastify";

const projectRootPath = path.join(cwd(), "..");

async function routes(fastify: FastifyInstance) {
  fastify.register(fastifyStatic, {
    root: frameworksDirectory,
    prefix: "/frameworks",
    setHeaders: (res, path) => {
      if (fastify.csp.isEnabled && path.endsWith("index.html")) {
        res.setHeader("Content-Security-Policy", "default-src 'self'; report-uri /csp");
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
