// config/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// process.env.SUPABASE_URL and process.env.SUPABASE_SERVICE_ROLE_KEY
// are loaded from the .env file by the main server.js
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('Supabase client initialized.');

export default supabase;