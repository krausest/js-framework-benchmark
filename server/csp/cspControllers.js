let violations = [];
let isCSPEnabled = false;

/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 */

/**
 * @param {Request} req
 * @param {Response} res
 */
export function getCSP(req, res) {
  console.log("CSP violations recorded for", violations);
  res.send(violations);
}

/**
 * @param {Request} req
 * @param {Response} res
 */
export function addCSP(req, res) {
  console.log("/CSP ", req.body);
  const uri = req.body["csp-report"]["document-uri"];
  const frameworkRegEx = /((non-)?keyed\/.*?\/)/;
  const framework = uri.match(frameworkRegEx)[0];
  if (!violations.includes(framework)) {
    violations.push(framework);
  }
  res.sendStatus(201);
}

/**
 * @param {Request} req
 * @param {Response} res
 */
export function enableCSP(req, res) {
  console.log("/startCSP");
  violations = [];
  isCSPEnabled = true;
  res.send("OK");
}

/**
 * @param {Request} req
 * @param {Response} res
 */
export function disableCSP(req, res) {
  console.log("/endCSP");
  violations = [];
  isCSPEnabled = false;
  res.send("OK");
}

export { isCSPEnabled };
