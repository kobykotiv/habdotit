import { createClient } from '@supabase/supabase-js';

// Check if required environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create Supabase client if environment variables are available
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Helper function to check if we're in demo mode
export const isDemoMode = () => !supabase;