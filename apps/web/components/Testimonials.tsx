type Testimonial = { name: string; quote: string };
const testimonials: Testimonial[] = [
  { name: 'Alex', quote: 'EchoGrow boosted our engagement by 3x in a month.' },
  { name: 'Jordan', quote: 'Scheduling and AI captions saved us hours weekly.' },
];

export default function Testimonials({ loading = false }: { loading?: boolean }) {
  if (loading) {
    return (
      <section className="py-12">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
          <div className="animate-pulse h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
          <div className="animate-pulse h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        </div>
      </section>
    );
  }
  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-3xl mx-auto space-y-6 px-4">
        {testimonials.map((t, idx) => (
          <blockquote key={idx} className="border-l-4 pl-4 text-gray-700 dark:text-gray-200">
            <p className="italic">“{t.quote}”</p>
            <cite className="block mt-2 text-sm text-gray-500 dark:text-gray-400">— {t.name}</cite>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
