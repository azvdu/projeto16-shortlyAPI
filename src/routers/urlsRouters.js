import { Router } from "express";

import { validateUrl } from "../middlewares/urlsMiddlewares.js";
import { shortenUrl } from "../controllers/urlsController.js";
import { getUrlId } from "../controllers/urlsController.js";

const urlRouter = Router();
urlRouter.post("/urls/shorten", validateUrl, shortenUrl);
urlRouter.get("/urls/:id", getUrlId);


export default urlRouter;