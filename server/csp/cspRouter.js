import express from "express";
import bodyParser from "body-parser";

import { addCSP, disableCSP, enableCSP, getCSP } from "./cspControllers.js";

const router = express.Router();

router.use("/csp", bodyParser.json({ type: "application/csp-report" }));

router.get("/startCSP", enableCSP);

router.get("/endCSP", disableCSP);

router.get("/csp", getCSP);

router.post("/csp", addCSP);

export default router;
