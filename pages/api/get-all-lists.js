import dbConnect from "../../lib/mongodb";
import List from "../../models/List";

export default async function handler(req, res) {
    const {
        query,
        method,
    } = req;

    // console.log('Type: ' + id);
    // res.status(200).json({ type: id });

    await dbConnect();
    let data;

    if (query.type == "Any") data = await List.find({});
    else data = await List.find({ type: query.type.charAt(0).toUpperCase() + query.type.slice(1) });
    res.status(200).json(data);
};