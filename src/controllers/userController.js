import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

import db from "../config/db.js";

export async function signUp(req, res){
    const user = req.body;
    try {
        const result = await db.query(`SELECT * FROM users WHERE email = $1`, [user.email]);
        if(result.rowCount > 0){
            return res.sendStatus(409);
        }

        const SALT = Number(process.env.SALT);
        const { name, email, password } = user
        const passwordCrypt = bcrypt.hashSync(password, SALT);

        await db.query(`
            INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3)
            `, [name, email, passwordCrypt]);

        return res.sendStatus(201)

    } catch (error) {
        console.log(error);
        return res.sendStatus(500)
    }
}


export async function signIn(req, res){
    const { email, password } = req.body;

    try {
        const result = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
        const passwordValid = bcrypt.compareSync(password, result.rows[0].password);

        if(result && passwordValid){
            const token = uuid();
            const userId = result.rows[0].id;
            await db.query(`
                INSERT INTO tokens ('userId', value)
                VALUES ($1, $2)`, [userId, token]);
            return res.status(200).send(token);
        } else{
            return res.status(401).send("e-mail ou senha incorretos");
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(500)
    }
}