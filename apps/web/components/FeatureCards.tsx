type Feature = { title: string; description: string };
const features: Feature[] = [
  { title: 'Smart Scheduling', description: 'Plan posts with calendar and platform targeting.' },
  { title: 'AI Captions', description: 'Generate and translate captions in multiple languages.' },
  { title: 'Deep Analytics', description: 'Track engagement and sentiment trends.' },
];

export default function FeatureCards() {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
        {features.map((f, idx) => (
          <div key={idx} className="p-6 bg-white dark:bg-gray-900 rounded shadow">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{f.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
