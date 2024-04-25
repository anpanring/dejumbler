import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import dbConnect from "../../lib/mongodb";
import List from "../../models/List";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {
        query,
        method,
    } = req;

    const queryType = query.type as string;

    const session = await getServerSession(req, res, authOptions);
    if (session) {
        const { user } = session;

        await dbConnect();
        var data: any[];

        if (query.type == "Any") data = await List.find({ user: user.id });
        else {
            const listType = queryType.charAt(0).toUpperCase() + queryType.slice(1);
            data = await List.find({ type: listType, user: user.id });
        }
        res.status(200).json(data);
    } else res.status(401).send("error");
};