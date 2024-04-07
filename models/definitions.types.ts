import { Types } from "mongoose"

export interface IUser {
    username: string;
    password: string;
    salt: string;
    lists: Types.ObjectId[];
}

export interface IList {
    user: Types.ObjectId;
    name: string;
    type: "Books" | "Movies" | "Music" | "Any";
    description?: string;
    createdAt: Date;
    items: IItem[];
}

export interface IItem {
    name: string;
    artURL?: string;
    status?: "todo" | "in progress" | "done";
    notes?: string;
}

export interface IAlbum extends IItem {
    artist: string;
    lengthMins?: number;
    year?: string;
}

export interface IArtist extends IItem {
    genres?: string[];
}

export interface ISong extends IItem {
    artist: string;
    album?: string;
    lengthMins?: number;
}

export interface IBook extends IItem {
    author: string;
    year: string;
    genres: string[];
}

export interface IMovie extends IItem {
    director?: string;
    lengthMins?: number;
    year?: string;
}