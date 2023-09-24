import Fastify from "fastify";
import frameworksRouter from "./src/frameworks/frameworksRouter.js";
import cspRouter from "./src/csp/cspRouter.js";
import staticRouter from "./src/static/staticRouter.js";
import * as ejs from "ejs";
import * as fastifyView from "@fastify/view";
import minifier from "html-minifier";

/**
 * Builds the server but does not start it. Need it for testing API
 * @param {import("fastify").FastifyServerOptions} options
 * @returns {import("fastify").FastifyInstance}
 */
function buildServer(options = {}) {
  const fastify = Fastify(options);

  fastify.register(fastifyView, {
    engine: {
      ejs: ejs,
    },
    options: {
      useHtmlMinifier: minifier,
    },
  });

  fastify.addHook("onRequest", (request, reply, done) => {
    if (request.url.endsWith("index.html")) {
      reply.header("Cross-Origin-Embedder-Policy", "require-corp");
      reply.header("Cross-Origin-Opener-Policy", "same-origin");
    }
    done();
  });

  fastify.register(staticRouter);
  fastify.register(frameworksRouter);
  fastify.register(cspRouter, { prefix: "/csp" });

  return fastify;
}

export { buildServer };
