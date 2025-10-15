import HeroSection from "@/components/HeroSection";
import HeroSlider from "@/components/HeroSlider";

export default function Home() {
  return (
    <div className="bg-black min-h-screen text-white">
      <HeroSection />
      <HeroSlider />
    </div>
  );
}
