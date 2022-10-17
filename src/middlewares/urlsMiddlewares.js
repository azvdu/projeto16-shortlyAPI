import shortenUrlSchemas from "../schemas/urlsSchemas.js";

export async function validateUrl(req, res, next){
    const link = req.body;
    try {
        const validation = shortenUrlSchemas.validate(link, {abortEarly: false});
        if(validation.error){
            return res.status(422).send(validation.error.details.map(detail => detail.message));
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(500)
    }
    next()
}