import express from "express";

import { loadFrameworkVersionInformation } from "./frameworksControllers.js";

const router = express.Router();

router.get("/ls", async (req, res) => {
  performance.mark("Start");

  const frameworks = await loadFrameworkVersionInformation();
  res.send(frameworks);

  performance.mark("End");
  const executionTime = performance.measure(
    "/ls duration measurement",
    "Start",
    "End"
  ).duration;

  console.log(`/ls duration: ${executionTime}ms`);
});

export default router;
