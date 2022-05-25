import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://jrugfaoxntlwglpqvnvx.supabase.co', process.env.SUPA_BASE_KEY)