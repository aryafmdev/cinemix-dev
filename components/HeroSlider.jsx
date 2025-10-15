'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import Link from 'next/link';

export default function HeroSlider({ movies =[] }) {
  const [currentSlide, setCurrentSlide] = useState(0); // state to track the current slide index
  const [swiperInstance, setSwiperInstance] = useState(null); // store swiper instance for controlling slide navigation

  // create a function to get the media title
  const getMediaTitle = (media) => {
    return media.media_type === 'movie'
      ? media.title || 'untitle'
      : media.name || 'untitle';
  };

  // create a function to get the movie genres
  const getGenres = (media) => {
    if (
      media.media_type === 'movie' &&
      media.genres &&
      media.genres.length > 0
    ) {
      return media.genres.map((g) => g.name).join(', ');
    }
    return '';
  };

  // create a function to format movie runtime into hours and minutes
  const formatDuration = (media) => {
    if (media.media_type === 'movie' && media.runtime) {
      const h = Math.floor(media.runtime / 60);
      const m = media.runtime % 60;
      return `${h}h ${m}m`;
    }
    return '';
  };

  // handle navigation button clicks to switch to specified slide and update current slide state
  const handleButtonClick = (index) => {
    if (swiperInstance) {
      swiperInstance.slideToLoop(index);
      setCurrentSlide(index);
    }
  };

  return (
    <section className='relative min-h-[360px] sm:min-h-[480px] md:min-h-[720px] w-full'>
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect='fade'
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={movies.length > 1}
        onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
        onSwiper={(swiper) => setSwiperInstance(swiper)}
        className='w-full h-full'
      >
        {/* map through movies to create a slide for each movie */}
        {movies.map((media) => (
          <SwiperSlide key={media.id}>
            <div className='relative w-full h-[360px] sm:h-[480px] md:h-[720px]'>
              <div
                className='absolute inset-0 bg-cover bg-center'
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/w1280${
                    media.backdrop_path || '/placeholder.jpg'
                  })`,
                }}
              ></div>
              <div className='absolute inset-0 bg-gradient-to-b from-black/40 to-black/80'></div>
              <div className='absolute inset-0 flex items-center sm:items-end p-4 sm:p-8 md:p-20 text-white max-w-xs sm:max-w-md md:max-w-2xl'>
                <div>
                  <Link
                    href={`/details?id=${media.id}&media_type=${media.media_type}`}
                  >
                    <h1 className='text-2xl sm:text-2xl md:text-5xl font-bold leading-tight sm:leading-snug'>
                      {getMediaTitle(media)}
                    </h1>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
