import dbConnect from "../../lib/mongodb";
import List from "../../models/List";

export default async function handler(req, res) {

    const listId = req.body.listId;
    const itemId = req.body._id;

    await dbConnect();
    const updatedData = await List.findOneAndUpdate(
        { _id: listId },
        { $pull: { items: { _id: itemId } } },
        { new: true }
    );

    res.status(200).json(updatedData);
};