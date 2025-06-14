import express from "express";
import { loginUser } from "../controllers/LoginController.js";

const router = express.Router();

router.post("/login", loginUser);

export default router;
