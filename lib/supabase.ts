import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://otkczodeibqlipcnvbrbz.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90a2N6b2RlaWJxbGlwY252YnJieiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzI3ODg4ODAwLCJleHAiOjIwNDM0NjQ4MDB9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
