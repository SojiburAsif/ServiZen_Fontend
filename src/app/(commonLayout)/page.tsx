import Features from "@/components/shared/static/Features";
import HeroSection from "@/components/shared/static/Hero";

import MarketPolicy from "@/components/shared/static/marketpolicy";
import MarqueePage from "@/components/shared/static/marqueePage";
import OurServices from "@/components/shared/static/OurServices";
import Professional from "@/components/shared/static/OurServices";
import OurSuccessful from "@/components/shared/static/OurSuccessful";
import OurTeam from "@/components/shared/static/OurTeam";



export default function Home() {
  return (
    <div className="relative">
      {/* Global abstract background letters */}
     

      <HeroSection></HeroSection>
      <Features></Features>
      <OurServices></OurServices>
      <MarqueePage></MarqueePage>
      <OurSuccessful></OurSuccessful>
      <MarketPolicy></MarketPolicy>
      <OurTeam></OurTeam>
    </div>
  );
}
