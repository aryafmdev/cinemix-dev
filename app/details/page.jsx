'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import useSWR from 'swr';
import Card from '@/components/Card';
import TrailerModal from '@/components/TrailerModal';

// create a helper fetcher funtion for useSWR
const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Failed To Fetch');
    return res.json();
  });

export default function DetailsPage() {
  // get url parameters (id and media_type)
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const mediaType = searchParams.get('media_type') || 'movie';

  // control trailer modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // get the API key
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  // fetch main media details with credits
  const { data: media } = useSWR(
    id
      ? `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${apiKey}&language=en-US&append_to_response=credits`
      : null,
    fetcher
  );

  // fetch media trailer videos
  const { data: videos } = useSWR(
    id
      ? `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=${apiKey}&language=en-US`
      : null,
    fetcher
  );

  // fetch the recommendation movies
  const { data: recommendations } = useSWR(
    id
      ? `https://api.themoviedb.org/3/${mediaType}/${id}/recommendations?api_key=${apiKey}&language=en-US`
      : null,
    fetcher
  );

  // find the first youtube trailer
  const trailer = videos?.results?.find(
    (v) => v.site === 'YouTube' && v.type === 'Trailer'
  );
  const trailerUrl = trailer
    ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1`
    : null;

  // modal open/close handler
  const openModal = () => trailerUrl && setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // create helper functions for displaying media info
  const getTitle = () => (mediaType === 'movie' ? media?.title : media?.name);
  const getDate = () =>
    mediaType === 'movie' ? media?.release_date : media?.first_air_date;
  const getGenres = () => media?.genres?.map((g) => g.name).join(', ') || 'N/A';
  const getRating = () => media?.vote_average?.toFixed(1) || 'N/A';
  const getRunTime = () => {
    if (mediaType === 'movie') {
      return media?.runtime
        ? `${Math.floor(media?.runtime / 60)} hr ${media?.runtime % 60} min`
        : 'N/A';
    }
    return media?.number_of_seasons
      ? `${media.number_of_seasons} Season(s)`
      : 'N/A';
  };
  const getDirector = () => {
    if (mediaType === 'movie') {
      return (
        media?.credits?.crew?.find((p) => p.job === 'Director')?.name || 'N/A'
      );
    }
    return media?.created_by?.map((p) => p.name).join(', ') || 'N/A';
  };
  const getCast = () => media?.credits?.cast?.slice(0, 8) || [];

  // show loading message while data is being fetched
  if (!media)
    return <div className='text-white text-center mt-10'>Loading...</div>;

  return (
    <div className='bg-black text-white min-h-screen'>
      {/* backdrop image */}
      <section
        className='relative h-[240px] sm:h-[360px] md:h-[480px] w-full bg-cover bg-center z-0'
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w1280${
            media.backdrop_path || '/default-poster.jpg'
          })`,
        }}
      >
        <div className='absolute inset-0 bg-gradient-to-b from-black/40 to-black/80'></div>
      </section>

      {/* main details section */}
      <section className='container mx-auto px-6 sm:px-12 md:px-40 rounded-b-lg z-10 relative mt-[-80px] sm:mt-[-120px] md:mt-[-160px]'>
        <div className='bg-transparent flex flex-col md:flex-row gap-6 sm:gap-8 pt-4 pb-6 sm:pt-6 sm:pb-8 rounded-b-lg'>
          {/* poster and trailer button */}
          <div className='flex-none w-full max-w-[240px] sm:max-w-[300px] mx-auto md:mx-0 flex flex-col items-center'>
            <Image
              src={
                media.poster_path
                  ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
                  : '/default-poster.jpg'
              }
              alt=''
              width={300}
              height={450}
              className='w-full object-cover rounded-lg'
              quality={90}
            />
            <button
              onClick={openModal}
              disabled={!trailerUrl}
              className={`mt-4 w-full bg-yellow-400 text-black px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium text-sm sm:text-base hover:bg-yellow-500 transition-colors ${
                !trailerUrl ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              Watch Trailer
            </button>
          </div>

          {/* text info */}
          <div className='flex-1'>
            <h2 className='text-xl sm:text-2xl md:text-3xl font-semibold'>
              {getTitle()}
            </h2>
            <div className='flex items-center gap-3 sm:gap-4 mt-2'>
              <p className='text-xs sm:text-sm md:text-base text-yellow-400'>
                {getGenres()}
              </p>
              <p className='text-xs sm:text-sm md:text-base'>
                ⭐ {getRating()}
              </p>
            </div>
            <p className='text-sm sm:text-base md:text-lg mt-4 sm:mt-6 text-gray-300'>
              {media.overview || 'No description available'}
            </p>
            <div className='mt-4 sm:mt-6 space-y-1 sm:space-y-2'>
              <p className='text-xs sm:text-sm md:text-base'>
                <span className='font-medium'>Duration : </span>
                <span className='text-gray-300'>{getRunTime()}</span>
              </p>
              <p className='text-xs sm:text-sm md:text-base'>
                <span className='font-medium'>Release Date : </span>
                <span className='text-gray-300'>{getDate()}</span>
              </p>
              <p className='text-xs sm:text-sm md:text-base'>
                <span className='font-medium'>
                  {mediaType === 'movie' ? 'Director ' : 'Creator'}:
                </span>{' '}
                <span className='text-gray-300'>{getDirector()}</span>
              </p>
            </div>

            {/* cast section */}
            <div className='mt-4 sm:mt-6'>
              <h3 className='text-base sm:text-lg md:text-xl font-semibold'>
                Cast :
              </h3>
              <div className='flex flex-row overflow-x-auto gap-3 sm:gap-8 mt-3 sm:mt-4 pb-2'>
                {getCast().map((actor, index) => (
                  <div
                    key={index}
                    className='flex-none flex flex-col items-center w-16 sm:w-20'
                  >
                    <Image
                      src={
                        actor.profile_path
                          ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                          : '/default-poster.jpg'
                      }
                      alt=''
                      width={64}
                      height={64}
                      className='size-16 sm:size-20 object-cover rounded-full'
                      quality={90}
                    />
                    <p className='text-xs sm:text-sm text-center mt-1 sm:mt-2 line-clamp-2'>
                      {actor.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* recommendation movies section */}
      {recommendations?.results?.length > 0 && (
        <section className='container mx-auto px-6 sm:px-12 md:px-40 py-6 sm:py-8'>
          <h2 className='text-xl sm:text-2xl md:text-3xl font-semibold mb-3 sm:mb-4'>
            Recommended {mediaType === 'movie' ? 'Movies' : 'tvSeries'}
          </h2>
          <div className='flex overflow-x-auto gap-3 sm:gap-4 pb-4'>
            {recommendations.results.slice(0, 10).map((item) => (
              <div key={item.id} className='flex-none'>
                <Card media={{ ...item, media_type: mediaType }} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* trailer modal */}
      <TrailerModal
        isOpen={isModalOpen}
        onClose={closeModal}
        trailerUrl={trailerUrl}
        title={getTitle()}
      />
    </div>
  );
}
