const client_id = 'e9bb5c0295e44c878507bac0eec46bd4';
const client_secret = 'e820bae2090542c38de94fe55e8dfbde';

const fetchOptions = {
    method: 'POST',
    headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
        grant_type: 'client_credentials'
    }).toString()
};

export default async function getToken() {
    return await fetch('https://accounts.spotify.com/api/token', fetchOptions)
        .then(response => response.json())
        .then((data) => {
            return data.access_token;
        });
}