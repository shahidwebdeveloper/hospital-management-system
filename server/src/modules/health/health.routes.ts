import { Router } from "express";

import { apiResponse } from "../../utils/api-response.js";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json(
    apiResponse({
      service: "hms-api",
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    })
  );
});
