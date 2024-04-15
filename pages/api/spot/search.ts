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

    const type = query.type == 'all' ? 'album,track,artist' : query.type;

    // using await to get the value of the last promise
    fetch('https://api.spotify.com/v1/search?' +
        new URLSearchParams({
            q: query.q as string,
            type: type as string,
            limit: "6",
        }).toString(), fetchOptions)
        .then(res => res.json())
        .then((data) => {
            if (data.error) res.status(401).send("");
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
        })
}