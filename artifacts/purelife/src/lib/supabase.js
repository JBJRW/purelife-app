import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL 
  || 'https://slcvymfgcpoafjufaplx.supabase.co'

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY 
  || 'sb_publishable_xYcEM0-Ki2WGVsVDNBIgtw_U2TwxcLA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
