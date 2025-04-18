import type { NextApiRequest, NextApiResponse } from 'next';

import dbConnect from '../../lib/mongodb';
import List from '../../models/List';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { list, item } = req.query;

    await dbConnect();
    const updatedData = await List.findOneAndUpdate(
      { _id: list },
      { $pull: { items: { _id: item } } },
      { new: true },
    );

    res.status(200).json(updatedData);
  } catch (err) {
    res.status(401).send({ message: err });
  }
}
