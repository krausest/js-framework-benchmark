let violations = [];
let isCSPEnabled = false;

/**
 * @typedef {import("fastify").FastifyRequest} Request
 * @typedef {import("fastify").FastifyReply} Reply
 */

/**
 * @param {Request} request
 * @param {Reply} reply
 */
export function getCSP(_request, reply) {
  console.log("CSP violations recorded for", violations);
  reply.send(violations);
}

/**
 * @param {Request} request
 * @param {Reply} reply
 */
export function addCSP(request, reply) {
  const { body } = request;

  console.log("/CSP ", body);

  const uri = body["csp-report"]["document-uri"];
  const frameworkRegEx = /((non-)?keyed\/.*?\/)/;
  let framework = uri.match(frameworkRegEx)[0];
  framework = framework.substring(0, framework.length - 1);

  if (!violations.includes(framework)) {
    violations.push(framework);
  }
  reply.code(201).send("Created");
}

/**
 * @param {Request} request
 * @param {Reply} reply
 */
export function enableCSP(_request, reply) {
  console.log("/startCSP");
  violations = [];
  isCSPEnabled = true;
  reply.send("OK");
}

/**
 * @param {Request} request
 * @param {Reply} reply
 */
export function disableCSP(_request, reply) {
  console.log("/endCSP");
  violations = [];
  isCSPEnabled = false;
  reply.send("OK");
}

export { isCSPEnabled };
