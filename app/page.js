import HeroSection from "@/components/HeroSection";
import TrendingMovies from "@/components/TrendingMovies";
import TopRatedMovies from "@/components/TopRatedMovies";

export default function Home() {
  return (
    <div className="bg-black min-h-screen text-white">
      <HeroSection />
      <TrendingMovies />
      <TopRatedMovies />
    </div>
  );
}
