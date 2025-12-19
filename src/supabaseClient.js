import { createClient } from '@supabase/supabase-js';

// URL do seu novo projeto Supabase
const supabaseUrl = 'https://tfxsfmjsbvvadzppuujy.supabase.co';

// Chave pública (anon public) do seu projeto
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmeHNmbWpzYnZ2YWR6cHB1dWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNDU2MTIsImV4cCI6MjA4MTYyMTYxMn0.OIrHZ_tlMZC_3GlWTCsbPHfsSoUfXDEVZucZ5xgvLGI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);