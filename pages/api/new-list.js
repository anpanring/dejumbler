import { ObjectId } from "bson";
import dbConnect from "../../lib/mongodb";
import List from "../../models/List";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
    await dbConnect();

    const info = req.body;

    const session = await getServerSession(req, res, authOptions);
    if (session) {
        const { user, expires } = session;
        console.log(user);

        new List({
            user: ObjectId(user.id),
            name: info.name,
            type: info.type,
            description: info.description,
            createdAt: Date.now()
        }).save((err, list, count) => {
            if (err) console.log(err);
            else res.redirect(`/list/${list._id}`);
        });
    } else res.redirect('/');
}

export const config = {
    api: {
        externalResolver: true,
    },
};