import dbConnect from "../../lib/mongodb";
import List from "../../models/List";

export default async function handler(req, res) {
    await dbConnect().then(() => {
        const data = req.body;
        console.log(data);

        List.findOneAndUpdate(
            { _id: data.listId, "items._id": data.itemId },
            { $set: { "items.$.notes": data.updatedNotes } })
            .then(() => res.status(200).json({ notes: data.updatedNotes }))
            .catch(err => res.status(401).send({ message: err }));
    });
}