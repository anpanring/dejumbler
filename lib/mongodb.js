import mongoose from 'mongoose';

// const URLSlugs = require('mongoose-url-slugs')
// passportLocalMongoose = require('passport-local-mongoose');

// //Album inherits Item properties
// const AlbumSchema = Item.discriminator('Album', new mongoose.Schema({
//     artist: { type: String, required: true },
//     lengthMins: { type: Number },
//     year: { type: String },
// }));

// //Artist inherits Item properties
// const ArtistSchema = Item.discriminator('Artist', new mongoose.Schema({
//     genres: [String], //string array for artist's genres
// }));

// //Book inherits Item properties
// const BookSchema = Item.discriminator('Book', new mongoose.Schema({
//     author: { type: String, required: true },
//     year: { type: String },
//     genres: [String],
// }));

// //Movie inherits Item properties
// const MovieSchema = Item.discriminator('Movie', new mongoose.Schema({
//     director: { type: String, required: true },
//     lengthMins: { type: Number },
//     year: { type: String },
// }));

// //Song inherits Item properties
// const SongSchema = Item.discriminator('Song', new mongoose.Schema({
//     artist: { type: String, required: true },
//     album: { type: String },
//     lengthMins: { type: Number },
// }));

// User.plugin(passportLocalMongoose);
// List.plugin(URLSlugs('name'));

// mongoose.model('Album', AlbumSchema);
// mongoose.model('Artist', ArtistSchema);
// mongoose.model('Book', BookSchema);
// mongoose.model('Movie', MovieSchema);
// mongoose.model('Song', SongSchema);

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        }

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;