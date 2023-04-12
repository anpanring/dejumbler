import getToken from "../../../lib/spotify";

export default async function handler(req, res) {
    const {
        query,
        method,
    } = req;

    const accessToken = await getToken();;
    // if (!localStorage.getItem("spotToken")) {
    //     console.log(localStorage.getItem("spotToken"));
    //     const token = await getToken();
    //     localStorage.setItem("spotToken", token);
    //     accessToken = localStorage.getItem("spotToken");
    // } else {
    //     accessToken = localStorage.getItem("spotToken");
    //     console.log(localStorage.getItem("spotToken"));
    // }

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

    const data = await fetch('https://api.spotify.com/v1/search?' +
        new URLSearchParams({
            q: query.q,
            type: type,
            limit: 6,
        }).toString(), fetchOptions)
        .then(res => res.json());

    let list = [];
    if (query.type == 'all') {
        data.albums.items.slice(0, 2).map(album => list.push(album));
        data.tracks.items.slice(0, 2).map(track => list.push(track));
        data.artists.items.slice(0, 2).map(artist => list.push(artist));
    }
    else list = data[`${query.type}s`].items;

    console.log(list);

    res.status(200).json(list);
}