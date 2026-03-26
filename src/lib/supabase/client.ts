import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Supabase client for use in Client Components.
 * Uses empty strings as fallback during build/SSG to prevent crashes.
 * At runtime in the browser, the env vars will always be present.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
