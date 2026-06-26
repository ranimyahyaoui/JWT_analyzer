import express from "express";

import {
  analyzeSecret,
  analyzeJWT,
  analyzeEnv,
  health
} from "../controllers/analyzerController.js";

const router = express.Router();

router.post("/analyze/secret", analyzeSecret);

router.post("/analyze/jwt", analyzeJWT);

router.post("/analyze/env", analyzeEnv);

router.get("/health", health);

export default router;