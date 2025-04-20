import React, { useEffect, useState, useRef, useContext } from 'react';
import styles from './search.module.css';
import { CurrentListContext } from '../pages/all-lists';
import { ListMetadata } from '../types/dejumbler-types';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from './ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function AddButton({ mutate, data, currentList, listContext, name }) {
  return (
    <button
      className={styles.addButton}
      onClick={() => {
        console.log(data, currentList?.id, listContext?.id, name);
        mutate({
          data: data,
          currentList: currentList ? currentList.id : listContext.id,
          name: name,
        });
      }}
    >
      +
    </button>
  );
}

function SearchResult({
  data,
  listContext,
}: {
  data: any;
  listContext: ListMetadata;
}) {
  const { currentList } = useContext(CurrentListContext) ?? {};
  const titleScroll = useRef<HTMLParagraphElement>(null);

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: addToList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-list', listContext.id] });
    },
  });

  async function addToList(data: any) {
    console.log('adding to list', 'data:', data);
    // data.listId = listId;
    const stringifiedData = JSON.stringify(data);
    console.log(data);

    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: stringifiedData,
    };

    const res = await fetch('/api/add-item', fetchOptions);
    const updatedData = await res.json();

    toast({
      title: 'item successfully added',
    });
    return updatedData;
  }

  // different search results for each type
  switch (currentList ? currentList.type : listContext.type) {
    case 'Music':
      // process data
      const { artists, images, type, name, album } = data;
      const artistNames = artists ? artists.map((artist) => artist.name) : [];
      const imageURLs = images
        ? images.map((image) => image.url)
        : album.images.map((image) => image.url);

      return (
        <div className={styles.searchResultWrapper}>
          <div className={styles.searchResultInfo}>
            {/* image */}
            {imageURLs[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className={styles.searchResultImage}
                src={imageURLs[0]}
                height={50}
                width={50}
                alt={name}
                loading="lazy"
              />
            ) : (
              <div className={styles.noImage}>
                <p>{name}</p>
              </div>
            )}

            {/* text */}
            <div className={styles.searchResultText}>
              <p
                className={styles.title}
                ref={titleScroll}
                onMouseOver={() => {
                  for (let i = 0; i < 100; i++) {
                    setInterval(() => {
                      if (titleScroll.current != null) {
                        titleScroll.current.scrollLeft += 1;
                      }
                    }, 5);
                  }
                }}
              >
                {name}
              </p>
              <p className={styles.artist}>{artistNames.join(', ')}</p>
              <p className={styles.type}>
                {type.charAt(0).toUpperCase() + type.substring(1)}
              </p>
            </div>
          </div>

          <AddButton
            mutate={mutate}
            data={data}
            currentList={currentList}
            listContext={listContext}
            name={name}
          />
        </div>
      );
    case 'Movies':
      // process data
      const { title, poster_path, overview, director, year } = data;
      data.type = 'movie';

      return (
        <div className={styles.movieSearchResultWrapper}>
          <div className={styles.searchResultInfo}>
            {poster_path ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className={styles.searchResultImage}
                src={`https://image.tmdb.org/t/p/w92${poster_path}`}
                width={50}
                height={75}
                alt={title}
                loading="lazy"
              />
            ) : (
              <div className={styles.noImage}>
                <p>{title}</p>
              </div>
            )}
            <div className={styles.searchResultText}>
              <p className={styles.title}>{title}</p>
              <p className={styles.artist}>
                {director && `Dir. ${director}`} {year && `(${year})`}
              </p>
              <p className={styles.type}>{overview.slice(0, 120)}...</p>
            </div>
          </div>
          <AddButton
            mutate={mutate}
            data={data}
            currentList={currentList}
            listContext={listContext}
            name={title}
          />
        </div>
      );
    case 'Books':
      const {
        title: bookTitle,
        author_name,
        first_publish_year,
        cover_edition_key,
        subject,
      } = data;
      data.type = 'book';

      return (
        <div className={styles.movieSearchResultWrapper}>
          <div className={styles.searchResultInfo}>
            {cover_edition_key ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className={styles.searchResultImage}
                src={`https://covers.openlibrary.org/b/olid/${cover_edition_key}-M.jpg`}
                width={50}
                height={75}
                alt={bookTitle}
                loading="lazy"
              />
            ) : (
              <div className={styles.noImage}>
                <p>{bookTitle}</p>
              </div>
            )}
            <div className={styles.searchResultText}>
              <p className={styles.title}>{bookTitle}</p>
              {author_name && (
                <p className={styles.artist}>
                  {author_name.join(', ')} - {first_publish_year}
                </p>
              )}
              {subject && (
                <p className={styles.type}>{subject.slice(0, 3).join(', ')}</p>
              )}
            </div>
          </div>
          <AddButton
            mutate={() => addToList(data)}
            data={data}
            currentList={currentList}
            listContext={listContext}
            name={bookTitle}
          />
        </div>
      );
  }
}

interface SearchBarProps {
  listContext: ListMetadata;
}

export const SearchBar: React.FC<SearchBarProps> = ({ listContext }) => {
  const [results, setResults] = useState<Object[] | null>(null);
  const [musicType, setMusicType] = useState('all');
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState<boolean>(false);

  const formRef = useRef<HTMLInputElement>(null);

  // fetch search results
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (query && query.trim() !== '') {
      // construct url
      let url: string;
      if (listContext.type == 'Music')
        url = `/api/spot/search?q=${query}&type=${musicType}`;
      else if (listContext.type == 'Movies')
        url = `/api/search?q=${query}&type=movies`;
      else url = `/api/search?q=${query}&type=books`;

      setSearching(true);

      // fetch data
      fetch(url, { signal })
        .then((res) => {
          if (!res.ok) throw new Error('Error fetching data');
          else return res.json();
        })
        .then((data) => {
          setResults(data);
          setSearching(false);
        })
        .catch((err) => {
          if (err.name === 'AbortError') console.log('Request aborted');
          else {
            alert(err);
            setSearching(false);
            setResults(null);
          }
        });
    } else setResults(null); // clear results when query is empty

    return () => {
      controller.abort();
    };
  }, [query, musicType, listContext.type]);

  return (
    <div className="flex-col">
      {/* Search bar */}
      <form className="flex gap-2 mb-3">
        <Input
          className="h-8 w-[16rem]"
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
        {listContext.type !== 'Movies' && listContext.type !== 'Books' && (
          <Select
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
          </Select>
        )}
      </form>

      {/* Results */}
      {results && results.length !== 0 && (
        <div className={styles.resultsContainer}>
          {results.map((result) => {
            return (
              <SearchResult
                key={Math.random() * Number.MAX_VALUE}
                data={result}
                listContext={listContext}
              />
            );
          })}

          {listContext.type === 'Movies' && (
            <p className={styles.resultsDisclaimer}>
              *results from{' '}
              <a
                href="https://openlibrary.org/developers/api"
                rel="noreferrer"
                target="_blank"
              >
                The Movie Database (TMDB) API
              </a>
            </p>
          )}
          {listContext.type === 'Music' && (
            <p className={styles.resultsDisclaimer}>
              *results from{' '}
              <a
                href="https://developer.spotify.com/documentation/web-api"
                rel="noreferrer"
                target="_blank"
              >
                Spotify API
              </a>
            </p>
          )}
          {listContext.type === 'Books' && (
            <p className={styles.resultsDisclaimer}>
              *results from{' '}
              <a
                href="https://openlibrary.org/developers/api"
                rel="noreferrer"
                target="_blank"
              >
                Open Library API
              </a>
            </p>
          )}
        </div>
      )}
      {searching && formRef.current?.value !== '' && !results && (
        <p className={styles.searching}>Searching</p>
      )}
      {!searching && formRef.current?.value !== '' && results?.length == 0 && (
        <p className={styles.searching}>No results found :(</p>
      )}
    </div>
  );
};
