import Fastify, { FastifyServerOptions } from "fastify";
import frameworksRouter from "./src/frameworks/frameworksRouter.js";
import cspRouter from "./src/csp/cspRouter.js";
import staticRouter from "./src/static/staticRouter.js";
import ejs from "ejs";
import fastifyView from "@fastify/view";
import minifier from "html-minifier";
import { Readable } from "node:stream";
import zlib from "node:zlib";
import { responseSizeRouter } from "./src/responseSize/responseSizeRouter.js";
import { createResponseSizeDecorator } from "./src/responseSize/responseSizeDecorator.js";
import { createCSPDecorator } from "./src/csp/cspDecorator.js";

/**
 * Builds the server but does not start it. Need it for testing API
 */
function buildServer(options: FastifyServerOptions = {}) {
  const fastify = Fastify(options);

  fastify.register(fastifyView, {
    engine: {
      ejs,
    },
    options: {
      useHtmlMinifier: minifier,
    },
  });

  fastify.decorate("csp", createCSPDecorator());
  fastify.decorate("responseSize", createResponseSizeDecorator());

  fastify.addHook("onSend", async function (request, reply, payload) {
    // const MISSING_HEADERS_AND_HTTP = 99;
    function getSizeInfo(original: Buffer | string, compressed?: Buffer | string) {
      if (compressed) {
        reply.header("Content-Length", compressed.length);
        reply.header("Content-Encoding", "br");
      } else {
        compressed = original;
      }
      // let headers = Object.entries(reply.getHeaders()).reduce((p, [e, v]) => p + `${e}: ${v} \n`, "");
      // console.log(request.url, reply.statusCode, "\n", headers);
      return {
        compressed: compressed.length, // + headers.length + MISSING_HEADERS_AND_HTTP,
        uncompressed: original.length, // + headers.length + MISSING_HEADERS_AND_HTTP
      };
    }

    if (request.url.startsWith("/css") || reply.statusCode !== 200 || !fastify.responseSize.use_compression) {
      return payload;
    }

    if (typeof payload === "string") {
      const { uncompressed, compressed } = getSizeInfo(payload);
      fastify.responseSize.add(uncompressed, compressed);
      console.log(
        `onSend: ${request.url} as string with uncompressed size ${uncompressed} sum uncompressed ${fastify.responseSize.size_uncompressed}, compressed ${fastify.responseSize.size_compressed}`
      );
      return payload;
    }

    if (payload instanceof Readable) {
      try {
        const chunks = await payload.toArray();
        const buffer = Buffer.concat(chunks);

        if (buffer.length >= 1024) {
          const compressedBuffer = zlib.brotliCompressSync(buffer);
          const { uncompressed, compressed } = getSizeInfo(buffer, compressedBuffer);
          fastify.responseSize.add(uncompressed, compressed);
          console.log(
            `onSend: ${request.url} as stream with uncompressed size ${uncompressed} compressed ${compressed} sum uncompressed ${fastify.responseSize.size_uncompressed}, compressed ${fastify.responseSize.size_compressed}`
          );
          return compressedBuffer;
        } else {
          const { uncompressed, compressed } = getSizeInfo(buffer);
          fastify.responseSize.add(uncompressed, compressed);
          console.log(
            `onSend: ${request.url} as stream with uncompressed size ${uncompressed} (not compressed since below threshold) sum uncompressed ${fastify.responseSize.size_uncompressed}, compressed ${fastify.responseSize.size_compressed}`
          );
          return buffer;
        }
      } catch (error) {
        console.log("onSend: Error", error);
        return payload;
      }
    }

    console.log("onSend: Unknown payload type", typeof payload, payload);
    return payload;
  });

  fastify.addHook("onRequest", function (request, reply, done) {
    if (request.url.endsWith("index.html")) {
      this.responseSize.reset();
      reply.header("Cross-Origin-Embedder-Policy", "require-corp");
      reply.header("Cross-Origin-Opener-Policy", "same-origin");
    }
    done();
  });

  fastify.register(responseSizeRouter);
  fastify.register(staticRouter);
  fastify.register(frameworksRouter);
  fastify.register(cspRouter, { prefix: "/csp" });

  return fastify;
}

export { buildServer };
