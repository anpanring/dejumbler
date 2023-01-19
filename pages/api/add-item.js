import { Album, Artist, Song } from "../../models/Types";
import dbConnect from "../../lib/mongodb";
import List from "../../models/List";

export default async function handler(req, res) {
    console.log(req.body);

    const data = req.body;
    const listId = data.listId;
    const type = data.type;

    var newItem;

    if (type === 'artist') {
        const { name, image } = data;
        newItem = new Artist({
            name: name,
            artURL: image,
            status: "todo"
        });
    } else if (type === 'track') {
        const { name, artist, image } = data;
        newItem = new Song({
            name: name,
            artist: artist,
            artURL: image,
            status: "todo"
        });
    } else {
        const { name, artist, image } = data;
        newItem = new Album({
            name: name,
            artist: artist,
            artURL: image,
            status: "todo"
        });
    }

    console.log(newItem);

    await dbConnect().then(() => {
        List.findOneAndUpdate({ _id: listId }, { $push: { items: newItem } }, (err, list, count) => {
            if (err) console.log(err);
            else res.status(200).json({ message: "success" });
        });
    });
}