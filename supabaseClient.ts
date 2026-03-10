// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 这里的 export 很重要，否则别的文件找不到它
export const supabase = createClient(supabaseUrl, supabaseAnonKey);