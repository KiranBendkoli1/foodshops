import { createClient } from "@supabase/supabase-js";

// TODO: Replace these with your actual Supabase project URL and anonymous key.
// These should ideally be stored in environment variables (e.g., process.env.REACT_APP_SUPABASE_URL).
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "YOUR_SUPABASE_URL";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
