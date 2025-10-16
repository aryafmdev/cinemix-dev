"use client";
import Image from "next/image";
import Link from "next/link";

export default function Card({ media }) {
  // destructure media properties with fallback values
  const {
    id,
    poster_path,
    title,
    name,
    vote_average: voteAverage,
    media_type: mediaType = "movie"
  } = media || {};

  //fallback title if name or title are missing
  const displayTitle = title || name || "Untitled";

  return (
    <div className="flex-none w-40 sm:w-48 md:w-56 min-w-[160px] max-w-[224px] bg-[#18181b] rounded-lg overflow-hidden shadow-lg snap-start">
      <Link href={`/details?id=${id}&media_type=${mediaType}`}>
          <div className="relative aspect-[2/3] group cursor-pointer">
            <Image
              src={
                poster_path
                ? `https://image.tmdb.org/t/p/w500${poster_path}`
                : "/default-poster.jpg"
              }
              alt={displayTitle}
              fill
              className="object-cover rounded-t-lg transition-all group-hover:brightness-95"
              sizes="33vw"
              quality={90}
            />
          </div>
      </Link>
    </div>
  )
}
