import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://lxykzuyeaglmvhjkfeyz.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
