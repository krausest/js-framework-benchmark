/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 * @typedef {import("express").NextFunction} Next
 */

/**
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 */
function addSiteIsolationForIndex(req, res, next) {
  if (req.path.endsWith("/index.html")) {
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  }
  next();
}

export { addSiteIsolationForIndex };
