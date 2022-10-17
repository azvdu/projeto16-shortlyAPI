import { Router } from "express";

import { validateUrl } from "../middlewares/urlsMiddlewares.js";
import { shortenUrl } from "../controllers/urlsController.js";

const urlRouter = Router();
urlRouter.post("/urls/shorten", validateUrl, shortenUrl);


export default urlRouter;