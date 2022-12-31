export default function SearchBar(props) {
    if (props.type == 'Music') {
        return (
            <form action="/list/{{slug}}/search" method="POST">
                <input type="text" name="search" placeholder="Search Spotify..." required />
                <label>Type: </label>
                <input list="types" name="type" required />
                <datalist id="types">
                    <option value="track" />
                    <option value="artist" />
                    <option value="album" />
                </datalist>
                <input type="submit" value="Search" />
            </form>
        );
    }
}