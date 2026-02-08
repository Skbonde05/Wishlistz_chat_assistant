import express from "express";
import { recommendController } from "../controllers/recommendController.js";

const router = express.Router();

router.post("/chat", recommendController); 

export default router;
