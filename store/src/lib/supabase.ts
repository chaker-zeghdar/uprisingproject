import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isConfigured) {
  console.warn(
    'Supabase credentials missing. The app will not be able to fetch data. ' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.'
  );
}

// Create a proxy to handle cases where supabase is used but not configured
const supabaseClient = isConfigured 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : new Proxy({} as SupabaseClient, {
      get: () => {
        throw new Error(
          'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.'
        );
      }
    });

export { isConfigured };
export const supabase = supabaseClient;
