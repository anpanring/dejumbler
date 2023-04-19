import getToken from "../lib/spotify";
import React, { useEffect, useState } from "react";
import styles from "./search.module.css";
import Image from "next/image";

function SearchResult({ data, listId, handleDataChange }) {
    console.log(data);

    async function addToList(data, listId) {
        data.listId = listId;
        data = JSON.stringify(data);
        console.log(data);

        const fetchOptions = {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
            },
            body: data
        };

        const updatedList = await fetch('/api/add-item', fetchOptions);
        handleDataChange(updatedList);
    }

    const {
        artists,
        images,
        type,
        name,
        album
    } = data;

    const artistNames = artists ? artists.map((artist) => artist.name) : [];
    const imageURLs = images ? images.map((image) => image.url) : album.images.map((image) => image.url);

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
        const spotSearch = async () => {
            if (query) {
                const data =
                    await fetch(`/api/spot/search?q=${query}&type=${type}`)
                        .then((res) => {
                            if (res.status != 200) {
                                alert('Error ' + res.status);
                                return [];
                            }
                            else return res.json();
                        });
                setResults(data);
            } else setResults([]);
        }
        spotSearch();
    }, [query, type]);

    function handleQueryChange(e) {
        setQuery(e.target.value);
    }

    function handleTypeChange(e) {
        setType(e.target.value);
    }

    return (
        <div>
            <form className={styles.searchBar}>
                <input onChange={handleQueryChange} type="text" name="value" placeholder="Search Spotify..." required />
                <label>Type: </label>
                <select onChange={handleTypeChange} id="types" list="types" name="type" required>
                    <option value="all">All</option>
                    <option value="track">Track</option>
                    <option value="artist">Artist</option>
                    <option value="album">Album</option>
                </select>
                {/* <input type="submit" value="Search" className={styles.button} /> */}
            </form>
            <div className={styles.resultsWrapper}>
                {results.map((result) => {
                    return <SearchResult key={result} data={result} listId={listId} handleDataChange={handleDataChange} />;
                })}
            </div>
        </div>
    );
}

export default SearchBar;