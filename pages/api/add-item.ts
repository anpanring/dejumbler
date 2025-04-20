import type { NextApiRequest, NextApiResponse } from 'next';
import { Album, Artist, Movie, Song, Book } from '../../models/Types';
import List from '../../models/List';
import {
  IAlbum,
  IArtist,
  IBook,
  IItem,
  IMovie,
  ISong,
} from '../../models/definitions.types';
import { HydratedDocument } from 'mongoose';
import dbConnect from '../../lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    let listId = req.body.currentList;
    let itemData = req.body.data;

    let newItem: HydratedDocument<IItem>;
    if (itemData.type === 'movie') {
      newItem = createMovie(itemData);
    } else if (itemData.type === 'book') {
      newItem = createBook(itemData);
    } else {
      const { type } = itemData;
      if (type === 'artist') {
        newItem = createArtist(itemData);
      } else if (type === 'track') {
        newItem = createSong(itemData);
      } else {
        newItem = createAlbum(itemData);
      }
    }

    await dbConnect();
    const updatedList = await List.findOneAndUpdate(
      { _id: listId }, // query for list
      { $push: { items: newItem } }, // add new item
      { new: true }, // return updated list
    );

    res.status(200).json(updatedList);
  } catch (err) {
    res.status(401).send({ message: err });
  }
}

function createMovie(itemData): HydratedDocument<IMovie> {
  const { title, poster_path } = itemData;

  const newMovie: HydratedDocument<IMovie> = new Movie({
    name: title,
    artURL: `https://image.tmdb.org/t/p/w92${poster_path}`,
  });
  if (itemData.director) newMovie.director = itemData.director;
  if (itemData.year) newMovie.year = itemData.year;
  return newMovie;
}

function createBook(itemData): HydratedDocument<IBook> {
  const {
    title: bookTitle,
    author_name,
    first_publish_year,
    cover_edition_key,
    subject,
  } = itemData;
  return new Book({
    name: bookTitle,
    author: author_name.join(', '),
    artURL: `https://covers.openlibrary.org/b/olid/${cover_edition_key}-M.jpg`,
    year: first_publish_year,
    genres: subject?.slice(0, 6),
  });
}

function createAlbum(itemData): HydratedDocument<IAlbum> {
  const { artists, images, name, album } = itemData;
  const artistNames = artists ? artists.map((artist) => artist.name) : [];
  const imageURLs = images
    ? images.map((image) => image.url)
    : album.images.map((image) => image.url);
  return new Album<IAlbum>({
    name: name,
    artist: artistNames.join(', '),
    artURL: imageURLs[0],
    status: 'todo',
  });
}

function createSong(itemData): HydratedDocument<ISong> {
  const { artists, images, name } = itemData;
  const artistNames = artists ? artists.map((artist) => artist.name) : [];
  const imageURLs = images.map((image) => image.url);
  return new Song<ISong>({
    name: name,
    artist: artistNames.join(', '),
    artURL: imageURLs[0],
    status: 'todo',
  });
}

function createArtist(itemData): HydratedDocument<IArtist> {
  const { images, name } = itemData;
  const imageURLs = images.map((image) => image.url);
  return new Artist<IArtist>({
    name: name,
    artURL: imageURLs[0],
    status: 'todo',
  });
}
