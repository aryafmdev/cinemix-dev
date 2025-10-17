'use client';

import useSWR from 'swr';
import MediaDisplay from '@/components/MediaDisplay';

// create helper function to fetch JSON data from URL ( used with SWR to automatically fetch and cache data)
const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error('Failed To Fetch Data');
    }
    return res.json();
  });

export default function MoviesPage() {
  // define the TMDB API URL to get a list of popular movies
  const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&sort_by=popularity.desc&page=1`;

  // use SWR to fetch and cache the movie data
  const { data: moviesData } = useSWR(apiUrl, fetcher);

  // if the data is not yet available, show a loading state
  if (!moviesData) {
    return <div>Loading...</div>;
  }

  // if the data is available, render the movie list
  return (
    <div className='container mx-auto px-4'>
      {/* pass movies data results to mediaDisplay component */}
      <MediaDisplay items={moviesData.results || []} />
    </div>
  );
}
