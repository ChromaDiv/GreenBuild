// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Accessing variables defined in your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Error handling to ensure the app doesn't crash if variables are missing
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase Environment Variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);