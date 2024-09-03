// @ts-check

/**
 * @typedef {import("fastify").FastifyRequest} Request
 * @typedef {import("fastify").FastifyReply} Reply
 */

/** @type {string[]} */
const violations = [];
let isCSPEnabled = false;

/**
 * @param {Request} request
 * @param {Reply} reply
 */
export function getCSP(request, reply) {
  console.log("CSP violations recorded for", violations);
  reply.send(violations);
}

/**
 * @param {Request} request
 * @param {Reply} reply
 */
export function addCSP(request, reply) {
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

/**
 * @param {Request} request
 * @param {Reply} reply
 */
export function enableCSP(request, reply) {
  console.log("/enableCSP");
  violations.length = 0;
  isCSPEnabled = true;
  reply.send("OK");
}

/**
 * @param {Request} request
 * @param {Reply} reply
 */
export function disableCSP(request, reply) {
  console.log("/disableCSP");
  violations.length = 0;
  isCSPEnabled = false;
  reply.send("OK");
}

export { isCSPEnabled };
