'use client';

import useSWR from 'swr';
import MediaDisplay from '@/components/MediaDisplay';
import Pagination from '@/components/Pagination';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// create helper function to fetch JSON data from URL ( used with SWR to automatically fetch and cache data)
const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error('Failed To Fetch Data');
    }
    return res.json();
  });

export default function MoviesPage() {

  const router = useRouter(); // to change the page url when the pagination happens
  const pathname = usePathname(); // to get the current page path
  const searchParams = useSearchParams(); // to read the current url query (like: ?page=2)
  const [page, setPage] = useState(1); // to store the current page number

  // get the current page number from the url and update the page stats (defaults to 1 if missing or invalid)
useEffect(() => {
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  setPage(isNaN(pageParam) || pageParam < 1 ? 1 : pageParam);
}, [searchParams]);  

  // define the TMDB API URL to get a list of popular movies - include the page at the api url
  const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${page}&sort_by=popularity.desc`;

  // use SWR to fetch and cache the movie data
  const { data: moviesData } = useSWR(apiUrl, fetcher);

  // update the url with the new page number when navigate to a different page
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // if the data is still loading show a loading message
  if (!moviesData) {
    return <div>Loading...</div>;
  }

  // get total number of pages from the api response, and fallback to 1 if not available
  const totalPages = moviesData?.total_pages || 1;
  const movies = moviesData.results || [];

  // if the data is available, render the movie list
  return (
    <div className='container mx-auto px-4'>
      {/* pass movies data results to mediaDisplay component */}
      <MediaDisplay items={movies} />

      {/* show the pagination only if there are enough results */}
      {movies.length >= 15 && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
