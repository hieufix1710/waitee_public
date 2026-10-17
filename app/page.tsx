import CTA from '@/components/CTA';
import FAQ from '@/components/FAQ';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import POSVietnam from '@/components/POSVietnam';

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="min-h-screen">
        <Hero />
        <Features />
        <POSVietnam />
        <FAQ />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
