import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "./auth/[...nextauth]";
import dbConnect from "../../lib/mongodb";
import List from "../../models/List";
import { ObjectId } from "mongodb";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { query } = req;
    const queryType = query.type as string;

    const session = await getServerSession(req, res, authOptions);
    if (!session) res.status(401).send("not authorized");

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

            var data: any[];
            await dbConnect();
            if (query.type == "Any") data = await List.find({ user: user.id });
            else {
                const listType = queryType.charAt(0).toUpperCase() + queryType.slice(1);
                data = await List.find({ type: listType, user: user.id });
            }
            console.log(data);
            res.status(200).json(data);
        } catch (err) {
            res.status(401).send({ message: err });
        }
    }
};