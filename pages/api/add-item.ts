import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
    message: string;
}

// schemas
import { Album, Artist, Movie, Song, Book } from "../../models/Types";
import List from "../../models/List";

import dbConnect from "../../lib/mongodb";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    let listId = req.body.listId;
    
    let newItem;
    if (req.body.type === 'movie') {
        const {
            title,
            poster_path,
        } = req.body;

        newItem = new Movie({
            name: title,
            artURL: `http://image.tmdb.org/t/p/w92${poster_path}`
        });
    } else if (req.body.type === 'book') {
        const { 
            title: bookTitle, 
            author_name, 
            first_publish_year, 
            cover_edition_key, 
            subject 
        } = req.body;

        newItem = new Book({
            name: bookTitle,
            author: author_name.join(', '),
            artURL: `https://covers.openlibrary.org/b/olid/${cover_edition_key}-M.jpg`,
            year: first_publish_year,
            genres: subject.slice(0, 6)
        });
    } else {
        const {
            artists,
            images,
            type,
            name,
            album
        } = req.body;

        // process artists
        const artistNames = artists ? artists.map((artist) => artist.name) : [];

        // process images
        const imageURLs = images ? images.map((image) => image.url) : album.images.map((image) => image.url);

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
    }

    await dbConnect();
    const updatedList = await List.findOneAndUpdate(
        { _id: listId }, // query for list
        { $push: { items: newItem } }, // add new item
        { new: true }, // return updated list
    );
    res.status(200).json(updatedList);
}