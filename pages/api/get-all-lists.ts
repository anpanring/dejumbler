import { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import dbConnect from "../../lib/mongodb";
import List from "../../models/List";

export default async function handler(
    req: NextApiRequest, 
    res: NextApiResponse
) {
    const { query } = req;

    const session = await getServerSession(req, res, authOptions);
    if (session) {
        const { user } = session;

        await dbConnect();
        
        let data;
        const type = query.type as string;
        if (type == "Any") data = await List.find({ user: user.id });
        else {
            const listType = type.charAt(0).toUpperCase() + type.slice(1);
            data = await List.find({ type: listType, user: user.id });
        }
        res.status(200).json(data);
    } else res.status(401).send("");
};