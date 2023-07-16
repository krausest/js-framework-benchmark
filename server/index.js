import express from "express";
import path from "path";
import { cwd } from "process";

import { addSiteIsolationForIndex } from "./middlewares/addSiteIsolationForIndex.js";
import frameworksRouter from "./frameworks/frameworksRouter.js";
import cspRouter from "./csp/cspRouter.js";
import { isCSPEnabled } from "./csp/cspControllers.js";
import { frameworksDirectory } from "./config/directories.js";

const app = express();
const PORT = 8080;

const webDriverResultDirectory = path.join(cwd(), "..", "webdriver-ts-results");

app.use(express.json());
app.use(addSiteIsolationForIndex);

app.use(
  "/frameworks",
  express.static(frameworksDirectory, {
    setHeaders: (res, path) => {
      if (isCSPEnabled && path.endsWith("index.html")) {
        console.log("adding CSP to ", path);
        res.setHeader(
          "Content-Security-Policy",
          "default-src 'self'; report-uri /csp"
        );
      }
    },
  })
);
app.use("/webdriver-ts-results", express.static(webDriverResultDirectory));
app.use("/css", express.static(path.join(frameworksDirectory, "..", "css")));

app.use(frameworksRouter);
app.use(cspRouter);

app.get("/index.html", (req, res) => {
  const indexHTMLPath = path.join(cwd(), "..", "index.html");
  res.sendFile(indexHTMLPath);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
