import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import dbConnect from "../../lib/mongodb";
import List from "../../models/List";

export default async function handler(req, res) {
    const {
        query,
        method,
    } = req;

    const session = await getServerSession(req, res, authOptions);
    if (session) {
        const { user, expires } = session;

        await dbConnect();
        var data;

        if (query.type == "Any") data = await List.find({ user: user.email });
        else {
            const listType = query.type.charAt(0).toUpperCase() + query.type.slice(1);
            data = await List.find({ type: listType, user: user.email });
        }
        res.status(200).json(data);
    } else res.status(401).send();
};