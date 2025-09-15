import Link from 'next/link';

export default function Hero() {
  return (
    <section className="py-16 text-center bg-white dark:bg-gray-900">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Grow your audience with AI</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300">Schedule posts, generate captions, and track analytics in one place.</p>
      <div className="mt-6 flex justify-center gap-4">
        <Link href="/auth/signup" className="px-5 py-2 bg-blue-600 text-white rounded">Get Started</Link>
        <Link href="/billing" className="px-5 py-2 border rounded text-blue-600 border-blue-600">Subscribe</Link>
      </div>
    </section>
  );
}
