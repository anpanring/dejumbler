/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, useRef, useContext } from "react";

import styles from "./search.module.css";

import { CurrentListContext } from "../pages/all-lists";
import { ListMetadata } from "../types/dejumbler-types";

function SearchResult({ data, listContext, handleDataChange }: {
    data: any,
    listContext: ListMetadata,
    handleDataChange: (data: any, message: string) => void
}) {
    const { currentList } = useContext(CurrentListContext) ?? {};

    switch (currentList ? currentList.type : listContext.type) {
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
                    <img src={imageURLs[0]} height={50} width={50} alt={name} />
                    <button className={styles.addButton} onClick={() => addToList(data, currentList ? currentList.id : listContext.id, name)}>+</button>
                    <div className={styles.searchResultText}>
                        <p className={styles.title}>{name}</p>
                        <p className={styles.artist}>{artistNames.join(', ')}</p>
                        <p className={styles.type}>{type.charAt(0).toUpperCase() + type.substring(1)}</p>
                    </div>
                </div>
            );
        case 'Movies':
            const { title, poster_path, overview, director, year } = data;
            data.type = 'movie';

            return (
                <div className={styles.movieSearchResultsWrapper}>
                    <img src={`https://image.tmdb.org/t/p/w92${poster_path}`} width={50} height={75} alt={title} />
                    <button className={styles.addButton} onClick={() => addToList(data, currentList ? currentList.id : listContext.id, title)}>+</button>
                    <div className={styles.searchResultText}>
                        <p className={styles.title}>{title}</p>
                        <p className={styles.artist}>{director && `Dir. ${director}`} {year && `(${year})`}</p>
                        <p className={styles.type}>{overview.slice(0, 120)}...</p>
                    </div>
                </div>
            );
        case 'Books':
            const { title: bookTitle, author_name, first_publish_year, cover_edition_key, subject } = data;
            data.type = 'book';

            return (
                <div className={styles.movieSearchResultsWrapper}>
                    <img src={`https://covers.openlibrary.org/b/olid/${cover_edition_key}-M.jpg`} width={50} height={75} alt={bookTitle} />
                    <button className={styles.addButton} onClick={() => addToList(data, currentList ? currentList.id : listContext.id, bookTitle)}>+</button>
                    <div className={styles.searchResultText}>
                        <p className={styles.title}>{bookTitle}</p>
                        {author_name && <p className={styles.artist}>{author_name.join(', ')} - {first_publish_year}</p>}
                        {subject && <p className={styles.type}>{subject.slice(0, 6).join(', ')}</p>}
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

        const res = await fetch('/api/add-item', fetchOptions);
        const updatedData = await res.json();
        handleDataChange(updatedData, itemName + ' added to');
    }
}

function SearchBar({ listContext, handleDataChange } : {
    listContext: ListMetadata,
    handleDataChange: (data: any, message: string) => void
}) {
    const [results, setResults] = useState<Object[] | null>(null);
    const [musicType, setMusicType] = useState('all');
    const [query, setQuery] = useState('');
    const [searching, setSearching] = useState<boolean>(false);

    const formRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        if (query && query.trim() !== ''){
            let url: string;
            if (listContext.type == "Music") url = `/api/spot/search?q=${query}&type=${musicType}`;
            else if (listContext.type == "Movies") url = `/api/search?q=${query}&type=movies`;
            else url = `/api/search?q=${query}&type=books`;
            setSearching(true);
            fetch(url, { signal })
                .then(res => res.json())
                .then(data => {
                    setResults(data);
                    setSearching(false);
                })
                .catch(err => {
                    if (err.name === 'AbortError') console.log('Request aborted');
                    else console.log('Error: ', err);
                });
        }
        else setResults(null); // clear results when query is empty

        return () => {
            controller.abort();
        };
    }, [query, musicType, listContext.type]);

    return (
        <div>
            <form className={styles.searchBar} >
                <input
                    className={styles.searchInput}
                    onChange={(e) => setQuery(e.target.value)}
                    type="search"
                    name="value"
                    placeholder={`Search ${listContext.type.toLowerCase()} to add...`}
                    ref={formRef}
                    required
                />
                {/* <button className={styles.clearButton}>
                    <span className={`material-symbols-outlined ${styles.clearButtonIcon}`}>
                        close
                    </span>
                </button> */}
                {listContext.type !== 'Movies' && listContext.type !== 'Books' && <select
                    onChange={(e) => setMusicType(e.target.value)}
                    className={styles.searchTypeSelect}
                    name="type"
                    required
                >
                    <option value="all">All</option>
                    <option value="track">Track</option>
                    <option value="artist">Artist</option>
                    <option value="album">Album</option>
                </select>}
            </form>
            <div className={styles.resultsWrapper}>
                {results && results.map((result) => {
                    return <SearchResult
                        key={Math.random() * Number.MAX_VALUE}
                        data={result}
                        listContext={listContext}
                        handleDataChange={handleDataChange}
                    />;
                })}
                {searching && formRef.current?.value !== '' && <p className={styles.searching}>Searching...</p>}
                {!searching && formRef.current?.value !== '' && results?.length == 0 && <p className={styles.searching}>No results found</p>}
                {listContext.type === 'Movies' && <p>*results from <a href="https://openlibrary.org/developers/api" rel="noreferrer" target="_blank">The Movie Database (TMDB) API</a></p>}
                {listContext.type === 'Music' && <p>*results from <a href="https://developer.spotify.com/documentation/web-api" rel="noreferrer" target="_blank">Spotify API</a></p>}
                {listContext.type === 'Books' && <p>*results from <a href="https://openlibrary.org/developers/api" rel="noreferrer" target="_blank">Open Library API</a></p>}
            </div>
        </div>
    );
}

export default SearchBar;