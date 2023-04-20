import { Album, Artist, Song } from "../../models/Types";
import dbConnect from "../../lib/mongodb";
import List from "../../models/List";

export default async function handler(req, res) {
    console.log('api/add-items called');

    const data = req.body;
    const {
        listId,
        artists,
        images,
        type,
        name,
        album
    } = data;

    const artistNames = artists ? artists.map((artist) => artist.name) : [];
    const imageURLs = images ? images.map((image) => image.url) : album.images.map((image) => image.url);

    let newItem;
    if (type === 'artist') {
        newItem = new Artist({
            name: name,
            artURL: imageURLs[0],
            status: "todo"
        });
    } else if (type === 'track') {
        newItem = new Song({
            name: name,
            artist: artistNames.join(', '),
            artURL: imageURLs[0],
            status: "todo"
        });
    } else {
        newItem = new Album({
            name: name,
            artist: artistNames.join(', '),
            artURL: imageURLs[0],
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
                else res.status(200).json(list);
            });
    });
}