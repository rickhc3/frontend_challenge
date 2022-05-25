import { createClient } from '@supabase/supabase-js'

const key = process.env.supabasekey


export const supabase = createClient('https://jrugfaoxntlwglpqvnvx.supabase.co', key)