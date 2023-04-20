import dbConnect from "../../lib/mongodb";
import List from "../../models/List";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
    const {
        query,
        method,
    } = req;

    // Check logged in
    const session = await getServerSession(req, res, authOptions);

    if(session) {
        const { user } = session;

        await dbConnect();

        const data = await List.findByIdAndDelete(query.id)
            .then(() => List.find({ user: user.email }));

        res.status(200).json(data);
    } else res.status(401).send();
};