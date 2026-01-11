import { FastifyInstance } from "fastify";
import { disableCompression, enableCompression, getSize } from "./responseSizeController.js";

export async function responseSizeRouter(fastify: FastifyInstance) {
  fastify.get("/enableCompression", enableCompression);
  fastify.get("/disableCompression", disableCompression);
  fastify.get("/sizeInfo", getSize);
}
