import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = "https://tbgwudnxjwplqtkjihxc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZ3d1ZG54andwbHF0a2ppaHhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczODcwMTcsImV4cCI6MjA2Mjk2MzAxN30.igHgYl_-vLhuz_AuwvK-ykmydbJI5VJRpxV-HICJcz0";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
