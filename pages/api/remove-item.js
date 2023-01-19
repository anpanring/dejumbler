import dbConnect from "../../lib/mongodb";
import List from "../../models/List";

export default async function handler(req, res) {

    const listId = req.body.listId;
    const id = req.body._id;
    const type = req.body.__t;

    console.log('listId: ', listId);
    console.log('id: ', id);

    await dbConnect().then(() => {
        List.updateOne({ _id: listId }, {
            $pull: {
                items: { _id: id },
            },
        }, (err, results) => {
            if (err) console.log(err);
            else res.status(200).json({ message: "success" });
        });
    });
}