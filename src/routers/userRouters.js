import { Router } from "express";

import { signIn, signUp } from "../controllers/userController.js";
import { validationSignIn, validateSignUp } from "../middlewares/userMiddlewares.js";

const userRouter = Router();
userRouter.post("/sign-up", validateSignUp, signUp);
userRouter.post("/sign-in", validationSignIn, signIn);

export default userRouter;