import express from "express";
import { processArticleController, processArticleControllerForAllProviders } from "../controllers/article.controller.js";

const router = express.Router();

router.post("/process-all", processArticleControllerForAllProviders);
router.post("/process", processArticleController);

export default router;
