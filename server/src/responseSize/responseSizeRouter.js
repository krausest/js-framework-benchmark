import { disableCompression, enableCompression, getSize } from "./responseSizeController.js";

export async function responseSizeRouter(fastify) {
  fastify.get("/enableCompression", enableCompression);
  fastify.get("/disableCompression", disableCompression);
  fastify.get("/sizeInfo", getSize);
}
