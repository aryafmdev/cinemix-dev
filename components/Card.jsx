'use client';

import Image from 'next/image';
import Link from 'next/link';
import TrailerModal from './TrailerModal';
import { useState } from 'react';
import useSWR from 'swr';

// create helper function to fetch JSON data from URL (used with SWR to automatically fetch and cache data)
const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch trailer');
    return res.json();
  });

export default function Card({ media }) {
  // destructure media properties with fallback values
  const {
    id,
    poster_path,
    title,
    name,
    vote_average: voteAverage,
    media_type: mediaTypeRaw,
  } = media || {};

  // infer media type when missing: TMDB 'movie' has title, 'tv' has name
  const mediaType = mediaTypeRaw || (title ? 'movie' : name ? 'tv' : 'movie');

  //fallback title if name or title are missing
  const displayTitle = title || name || 'Untitled';

  const [isModalOpen, setIsModalOpen] = useState(false); // state to control whether the trailer modal open or not

  // fetch trailer videos using SWR if media id is available
  const { data: trailerData, error } = useSWR(
    id
      ? `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
      : null,
    fetcher
  );

  // get the first youtube trailer from the fetched video list
  const trailer = trailerData?.results?.find(
    (video) => video.site === 'YouTube' && video.type === 'Trailer'
  );

  // build the youtube url for embedding the trailer
  const trailerUrl = trailer
    ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&playsinline=1&mute=1&controls=1&rel=0&modestbranding=1`
    : null;

  // create a function to open the modal if the trailer url is available
  const openModal = () => {
    if (trailerUrl) setIsModalOpen(true);
  };

  // create a function to close the trailer modal
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className='flex-none w-40 sm:w-48 md:w-56 min-w-[160px] max-w-[224px] bg-[#18181b] rounded-lg overflow-hidden shadow-lg snap-start'>
      <Link href={`/details?id=${id}&media_type=${mediaType}`}>
        <div className='relative aspect-[2/3] group cursor-pointer'>
          <Image
            src={
              poster_path
                ? `https://image.tmdb.org/t/p/w500${poster_path}`
                : '/default-poster.jpg'
            }
            alt={displayTitle}
            fill
            className='object-cover rounded-t-lg transition-all group-hover:brightness-95'
            sizes='33vw'
            quality={75}
          />
        </div>
      </Link>

      <div className='p-4 flex flex-col gap-2'>
        <p className='text-xs sm:text-sm text-yellow-400'>
          ⭐ {voteAverage?.toFixed(1) || 'N/A'}
        </p>
        <Link href={`/details?id=${id}&media_type=${mediaType}`}>
          <h3 className='text-base sm:text-lg my-1 font-semibold text-white line-clamp-2 h-12 sm:h-14 cursor-pointer hover:underline'>
            {displayTitle}
          </h3>
        </Link>
        <button
          onClick={openModal}
          disabled={!trailerUrl}
          className={`flex items-center justify-center gap-1 w-full py-2 bg-[#18181b] text-white font-bold border border-gray-600 rounded-4xl hover:bg-[#252525] transition-colors text-sm sm:text-base ${
            !trailerUrl ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          }`}
        >
          <Image
            src='/youtube.png'
            alt='play'
            width={20}
            height={20}
            className='w-8 h-6 -mb-[1px]'
          />{' '}
          Watch Trailer
        </button>
      </div>
      <TrailerModal
        isOpen={isModalOpen}
        onClose={closeModal}
        trailerUrl={trailerUrl}
        title={displayTitle}
      />
    </div>
  );
}
