import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Signup() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSuccess(true);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">{t('Sign Up')}</h1>
      <form onSubmit={handleSignup} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          type="email"
          placeholder={t('Email')}
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border p-2 rounded"
          type="password"
          placeholder={t('Password')}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          className="w-full border p-2 rounded"
          type="text"
          placeholder={t('Full Name')}
          value={fullName}
          onChange={e => setFullName(e.target.value)}
        />
        <button
          className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? t('Signing up...') : t('Sign Up')}
        </button>
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{t('Signup successful! Check your email.')}</div>}
      </form>
    </div>
  );
}
