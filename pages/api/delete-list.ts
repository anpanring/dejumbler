import type { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "../../lib/mongodb";
import List from "../../models/List";

import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Object[] | string>
) {
    const { query } = req;

    // Check logged in
    const session = await getServerSession(req, res, authOptions);

    if (!session) res.status(401).send("Unauthorized");
    else {
        const { user } = session;

        await dbConnect();
        await List.findByIdAndDelete(query.id);
        const editedList = await List.find({ user: user.id });

        res.status(200).json(editedList);
    }
};