import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = 'https://kxjmzluxsmbyvjlvznwd.supabase.co'
export const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4am16bHV4c21ieXZqbHZ6bndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMTkyOTMsImV4cCI6MjEwNjU5NTI5M30.DKxmlh34ZjSrfQTUJIE5-Bmw0zBUVKYLXn9wVkS4kgA'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
