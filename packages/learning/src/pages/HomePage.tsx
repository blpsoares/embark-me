import { Hero } from "../components/home/Hero";
import { FeatureGrid } from "../components/home/FeatureGrid";
import { HowItWorks } from "../components/home/HowItWorks";

export function HomePage() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <HowItWorks />
    </>
  );
}
