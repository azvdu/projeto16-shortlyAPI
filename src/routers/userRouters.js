import { Router } from "express";

import { signIn, signUp, dataUser, ranking } from "../controllers/userController.js";
import { validationSignIn, validationSignUp } from "../middlewares/userMiddlewares.js";

const userRouter = Router();
userRouter.post("/sign-up", validationSignUp, signUp);
userRouter.post("/sign-in", validationSignIn, signIn);
userRouter.get("/users/me", dataUser);
userRouter.get("/ranking", ranking);

export default userRouter;