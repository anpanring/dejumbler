import getToken from "../lib/spotify";
import React, { useEffect, useState } from "react";
import styles from "./search.module.css";
import Image from "next/image";

function SearchResult({ data, listId, handleDataChange }) {
    const {
        artists,
        images,
        type,
        name,
        album
    } = data;

    const artistNames = artists ? artists.map((artist) => artist.name) : [];
    const imageURLs = images
        ? images.map((image) => image.url)
        : album.images.map((image) => image.url);

    async function addToList(data, listId) {
        data.listId = listId;
        data = JSON.stringify(data);

        const fetchOptions = {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
            },
            body: data
        };

        fetch('/api/add-item', fetchOptions)
            .then(res => res.json())
            .then(data => handleDataChange(data));
    }

    return (
        <div className={styles.searchResultsWrapper}>
            <Image src={imageURLs[0]} height={50} width={50} alt={name} />
            <button className={styles.addButton} onClick={() => addToList(data, listId)}>+</button>
            <div className={styles.searchResultText}>
                <p className={styles.title}>{name}</p>
                <p className={styles.artist}>{artistNames.join(', ')}</p>
                <p className={styles.type}>{type.charAt(0).toUpperCase() + type.substring(1)}</p>
            </div>
        </div>
    );
}

function SearchBar({ listId, handleDataChange }) {
    const [results, setResults] = useState([]);
    const [type, setType] = useState('all');
    const [query, setQuery] = useState('');
    // const [apiToken, setToken] = useState(getToken());

    useEffect(() => {
        if (query) {
            fetch(`/api/spot/search?q=${query}&type=${type}`)
                .then(res => res.json())
                .then(data => setResults(data));
        } else setResults([]);
    }, [query, type]);

    return (
        <div>
            <form className={styles.searchBar}>
                <input
                    className={styles.searchInput}
                    onChange={(e) => setQuery(e.target.value)}
                    type="text"
                    name="value"
                    placeholder="Search Spotify..."
                    required
                />
                <label>Type: </label>
                <select
                    onChange={(e) => setType(e.target.value)}
                    id="types"
                    list="types"
                    name="type"
                    required
                >
                    <option value="all">All</option>
                    <option value="track">Track</option>
                    <option value="artist">Artist</option>
                    <option value="album">Album</option>
                </select>
            </form>
            <div className={styles.resultsWrapper}>
                {results.map((result) => {
                    return <SearchResult
                        key={result.id}
                        data={result}
                        listId={listId}
                        handleDataChange={handleDataChange}
                    />;
                })}
            </div>
        </div>
    );
}

export default SearchBar;