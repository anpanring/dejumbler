import getToken from "../lib/spotify";
import React, { useEffect, useState } from "react";
import styles from "./search.module.css";
import Image from "next/image";
import { useRouter } from "next/router";

function SearchResult(props) {
    const { data, listId } = props;
    const router = useRouter();
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

        await fetch('/api/add-item', fetchOptions);

        router.push(`/list/${listId}`);
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
            <Image src={imageURLs[0]} height={60} width={60} alt={name} />
            <div className={styles.searchResultText}>
                <p>{name} {artistNames.join(', ')}</p>
                <p>{type}</p>
                <button onClick={() => addToList(data, listId)}>Add to list</button>
            </div>
        </div>
    );
}

function SearchBar(props) {
    const [results, setResults] = useState([]);
    const [type, setType] = useState('all');
    const [query, setQuery] = useState('');
    // const [apiToken, setToken] = useState(getToken());

    useEffect(() => {
        const spotSearch = async () => {
            if (query) {
                try {
                    const data =
                        await fetch(`/api/spot/search?q=${query}&type=${type}`)
                            .then((res) => res.json())
                            .then((data) => {
                                return data;
                            });
                    console.log(data);
                    setResults(data);
                } catch (error) { alert('Failed to search.'); }
            } else setResults([]);
        }
        spotSearch().catch(console.error);
    }, [query, type]);

    function handleQueryChange(e) {
        console.log(e.target.value);
        setQuery(e.target.value);
    }

    function handleTypeChange(e) {
        console.log(e.target.value);
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
                <input type="submit" value="Search" className={styles.button} />
            </form>
            <div className={styles.resultsWrapper}>
                {results.map((result) => {
                    return <SearchResult key={result} data={result} listId={props.listId} />;
                })}
            </div>
        </div>
    );
}

export default SearchBar;