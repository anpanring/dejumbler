import type { NextApiRequest, NextApiResponse } from "next";

import getToken from "../../../lib/spotify";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { query } = req;

    const accessToken = await getToken();

    const fetchOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    };

    const type = query.type == 'all'
        ? 'album,track,artist'
        : query.type;

    const q = query.q as string;

    const response = await fetch('https://api.spotify.com/v1/search?' +
        new URLSearchParams({
            q: q ? Array.isArray(q) ? q.join(", ") : q : '',
            type: type ? Array.isArray(type) ? type.join(", ") : type : '',
            limit: "6",
        }).toString(), fetchOptions)
    const data = await response.json();

    if(data.error) res.status(401).json(data.error);
    else {
        let list: any[] = [];
        if (query.type == 'all') {
            data.albums.items.slice(0, 2).map(album => list.push(album));
            data.tracks.items.slice(0, 2).map(track => list.push(track));
            data.artists.items.slice(0, 2).map(artist => list.push(artist));
        }
        else list = data[`${query.type}s`].items;

        res.status(200).json(list);
    }
}