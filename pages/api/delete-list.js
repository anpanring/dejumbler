import dbConnect from "../../lib/mongodb";
import List from "../../models/List";

export default async function handler(req, res) {
    const {
        query,
        method,
    } = req;

    await dbConnect();

    const data = await List.findByIdAndDelete(query.id)
        .then(() => List.find({}));

    res.status(200).json(data);
};