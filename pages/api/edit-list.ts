import type { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "../../lib/mongodb";
import List from "../../models/List";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const data = req.body;
        await dbConnect();
        await List.findOneAndUpdate(
            { _id: data.listId },
            {
                $set: {
                    name: data.updatedName,
                    description: data.updatedDescription,
                }
            });
        res.status(200).json({
            name: data.updatedName,
            description: data.updatedDescription
        });
    } catch (err) {
        res.status(401).send({ message: err })
    }
}