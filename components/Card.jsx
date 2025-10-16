'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function Card({ media }) {
  // destructure media properties with fallback values
  const {
    id,
    poster_path,
    title,
    name,
    vote_average: voteAverage,
    media_type: mediaType = 'movie',
  } = media || {};

  //fallback title if name or title are missing
  const displayTitle = title || name || 'Untitled';

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
            quality={90}
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
        <button className=' flex items-center justify-center gap-1 w-full py-2 bg-[#18181b] text-white font-bold border border-gray-600 rounded-4xl hover:bg-[#252525] transition-colors text-sm sm:text-base cursor-pointer'>
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
    </div>
  );
}
