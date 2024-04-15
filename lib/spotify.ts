const client_id = process.env.SPOTIFY_CLIENT;
const client_secret = process.env.SPOTIFY_SECRET;

const fetchOptions = {
    method: 'POST',
    headers: {
        'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
        grant_type: "client_credentials"
    }).toString()
};

export default function getToken() {
    return fetch('https://accounts.spotify.com/api/token', fetchOptions)
        .then(res => res.json())
        .then(data => data.access_token)
}