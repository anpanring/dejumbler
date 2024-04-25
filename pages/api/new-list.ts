import type { NextApiRequest, NextApiResponse } from "next";

import { ObjectId } from "bson";
import dbConnect from "../../lib/mongodb";
import List from "../../models/List";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await dbConnect();

    const info = req.body;

    const session = await getServerSession(req, res, authOptions);
    if (session) {
        const { user } = session;

        new List({
            user: new ObjectId(user.id),
            name: info.name,
            type: info.type,
            description: info.description,
            createdAt: Date.now()
        }).save((err, list) => {
            if (err) console.log(err);
            else res.redirect(`/list/${list._id}`);  // redirect to new page on creation
        });
    } else res.redirect('/');
}

export const config = {
    api: {
        externalResolver: true,
    },
};