import getToken from "../lib/spotify";
import React, { useEffect, useState } from "react";
import styles from "./search.module.css";
import Image from "next/image";
import Snackbar from "./snackbar";

function SearchResult({ data, listId, listType, handleDataChange }) {
    console.log(data);
    switch (listType) {
        case 'Music':
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

            return (
                <div className={styles.searchResultsWrapper}>
                    <Image src={imageURLs[0]} height={50} width={50} alt={name} />
                    <button className={styles.addButton} onClick={() => addToList(data, listId, name)}>+</button>
                    <div className={styles.searchResultText}>
                        <p className={styles.title}>{name}</p>
                        <p className={styles.artist}>{artistNames.join(', ')}</p>
                        <p className={styles.type}>{type.charAt(0).toUpperCase() + type.substring(1)}</p>
                    </div>
                </div>
            );
        case 'Movies':
            console.log(data);
            const { title, poster_path, overview } = data;
            return (
                <div className={styles.movieSearchResultsWrapper}>
                    <Image src={`http://image.tmdb.org/t/p/w92${poster_path}`} width={50} height={75} alt={title} />
                    <button className={styles.addButton} onClick={() => addToList(data, listId, title)}>+</button>
                    <div className={styles.searchResultText}>
                        <p className={styles.title}>{title}</p>
                        <p className={styles.type}>{overview.slice(0, 120)}...</p>
                    </div>
                </div>
            );
    }

    async function addToList(data, listId, itemName) {
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
            .then(data => handleDataChange(data, itemName + ' added to'));
    }
}

function SearchBar({ listId, listType, handleDataChange }) {
    const [results, setResults] = useState([]);
    const [type, setType] = useState('all');
    const [query, setQuery] = useState('');
    const [searching, setSearching] = useState(false);
    // const [apiToken, setToken] = useState(getToken());

    // Add https://developer.mozilla.org/en-US/docs/Web/API/AbortController
    useEffect(() => {
        if (query) {
            setSearching(true);
            switch (listType) {
                case "Music":
                    fetch(`/api/spot/search?q=${query}&type=${type}`)
                        .then(res => res.json())
                        .then(data => setResults(data));
                    break;
                case "Movies":
                    fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&api_key=3770f4ac92cd31bf3489e56a9cc9c5d7`)
                        .then(res => res.json())
                        .then(data => setResults(data.results.slice(0, 6)));
                    break;
            }
            setSearching(false);
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
                    placeholder={`Search ${listType}...`}
                    required
                />
                <select
                    onChange={(e) => setType(e.target.value)}
                    className={styles.searchTypeSelect}
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
                        listType={listType}
                        handleDataChange={handleDataChange}
                    />;
                })}
            </div>
        </div>
    );
}

export default SearchBar;