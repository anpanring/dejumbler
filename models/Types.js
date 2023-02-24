import Item from "./Item";
import mongoose from "mongoose";

if (mongoose.modelNames().includes('Album')) {
    mongoose.deleteModel('Album');
    mongoose.deleteModel('Artist');
    mongoose.deleteModel('Song');
}

if (Item.discriminators && 'Album' in Item.discriminators) {
    delete Item.discriminators.Album;
    delete Item.discriminators.Artist;
    delete Item.discriminators.Song;
}

//Album inherits Item properties
const AlbumSchema = Item.discriminator('Album', new mongoose.Schema({
    artist: { type: String, required: true },
    lengthMins: { type: Number },
    year: { type: String },
}));
// }

//Artist inherits Item properties
// if (mongoose.models.Artist) mongoose.deleteModel("Artist");
const ArtistSchema = Item.discriminator('Artist', new mongoose.Schema({
    genres: [String], //string array for artist's genres
}));
// }

//Book inherits Item properties
if (!mongoose.models.Book) {
    const BookSchema = Item.discriminator('Book', new mongoose.Schema({
        author: { type: String, required: true },
        year: { type: String },
        genres: [String],
    }));
}

//Movie inherits Item properties
if (!mongoose.models.Movie) {
    const MovieSchema = Item.discriminator('Movie', new mongoose.Schema({
        director: { type: String, required: true },
        lengthMins: { type: Number },
        year: { type: String },
    }));
}

//Song inherits Item properties
const SongSchema = Item.discriminator('Song', new mongoose.Schema({
    artist: { type: String, required: true },
    album: { type: String },
    lengthMins: { type: Number },
}));
// }

// User.plugin(passportLocalMongoose);
// List.plugin(URLSlugs('name'));

export const Album = mongoose.models.Album || mongoose.model('Album', AlbumSchema);
export const Artist = mongoose.models.Artist || mongoose.model('Artist', ArtistSchema);
export const Book = mongoose.models.Book || mongoose.model('Book', BookSchema);
export const Movie = mongoose.models.Movie || mongoose.model('Movie', MovieSchema);
export const Song = mongoose.models.Song || mongoose.model('Song', SongSchema);