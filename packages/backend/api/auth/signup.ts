import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

interface SignupRequestBody {
  email: string;
  password: string;
  full_name?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, full_name }: SignupRequestBody = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Create user in Supabase Auth
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { full_name },
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  // Optionally, insert profile row
  if (full_name) {
    await supabase.from('profiles').insert([{ id: data.user?.id, full_name }]);
  }

  return res.status(201).json({ user: data.user });
}
