import Joi from "joi";

export const shortenUrlSchemas = Joi.object({
    url: Joi.string().uri().required()
});


export default shortenUrlSchemas;