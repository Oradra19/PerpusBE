import express from "express";
import { countVisitor, getVisitorStats } from "../controllers/VisitorStatsController.js";

const router = express.Router();

router.post("/count", countVisitor);
router.get("/stats", getVisitorStats);

export default router;
