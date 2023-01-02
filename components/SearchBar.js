import getToken from "../lib/spotify";
import Image from "next/image";
import React, { useCallback, useRef, useState } from "react";

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            apiToken: ''
        }
    }

    async componentDidMount() {
        const token = await getToken();

        this.setState({
            apiToken: token
        });
    }

    spotSearch = async (event) => {
        event.preventDefault();

        const fetchOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.apiToken
            }
        };

        const response = await fetch('https://api.spotify.com/v1/search?' +
            new URLSearchParams({
                q: event.target.value.value,
                type: event.target.type.value,
            }).toString(), fetchOptions);

        var body = await response.json();
        const type = event.target.type.value;

        body = body[`${type.toLowerCase()}s`].items.slice(0, 5);

        const results = []
        body.map((item) => {
            let temp = {}
            temp.name = item.name;
            if (type == 'track') {
                temp.image = item.album.images[2].url;
                temp.artist = ' - ' + item.artists.map((artist) => {
                    return artist.name;
                }).toString();
            } else if (type == 'artist') {
                temp.image = item.images[2].url;
            } else {
                temp.image = item.images[2].url;
                temp.artist = ' - ' + item.artists.map((artist) => {
                    return artist.name;
                }).toString();
            }
            results.push(temp);
        });

        this.setState({
            results
        });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.spotSearch}>
                    <input type="text" name="value" placeholder="Search Spotify..." required />
                    <label>Type: </label>
                    <select id="types" list="types" name="type" required>
                        <option value="track">Track</option>
                        <option value="artist">Artist</option>
                        <option value="album">Album</option>
                    </select>
                    <input type="submit" value="Search" />
                </form>
                <div>
                    {this.state.results.map((result) => {
                        return (
                            <div>
                                <img src={result.image} />
                                <p>{result.name}{result.artist}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default SearchBar;