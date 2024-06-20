import { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import dbConnect from "../../lib/mongodb";
import List from "../../models/List";
import { HydratedDocument } from "mongoose";
import { IList } from "../../models/definitions.types";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { query } = req;

    const session = await getServerSession(req, res, authOptions);

    if (!session) res.status(401).send("not authorized");
    else {
        const { user } = session;

        try {
            await dbConnect();
            const data = await List.findById(query.id);
            res.status(200).json(data);
        } catch (err) {
            res.status(401).send({ message: err });
        }
    }
};