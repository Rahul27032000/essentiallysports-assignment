// routes/article.routes.js
import express from "express";
import { processArticleController } from "../controllers/article.controller.js";

const router = express.Router();

router.post("/process", processArticleController);

export default router;
