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
                INSERT INTO tokens ("userId", token)
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

export async function dataUser(req, res){
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    try {
        const validToken = (await db.query(`
            SELECT * FROM tokens WHERE token = $1`, [token])).rows[0];

        if(!validToken){
            return res.sendStatus(401)
        }

        const result = (await db.query(`
            SELECT * FROM links WHERE "userId" = $1`, [validToken.userId])).rows

        const user = (await db.query(`
            SELECT * FROM users WHERE id = $1`, [validToken.userId])).rows[0]

        const body = {
            id: user.id,
            name: user.name,
            visitCount: 0,
            shortenedUrls: []

        }
        body.shortenedUrls = result.map((result) => ({
            id: result.id,
			shortUrl: result.linkShort,
			url: result.link,
			visitCount: result.visits
        }))

        for (let i = 0; i < body.shortenedUrls.length; i++) {
            body.visitCount += body.shortenedUrls[i].visitCount
        }

        return res.status(200).send(body);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500)
    }
}

export async function ranking(req, res){
    try {
        const ranking = (await db.query(`
            SELECT users.id, users.name, COUNT(links.id) AS "linksCount", SUM(links.visits) AS "visitCount"
            FROM users JOIN links ON users.id = links."userId" GROUP BY users.id ORDER BY "visitCount" DESC LIMIT(10)`)).rows;
        return res.status(200).send(ranking);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500)
    }
}