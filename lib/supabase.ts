import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = 'https://dccjryybmmnqmvuqriky.supabase.co'
export const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjY2pyeXlibW1ucW12dXFyaWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMTU3NjgsImV4cCI6MjEwNjU5MTc2OH0.v-OcU2DMyvCPrAtqk5c-bkiZ8DzQOnQqH7rXSb-TuRQ'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
