export function getSize(request, reply) {
  console.log("/getSize");
  reply.send({
    size_uncompressed: request.server.responseSize.size_uncompressed,
    size_compressed: request.server.responseSize.size_compressed,
  });
}

export function enableCompression(request, reply) {
  console.log("/enableCompression");
  request.server.responseSize.enableCompression(true);
  reply.send("OK");
}

export function disableCompression(request, reply) {
  console.log("/disableCompression");
  request.server.responseSize.enableCompression(false);
  reply.send("OK");
}
