import { Router } from "express";

import { validateUrl } from "../middlewares/urlsMiddlewares.js";
import { shortenUrl, getUrlId, openShortUrl } from "../controllers/urlsController.js";

const urlRouter = Router();
urlRouter.post("/urls/shorten", validateUrl, shortenUrl);
urlRouter.get("/urls/:id", getUrlId);
urlRouter.get("/urls/open/:linkShort", openShortUrl);



export default urlRouter;