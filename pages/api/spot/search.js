import getToken from "../../../lib/spotify";

export default async function handler(req, res) {
    console.log(req.body);

    const accessToken = await getToken();

    const fetchOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    };

    const response = await fetch('https://api.spotify.com/v1/search?' +
        new URLSearchParams({
            q: req.body.value,
            type: req.body.type,
        }).toString(), fetchOptions);

    const body = await response.json();
    console.log('Spotify Search response: ', body);
}