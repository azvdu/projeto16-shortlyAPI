import { Router } from "express";
import urlRouter from "./urlsRouters.js";
import userRouter from "./userRouters.js";

const router = Router();
router.use(userRouter);
router.use(urlRouter);

export default router;