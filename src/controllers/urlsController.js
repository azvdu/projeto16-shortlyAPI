import { nanoid } from "nanoid";

import db from "../config/db.js";

export async function shortenUrl(req, res){
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    const link = req.body;
    const linkShort = nanoid(8);

    try {
        const result = await db.query(`SELECT * FROM tokens WHERE token = $1`, [token]);
 
        await db.query(`
            INSERT INTO links (link, "linkShort", "userId", visits)
            VALUES ($1, $2, $3, $4)`, [link, linkShort, result.rows[0].userId, 0])
        return res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function getUrlId(req, res){
    const { id } = req.params;

    try {
        const result = (await db.query(`
        SELECT id, "linkShort", link FROM links WHERE id = $1`, [id])).rows[0];
        if(!result){
            return res.sendStatus(404);
        }
        return res.status(200).send(result);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500)
    }
}