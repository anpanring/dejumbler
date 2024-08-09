const client_id = process.env.SPOTIFY_CLIENT;
const client_secret = process.env.SPOTIFY_SECRET;

const fetchOptions = {
  method: 'POST',
  headers: {
    Authorization:
      'Basic ' +
      Buffer.from(client_id + ':' + client_secret).toString('base64'),
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    grant_type: 'client_credentials',
  }).toString(),
};

export default async function getToken() {
  const res = await fetch(
    'https://accounts.spotify.com/api/token',
    fetchOptions,
  );
  const { access_token } = await res.json();
  return access_token;
}
