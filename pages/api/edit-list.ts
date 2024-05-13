import type { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "../../lib/mongodb";
import List from "../../models/List";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const {
            listId,
            updatedName,
            updatedDescription
        } = req.body;

        await dbConnect();
        await List.findOneAndUpdate(
            { _id: listId },
            {
                $set: {
                    name: updatedName,
                    description: updatedDescription,
                }
            });
            
        res.status(200).json({
            name: updatedName,
            description: updatedDescription
        });
    } catch (err) {
        res.status(401).send({ message: err })
    }
}