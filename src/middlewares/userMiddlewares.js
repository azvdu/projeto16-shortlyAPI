import { signUpSchema, signInSchema } from "../schemas/userSchemas.js";

export async function validationSignUp(req, res, next){
    const user = req.body;
    try {
        const validation = signUpSchema.validate(user, {abortEarly: false});
        if(validation.error){
            return res.status(422).send(validation.error.details.map(detail => detail.message));
        }

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
    next();
}

export async function validationSignIn(req, res, next){
    const user = req.body;
    try {
        const validation = signInSchema.validate(user, {abortEarly: false});
        if(validation.error){
            return res.status(422).send(validation.error.details.map(detail => detail.message));
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
    next();
}