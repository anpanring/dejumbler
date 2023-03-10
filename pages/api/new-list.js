import { ObjectId } from "bson";
import dbConnect from "../../lib/mongodb";
import List from "../../models/List";

export default async function handler(req, res) {
    await dbConnect();

    const info = req.body;

    new List({
        user: ObjectId('624e59e8dd126d61910fee6d'),
        name: info.name,
        type: info.type,
        description: info.description,
        createdAt: Date.now()
    }).save((err, list, count) => {
        if (err) console.log(err);
        else res.redirect(`/list/${list._id}`);
    });
}

export const config = {
    api: {
        externalResolver: true,
    },
};