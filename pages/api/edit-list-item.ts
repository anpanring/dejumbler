import type { NextApiRequest, NextApiResponse } from 'next';

import dbConnect from '../../lib/mongodb';
import List from '../../models/List';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const data = req.body;

    await dbConnect();
    await List.findOneAndUpdate(
      { _id: data.listId, 'items._id': data.itemId },
      { $set: { 'items.$.notes': data.updatedNotes } },
    );
    res.status(200).json({ notes: data.updatedNotes });
  } catch (err) {
    res.status(401).send({ message: err });
  }
}
