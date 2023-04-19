import { Album, Artist, Song } from "../../models/Types";
import dbConnect from "../../lib/mongodb";
import List from "../../models/List";

export default async function handler(req, res) {
    console.log('api/add-items called');

    const data = req.body;
    const { listId, type } = data;

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
        List.findOneAndUpdate(
            { _id: listId }, // query for list
            { $push: { items: newItem } }, // add new item
            { new: true }, // return updated list
            (err, list, count) => { // callback function
                if (err) res.status(401).send();
                else {
                    console.log(list);
                    res.status(200).json(list);
                }
            });
    });
}