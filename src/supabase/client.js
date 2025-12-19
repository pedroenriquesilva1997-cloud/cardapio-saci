import { createClient } from '@supabase/supabase-js'

// URL do seu projeto
const supabaseUrl = 'https://vjclhiwjwxyyxhwurmgc.supabase.co'

// Chave anon public (publishable)
const supabaseAnonKey = 'sb_publishable_i7u7UKMgKpAUnfnhjoMXJw_K0njQPBy'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)