import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

let supabase: ReturnType<typeof createClient> | { from: () => { select: () => Promise<{ data: any[]; error: null }> } };

if (process.env.NODE_ENV === 'test' && (!supabaseUrl || !supabaseServiceRoleKey)) {
  supabase = {
    from: () => ({ select: async () => ({ data: [], error: null }) }),
  } as const;
} else {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase environment variables');
  }
  supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
}

export { supabase };
