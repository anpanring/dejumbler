import type { NextApiRequest, NextApiResponse } from 'next';

import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { authOptions } from './auth/[...nextauth]';
import dbConnect from '../../lib/mongodb';
import List from '../../models/List';
import { ListData } from '@/types/dejumbler-types';

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query } = req;

  const session = await getServerSession(req, res, authOptions);
  if (!session) res.status(401).send('not authorized');
  else {
    try {
      const { user } = session;
      // const token = await getToken({ req, secret });
      // console.log(token);
      // let userId = user.id.length == 21 ? user.id: new ObjectId(user.id);
      // console.log(userId);

      // working on google auth
      // if (user.id.length == 21) {
      //     userId = new ObjectId(user.id);
      //     // res.status(200).json([]);
      // }

      await dbConnect();
      const data: ListData[] = await List.find({ user: user.id });
      console.log(data);
      res.status(200).json(data);
    } catch (err) {
      res.status(401).send({ message: err });
    }
  }
}
