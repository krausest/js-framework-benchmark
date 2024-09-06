import { FastifyReply, FastifyRequest } from "fastify";

export function getSize(request: FastifyRequest, reply: FastifyReply) {
  console.log("/sizeInfo");
  reply.send({
    size_uncompressed: request.server.responseSize.size_uncompressed,
    size_compressed: request.server.responseSize.size_compressed,
  });
}

export function enableCompression(request: FastifyRequest, reply: FastifyReply) {
  console.log("/enableCompression");
  request.server.responseSize.enableCompression();
  reply.send("OK");
}

export function disableCompression(request: FastifyRequest, reply: FastifyReply) {
  console.log("/disableCompression");
  request.server.responseSize.disableCompression();
  reply.send("OK");
}
