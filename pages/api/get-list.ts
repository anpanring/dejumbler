import { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import dbConnect from "../../lib/mongodb";
import List from "../../models/List";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Object[]>
) {
    const {
        query,
        method,
    } = req;

    const session = await getServerSession(req, res, authOptions);
    if (session) {
        const { user, expires } = session;

        await dbConnect();
        const data = await List.findById(query.id);
        res.status(200).json(data);
    } else res.status(401).send([]);
};