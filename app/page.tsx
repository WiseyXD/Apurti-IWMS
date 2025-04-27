import CTA from "@/components/landing/cta";
import Faq from "@/components/landing/faq";
import Footer from "@/components/landing/footer";
import Hero from "@/components/landing/hero";
import { InfiniteMovingCardsDemo } from "@/components/landing/testimonials";
// import { FeaturesSection1 } from "@/components/ui/feature-section1";
import { FeaturesSection2 } from "@/components/ui/feature-section2";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Full screen height and centered content */}
      <div className="w-full bg-zinc-50 dark:bg-zinc-900 text-slate-950">
        <Hero />
      </div>

      <div
        className="w-full px-4 md:px-8 lg:px-12 py-8 bg-zinc-50 dark:bg-zinc-900 text-slate-950"
        id="features"
      >
        <FeaturesSection2 />
      </div>

      <div className="w-full px-4 md:px-8 lg:px-12 py-8">
        <InfiniteMovingCardsDemo />
      </div>

      <div className="w-full px-4 md:px-8 lg:px-12 py-8 bg-zinc-50 dark:bg-zinc-900 text-slate-950">
        <Faq />
      </div>

      <div className="w-full px-4 md:px-8 lg:px-12 py-8">
        <CTA />
      </div>

      <Separator />

      <div className="w-full py-8">
        <Footer />
      </div>
    </div>
  );
}
