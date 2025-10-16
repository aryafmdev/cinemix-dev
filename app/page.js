import HeroSection from "@/components/HeroSection";
// import HeroSlider from "@/components/HeroSlider";
import TrendingMovies from "@/components/TrendingMovies";

export default function Home() {
  return (
    <div className="bg-black min-h-screen text-white">
      <HeroSection />
      {/* <HeroSlider /> */}
      <TrendingMovies />
    </div>
  );
}
