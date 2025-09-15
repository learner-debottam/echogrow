import Hero from '../components/Hero';
import FeatureCards from '../components/FeatureCards';
import Testimonials from '../components/Testimonials';
import LanguageSelector from '../components/LanguageSelector';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <header className="flex items-center justify-between p-4 max-w-6xl mx-auto">
        <div className="text-xl font-bold text-gray-900 dark:text-white">EchoGrow</div>
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <button aria-label="Toggle dark mode" className="border px-3 py-1 rounded">🌓</button>
        </div>
      </header>
      <Hero />
      <FeatureCards />
      <Testimonials />
      <footer className="py-8 text-center text-gray-600 dark:text-gray-400">© {new Date().getFullYear()} EchoGrow</footer>
    </main>
  );
}
