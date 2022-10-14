import { Router } from "express";
import userRouter from "./userRouters.js";

const router = Router();
router.use(userRouter);


export default router;