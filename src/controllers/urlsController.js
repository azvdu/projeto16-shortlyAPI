import { nanoid } from "nanoid";

import db from "../config/db.js";

export async function shortenUrl(req, res){
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    const link = req.body.url;
    const linkShort = nanoid(8);
    console.log(link)

    try {
        const result = await db.query(`
            SELECT * FROM tokens WHERE token = $1`, [token]);
        if(!result.rows){
            return res.sendStatus(401)
        }
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

export async function openShortUrl(req, res){
    const { linkShort } = req.params;
    try {
        const result = (await db.query(`
            SELECT * FROM links WHERE  "linkShort" = $1`, [linkShort])).rows[0];
        const newVisits = Number(result.visits) + 1;
        if(!result.link){
            return res.sendStatus(404)
        }
        await db.query(`
            UPDATE links SET visits=${newVisits} WHERE "linkShort" = $1`, [linkShort])
        return res.redirect(result.link, 302)
    } catch (error) {
        console.log(error);
        return res.sendStatus(500)
    }
}

export async function deleteUrl(req, res){
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    const { id } = req.params;

    try {
        const result = (await db.query(`
            SELECT * FROM tokens WHERE token = $1`, [token])).rows[0];
            console.log(result)
        const userShortLink = (await db.query(`
            SELECT * FROM links WHERE id = $1`, [id])).rows[0];
        if(!result){
            return res.sendStatus(401);
        }
        if(!userShortLink.linkShort){
            return res.sendStatus(404)
        }
        if(result.userId != userShortLink.userId){
            return res.sendStatus(401);
        } else{
            await db.query(`
                DELETE FROM links WHERE id = $1`, [id])
            return res.sendStatus(204);
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(500)
    }
}