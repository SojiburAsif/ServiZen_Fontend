import Features from "@/components/shared/static/Features";
import HeroSection from "@/components/shared/static/Hero";

import MarketPolicy from "@/components/shared/static/marketpolicy";
import OurServices from "@/components/shared/static/OurServices";
import Professional from "@/components/shared/static/OurServices";
import OurTeam from "@/components/shared/static/OurTeam";



export default function Home() {
  return (
    <div className="">
      <HeroSection></HeroSection>
      <Features></Features>
      <OurServices></OurServices>
      <MarketPolicy></MarketPolicy>
      <OurTeam></OurTeam>
    </div>
  );
}
