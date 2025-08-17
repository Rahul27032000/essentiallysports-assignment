import { Router } from "express";
import articleRoutes from "./article.routes.js";

const router = Router();

router.use("/articles", articleRoutes);

export default router;
