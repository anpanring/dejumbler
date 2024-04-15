import { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "../../lib/mongodb";
import List from "../../models/List";

// Endpoint for editing list notes
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await dbConnect()
    const data = req.body;

    return List.findOneAndUpdate(
        { _id: data.listId, "items._id": data.itemId },
        { $set: { "items.$.notes": data.updatedNotes } })
        .then(() => res.status(200).json({ notes: data.updatedNotes }))
        .catch(err => res.status(401).send({ message: err }));
}