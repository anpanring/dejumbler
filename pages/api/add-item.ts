import type { NextApiRequest, NextApiResponse } from "next";

// schemas
import { Album, Artist, Movie, Song, Book } from "../../models/Types";
import List from "../../models/List";

// TS types
import { IAlbum, IArtist, IBook, IItem, IMovie, ISong } from "../../models/definitions.types";
import { HydratedDocument } from "mongoose";

import dbConnect from "../../lib/mongodb";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Object[]>
) {
    let listId = req.body.listId;

    let newItem: HydratedDocument<IItem>;
    if (req.body.type === 'movie') {
        const {
            title,
            poster_path,
        } = req.body;

        const newMovie: HydratedDocument<IMovie> = new Movie({
            name: title,
            artURL: `http://image.tmdb.org/t/p/w92${poster_path}`,
        });
        if(req.body.director) newMovie.director = req.body.director;
        if(req.body.year) newMovie.year = req.body.year;
        newItem = newMovie;
    } else if (req.body.type === 'book') {
        const {
            title: bookTitle,
            author_name,
            first_publish_year,
            cover_edition_key,
            subject
        } = req.body;

        const newBook: HydratedDocument<IBook> = new Book({
            name: bookTitle,
            author: author_name.join(', '),
            artURL: `https://covers.openlibrary.org/b/olid/${cover_edition_key}-M.jpg`,
            year: first_publish_year,
            genres: subject.slice(0, 6)
        });
        newItem = newBook;
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
            const newArtist: HydratedDocument<IArtist> = new Artist<IArtist>({
                name: name,
                artURL: imageURLs[0],
                status: "todo"
            });
            newItem = newArtist;
        } else if (type === 'track') {
            const newSong: HydratedDocument<ISong> = new Song<ISong>({
                name: name,
                artist: artistNames.join(', '),
                artURL: imageURLs[0],
                status: "todo"
            });
            newItem = newSong;
        } else {
            const newAlbum: HydratedDocument<IAlbum> = new Album<IAlbum>({
                name: name,
                artist: artistNames.join(', '),
                artURL: imageURLs[0],
                status: "todo"
            });
            newItem = newAlbum;
        }
    }

    await dbConnect();
    const updatedList: IItem[] =
        await List.findOneAndUpdate(
            { _id: listId },                // query for list
            { $push: { items: newItem } },  // add new item
            { new: true },                  // return updated list
        );

    res.status(200).json(updatedList);
}