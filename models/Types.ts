import Item from './Item';
import mongoose from 'mongoose';

import { IAlbum, IArtist, IBook, IMovie, ISong } from './definitions.types';

const options = { discriminatorKey: 'kind' };

// console.log("Mongoose Models: ", mongoose.modelNames());
if (mongoose.modelNames().includes('Album')) {
  mongoose.deleteModel('Album');
  mongoose.deleteModel('Artist');
  mongoose.deleteModel('Song');
  mongoose.deleteModel('Book');
  mongoose.deleteModel('Movie');
}

if (Item.discriminators && 'Album' in Item.discriminators) {
  delete Item.discriminators.Album;
  delete Item.discriminators.Artist;
  delete Item.discriminators.Song;
  delete Item.discriminators.Book;
  delete Item.discriminators.Movie;
}

// Album inherits Item properties
const AlbumSchema = Item.discriminator<IAlbum>(
  'Album',
  new mongoose.Schema(
    {
      artist: { type: String, required: true },
      lengthMins: { type: Number },
      year: { type: String },
    },
    options,
  ),
);
// }

// Artist inherits Item properties
// if (mongoose.models.Artist) mongoose.deleteModel("Artist");
const ArtistSchema = Item.discriminator<IArtist>(
  'Artist',
  new mongoose.Schema(
    {
      genres: [String], //string array for artist's genres
    },
    options,
  ),
);
// }

// Song inherits Item properties
const SongSchema = Item.discriminator<ISong>(
  'Song',
  new mongoose.Schema(
    {
      artist: { type: String, required: true },
      album: { type: String },
      lengthMins: { type: Number },
    },
    options,
  ),
);
// }

// Book inherits Item properties
// if (!mongoose.models.Book) {
const BookSchema = Item.discriminator<IBook>(
  'Book',
  new mongoose.Schema(
    {
      author: { type: String, required: true },
      year: { type: String },
      genres: [String],
    },
    options,
  ),
);
// }

// Movie inherits Item properties
// if (!mongoose.models.Movie) {
const MovieSchema = Item.discriminator<IMovie>(
  'Movie',
  new mongoose.Schema(
    {
      director: { type: String, required: true },
      lengthMins: { type: Number },
      year: { type: String },
    },
    options,
  ),
);
// }

// User.plugin(passportLocalMongoose);
// List.plugin(URLSlugs('name'));

export const Album = mongoose.models.Album || AlbumSchema;
export const Artist = mongoose.models.Artist || ArtistSchema;
export const Book = mongoose.models.Book || BookSchema;
export const Movie = mongoose.models.Movie || MovieSchema;
export const Song = mongoose.models.Song || SongSchema;
