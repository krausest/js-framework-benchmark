import { FastifyReply, FastifyRequest } from "fastify";

const violations: string[] = [];
let isCSPEnabled = false;

export function getCSP(request: FastifyRequest, reply: FastifyReply) {
  console.log("CSP violations recorded for", violations);
  reply.send(violations);
}

export function addCSP(request: FastifyRequest, reply: FastifyReply) {
  const { body } = request;

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
  violations.length = 0;
  isCSPEnabled = true;
  reply.send("OK");
}

export function disableCSP(request: FastifyRequest, reply: FastifyReply) {
  console.log("/disableCSP");
  violations.length = 0;
  isCSPEnabled = false;
  reply.send("OK");
}

export { isCSPEnabled };
