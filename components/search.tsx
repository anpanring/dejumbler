/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, useRef, useContext } from "react";

import styles from "./search.module.css";

import { CurrentListContext } from "../pages/all-lists";
import { ListMetadata } from "../types/dejumbler-types";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

function SearchResult({ data, listContext, handleDataChange }: {
  data: any,
  listContext: ListMetadata,
  handleDataChange: (data: any, message: string) => void
}) {
  const { currentList } = useContext(CurrentListContext) ?? {};
  const titleScroll = useRef<HTMLParagraphElement>(null);

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
        <div className={styles.searchResultWrapper}>
          <div className={styles.searchResultInfo}>
            {imageURLs[0] ? <img className={styles.searchResultImage} src={imageURLs[0]} height={50} width={50} alt={name} loading="lazy" />
              : <div className={styles.noImage}><p>{name}</p></div>}
            <div className={styles.searchResultText}>
              <p className={styles.title}
                ref={titleScroll}
                onMouseOver={() => {
                  for (let i = 0; i < 100; i++) {
                    setInterval(() => {
                      if (titleScroll.current != null) {
                        titleScroll.current.scrollLeft += 1;
                      }
                    }, 5);
                  }
                }
                }>{name}</p>
              <p className={styles.artist}>{artistNames.join(', ')}</p>
              <p className={styles.type}>{type.charAt(0).toUpperCase() + type.substring(1)}</p>
            </div>
          </div>
          <button className={styles.addButton} onClick={() => addToList(data, currentList ? currentList.id : listContext.id, name)}>+</button>
        </div>
      );
    case 'Movies':
      const { title, poster_path, overview, director, year } = data;
      data.type = 'movie';

      return (
        <div className={styles.movieSearchResultWrapper}>
          <div className={styles.searchResultInfo}>
            {poster_path ? <img className={styles.searchResultImage} src={`https://image.tmdb.org/t/p/w92${poster_path}`} width={50} height={75} alt={title} loading="lazy" />
              : <div className={styles.noImage}><p>{title}</p></div>}
            <div className={styles.searchResultText}>
              <p className={styles.title}>{title}</p>
              <p className={styles.artist}>{director && `Dir. ${director}`} {year && `(${year})`}</p>
              <p className={styles.type}>{overview.slice(0, 120)}...</p>
            </div>
          </div>
          <button className={styles.addButton} onClick={() => addToList(data, currentList ? currentList.id : listContext.id, title)}>+</button>
        </div >
      );
    case 'Books':
      const { title: bookTitle, author_name, first_publish_year, cover_edition_key, subject } = data;
      data.type = 'book';

      return (
        <div className={styles.movieSearchResultWrapper}>
          <div className={styles.searchResultInfo}>
            {cover_edition_key ? <img className={styles.searchResultImage} src={`https://covers.openlibrary.org/b/olid/${cover_edition_key}-M.jpg`} width={50} height={75} alt={bookTitle} loading="lazy" />
              : <div className={styles.noImage}><p>{bookTitle}</p></div>}
            <div className={styles.searchResultText}>
              <p className={styles.title}>{bookTitle}</p>
              {author_name && <p className={styles.artist}>{author_name.join(', ')} - {first_publish_year}</p>}
              {subject && <p className={styles.type}>{subject.slice(0, 3).join(', ')}</p>}
            </div>
          </div>
          <button className={styles.addButton} onClick={() => addToList(data, currentList ? currentList.id : listContext.id, bookTitle)}>+</button>
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

function SearchBar({ listContext, handleDataChange }: {
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

    if (query && query.trim() !== '') {
      let url: string;
      if (listContext.type == "Music") url = `/api/spot/search?q=${query}&type=${musicType}`;
      else if (listContext.type == "Movies") url = `/api/search?q=${query}&type=movies`;
      else url = `/api/search?q=${query}&type=books`;
      setSearching(true);
      fetch(url, { signal })
        .then(res => {
          if (!res.ok) throw new Error('Error fetching data');
          else return res.json();
        })
        .then(data => {
          setResults(data);
          setSearching(false);
        })
        .catch(err => {
          if (err.name === 'AbortError') console.log('Request aborted');
          else {
            alert(err);
            setSearching(false);
            setResults(null);
          }
        });
    }
    else setResults(null); // clear results when query is empty

    return () => {
      controller.abort();
    };
  }, [query, musicType, listContext.type]);

  return (
    <div>
      {/* Search bar */}
      <form className={styles.searchBar}>
        {/* <Input
            className={styles.searchInput}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            name="value"
            placeholder={`Search ${listContext.type.toLowerCase()} to add...`}
            ref={formRef}
            required
        /> */}
        <Input
          // className={styles.searchInput}
          className="h-8 w-[18em]"
          onChange={(e) => setQuery(e.target.value)}
          type="search"
          name="value"
          placeholder={`Search ${listContext.type.toLowerCase()} to add...`}
          ref={formRef}
          required
        />
        {/* {results && <button
          className={styles.clearButton}
          onClick={() => {
            if (formRef.current) formRef.current.value = "";
            setResults(null);
            formRef.current?.focus();
          }}
        >Clear</button>} */}
        {listContext.type !== 'Movies' && listContext.type !== 'Books' && <Select
          onValueChange={(val) => setMusicType(val)}
          name="type"
          required
          defaultValue="all"
        >
          <SelectTrigger className="h-8 w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="track">Track</SelectItem>
            <SelectItem value="artist">Artist</SelectItem>
            <SelectItem value="album">Album</SelectItem>
          </SelectContent>
        </Select>}
      </form>

      {/* Results */}
      {
        results && results.length !== 0 && <div className={styles.resultsContainer}>
          {results.map((result) => {
            return <SearchResult
              key={Math.random() * Number.MAX_VALUE}
              data={result}
              listContext={listContext}
              handleDataChange={handleDataChange}
            />;
          })}

          {listContext.type === 'Movies' && <p className={styles.resultsDisclaimer}>*results from <a href="https://openlibrary.org/developers/api" rel="noreferrer" target="_blank">The Movie Database (TMDB) API</a></p>}
          {listContext.type === 'Music' && <p className={styles.resultsDisclaimer}>*results from <a href="https://developer.spotify.com/documentation/web-api" rel="noreferrer" target="_blank">Spotify API</a></p>}
          {listContext.type === 'Books' && <p className={styles.resultsDisclaimer}>*results from <a href="https://openlibrary.org/developers/api" rel="noreferrer" target="_blank">Open Library API</a></p>}
        </div>
      }
      {searching && formRef.current?.value !== '' && !results && <p className={styles.searching}>Searching</p>}
      {!searching && formRef.current?.value !== '' && results?.length == 0 && <p className={styles.searching}>No results found :(</p>}
    </div>
  );
}

export default SearchBar;
