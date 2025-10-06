import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Créer un client Supabase même sans les vraies variables d'environnement
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
