import dbConnect from "../../lib/mongodb";
import List from "../../models/List";

export default async function handler(req, res) {
    const {
        query,
        method,
    } = req;

    await dbConnect();
    var data;

    if (query.type == "Any") data = await List.find({});
    else {
        var listType = query.type.charAt(0).toUpperCase() + query.type.slice(1);
        data = await List.find({ type: listType });
    }
    res.status(200).json(data);
};