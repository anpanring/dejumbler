import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { type, q } = req.query;

  switch (type) {
    case 'movies':
      try {
        const moviesSearchRes = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${q}&api_key=${process.env.TMDB_TOKEN}`,
        );
        const moviesSearchData = await moviesSearchRes.json();
        const moviesSearchResults = moviesSearchData.results.slice(0, 6);

        for (const result of moviesSearchResults) {
          const directorRes = await fetch(
            `https://api.themoviedb.org/3/movie/${result.id}/credits?api_key=${process.env.TMDB_TOKEN}`,
          );
          const directorData = await directorRes.json();
          const director = directorData.crew.filter(
            ({ job }) => job === 'Director',
          );

          const yearRes = await fetch(
            `https://api.themoviedb.org/3/movie/${result.id}/release_dates?api_key=${process.env.TMDB_TOKEN}`,
          );
          const yearData = await yearRes.json();
          const year = yearData.results
            .find(({ iso_3166_1 }) => iso_3166_1 === 'US')
            ?.release_dates[0]?.release_date.slice(0, 4);

          result.director = director[0]?.name;
          result.year = year;
        }

        res.status(200).json(moviesSearchResults);
      } catch (err) {
        res.status(500).json({ error: 'Error fetching data' });
      }
      break;
    case 'books':
      try {
        const booksSearchRes = await fetch(
          `https://openlibrary.org/search.json?q=${q}&limit=5`,
        );
        const booksSearchData = await booksSearchRes.json();
        res.status(200).json(booksSearchData.docs);
      } catch (err) {
        res.status(500).json({ error: 'Error fetching data' });
      }
      break;
    default:
      res.status(400).json({ error: 'No type specified' });
  }
}
