import type { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "../../lib/mongodb";
import List from "../../models/List";

import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Object[]>
) {
    const { query, method } = req;

    // Check logged in
    const session = await getServerSession(req, res, authOptions);

    if (session) {
        const { user } = session;

        const data: Object[] = await dbConnect()
            .then(() => List.findByIdAndDelete(query.id))
            .then(() => List.find({ user: user.id }));

        res.status(200).json(data);
    } else res.status(401);
};