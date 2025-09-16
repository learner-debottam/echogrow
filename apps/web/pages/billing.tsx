import { useState, useEffect } from 'react';

type Plan = { id: string; name: string; price: string };

const PLANS: Plan[] = [
  { id: 'price_monthly', name: 'Monthly', price: '$10/mo' },
  { id: 'price_yearly', name: 'Yearly', price: '$100/yr' },
];

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>(PLANS[0].id);
  const [status] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch current subscription status from backend
    // setStatus('active' | 'inactive' | ...)
  }, []);

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const userId = 'user-123';
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: selectedPlan, userId }),
      });
      const data: { url?: string; error?: string } = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Billing & Subscription</h1>
      <div className="mb-4">
        <div className="font-semibold mb-2">Choose your plan:</div>
        <div className="flex gap-4">
          {PLANS.map(plan => (
            <button
              key={plan.id}
              className={`p-3 border rounded ${selectedPlan === plan.id ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              onClick={() => setSelectedPlan(plan.id)}
              disabled={loading}
              aria-pressed={selectedPlan === plan.id}
            >
              {plan.name} <span className="block text-xs">{plan.price}</span>
            </button>
          ))}
        </div>
      </div>
      <button className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50" onClick={handleSubscribe} disabled={loading}>
        {loading ? 'Redirecting to checkout...' : 'Subscribe'}
      </button>
      {status && <div className="mt-4">Subscription status: <span className="font-semibold">{status}</span></div>}
      {success && <div className="text-green-600 mt-2">Subscription updated!</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
}
