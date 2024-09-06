import { FastifyReply, FastifyRequest } from "fastify";

export function getCSP(request: FastifyRequest, reply: FastifyReply) {
  const { violations } = request.server.csp;

  console.log("CSP violations recorded for", violations);
  reply.send(violations);
}

export function addCSP(request: FastifyRequest, reply: FastifyReply) {
  const { body } = request;
  const { violations } = request.server.csp;

  console.log("/CSP", body);

  // @ts-expect-error - It's better to use a validator
  const uri = body["csp-report"]["document-uri"];
  const frameworkRegEx = /((non-)?keyed\/.*?\/)/;
  let framework = uri.match(frameworkRegEx)[0];
  framework = framework.slice(0, Math.max(0, framework.length - 1));

  if (!violations.includes(framework)) {
    violations.push(framework);
  }
  reply.code(201).send("Created");
}

export function enableCSP(request: FastifyRequest, reply: FastifyReply) {
  console.log("/enableCSP");

  request.server.csp.violations.length = 0;
  request.server.csp.isEnabled = true;
  reply.send("OK");
}

export function disableCSP(request: FastifyRequest, reply: FastifyReply) {
  console.log("/disableCSP");
  request.server.csp.violations.length = 0;
  request.server.csp.isEnabled = false;
  reply.send("OK");
}
