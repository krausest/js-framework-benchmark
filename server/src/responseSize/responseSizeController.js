/**
 * @typedef {import("fastify").FastifyRequest} Request
 * @typedef {import("fastify").FastifyReply} Reply
 */

/**
 * @param {Request} request
 * @param {Reply} reply
 */
export function getSize(request, reply) {
  console.log("/getSize");
  reply.send({
    size_uncompressed: request.server.responseSize.size_uncompressed,
    size_compressed: request.server.responseSize.size_compressed,
  });
}

/**
 * @param {Request} request
 * @param {Reply} reply
 */
export function enableCompression(request, reply) {
  console.log("/enableCompression");
  request.server.responseSize.enableCompression();
  reply.send("OK");
}

/**
 * @param {Request} request
 * @param {Reply} reply
 */
export function disableCompression(request, reply) {
  console.log("/disableCompression");
  request.server.responseSize.disableCompression();
  reply.send("OK");
}
